<template>
  <v-container>
    <v-layout v-if="!loading" row wrap>
      <template v-for="(field, fieldName) in fields">
        <template v-if="field.view.includes('edit')">
          <v-flex :key="fieldName" xs12>
            <v-select
              v-if="field.type === 'entity'"
              v-model="value[fieldName]"
              :rules="getRules(field)"
              item-value="_id"
              :item-text="getOptionItemText(field.entity)"
              :items="options[field.entity]"
              :label="field.label + (required(field)?' *':'')"
              :readonly="readonly(field)"
              :append-icon="readonly(field)?'mdi-pencil-off':null"
              :clearable="!readonly(field)"
            />
            <template v-else-if="field.type === 'object'">
              <v-card>
                <v-card-title>{{field.label}}</v-card-title>
                <v-card-text>
                  <EditFields v-model="value[fieldName]" :fields="field.fields" />
                </v-card-text>
              </v-card>
            </template>
            <template v-else-if="field.type === 'objects'">
              <v-card>
                <v-card-title>
                  <h4 class="title font-weight-regular">{{field.label}}</h4>
                </v-card-title>
                <v-card-text>
                  <v-data-iterator :items="value[fieldName]" :items-per-page="5">
                    <template v-slot:default="props">
                      <v-card v-for="(item, index) in props.items" :key="index" flat>
                        <v-card-title>
                          <div
                            class="body-1 primary--text"
                          >{{props.pagination.pageStart + index + 1 }}</div>
                          <v-divider class="primary ml-8" />
                        </v-card-title>
                        <v-card-text>
                          <EditFields v-model="props.items[index]" :fields="field.fields" />
                        </v-card-text>
                      </v-card>
                    </template>
                  </v-data-iterator>
                </v-card-text>
              </v-card>
            </template>
            <DateField
              v-else-if="field.type === 'date'"
              v-model="value[fieldName]"
              :rules="getRules(field)"
              :label="field.label + (required(field)?' *':'')"
              :readonly="readonly(field)"
            />
            <DatetimeField
              v-else-if="field.type === 'datetime'"
              v-model="value[fieldName]"
              :rules="getRules(field)"
              :label="field.label + (required(field)?' *':'')"
              :readonly="readonly(field)"
            />
            <v-text-field
              v-else
              v-model="value[fieldName]"
              :type="field.type === 'number'? 'number' : 'text'"
              :rules="getRules(field)"
              :label="field.label +(required(field)?' *':'')"
              :readonly="readonly(field)"
              :append-icon="readonly(field)?'mdi-pencil-off':null"
              :clearable="!readonly(field)"
            />
          </v-flex>
        </template>
      </template>
    </v-layout>
    <v-layout v-else row wrap>
      <v-flex xs12>
        <h3 class="primary--text font-weight-light">Loading Options... Please wait</h3>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import DateField from "@/components/blocks/DateField";
import DatetimeField from "@/components/blocks/DatetimeField";
import EditFields from "./EditFields";

export default {
  name: "EditFields",
  components: { DateField, DatetimeField, EditFields },
  props: {
    fields: Object,
    value: Object,
    id: String | Number
  },
  inject: {
    entities: {},
    options: { default: {} },
    optionsRequests: { default: [] }
  },
  data() {
    return {
      loading: true,
      rulesCache: {}
    };
  },
  provide() {
    const provide = {};

    Object.defineProperty(provide, "options", {
      enumerable: true,
      get: () => this.options
    });
    Object.defineProperty(provide, "optionsRequests", {
      enumerable: true,
      get: () => this.optionsRequests
    });

    return provide;
  },
  async created() {
    await this.initOptions();
    this.loading = false;
  },
  methods: {
    getRules(field) {
      if (this.rulesCache[field.label]) return this.rulesCache[field.label];

      const rules = [];
      if (field.rules) {
        for (let ruleName of field.rules) {
          switch (ruleName) {
            case "required":
              rules.push(v => !!v || field.label + " is required.");
              break;
            case "integer":
              rules.push(
                v =>
                  Number.isInteger(Number(v)) ||
                  field.label + " should be an integer."
              );
              break;
            case "positive":
              rules.push(v => v >= 0 || field.label + " should be positive.");
              break;
          }
        }
      }

      return (this.rulesCache[field.label] = rules);
    },
    async initOptions() {
      for (let fieldName in this.fields) {
        const field = this.fields[fieldName];
        if (!field.view.includes("edit")) continue;
        if (field.type === "entity" || field.type === "entities") {
          if (!this.options[field.entity]) {
            this.options[field.entity] = [];
            this.optionsRequests.push(this.loadOptions(field.entity));
          }
        }
      }
      await Promise.all(this.optionsRequests);
    },
    async loadOptions(entityName) {
      const result = await this.$api.query(
        "/" + this.entities[entityName].collection
      );
      this.options[entityName] = result.data;
    },
    getOptionItemText(entityName) {
      const entity = this.entities[entityName];
      if (!entity.desc) return "_id";
      return item => eval(entity.desc);
    },
    readonly(field) {
      return (
        field.readonly === 2 || (field.readonly === 1 && this.id !== "new")
      );
    },
    required(field) {
      return field.rules && field.rules.includes("required");
    }
  }
};
</script>
