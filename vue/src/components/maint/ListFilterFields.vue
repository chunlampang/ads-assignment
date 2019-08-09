<template>
  <v-container>
    <v-layout v-if="!loading" row wrap>
      <v-flex v-for="(field, fieldName) in filterFields" :key="fieldName" xs12>
        <template v-if="field.type === 'number'">
          <v-container pa-0 grid-list-xl>
            <v-layout>
              <v-flex xs6>
                <v-text-field
                  type="number"
                  v-model="value[fieldName].from"
                  :label="field.label + ' (From)'"
                />
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  type="number"
                  v-model="value[fieldName].to"
                  :label="field.label + ' (To)'"
                />
              </v-flex>
            </v-layout>
          </v-container>
        </template>
        <template v-else-if="field.type === 'date'">
          <v-container pa-0 grid-list-xl>
            <v-layout>
              <v-flex xs6>
                <DateField v-model="value[fieldName].from" :label="field.label + ' (From)'" />
              </v-flex>
              <v-flex xs6>
                <DateField v-model="value[fieldName].to" :label="field.label + ' (To)'" />
              </v-flex>
            </v-layout>
          </v-container>
        </template>
        <template v-else-if="field.type === 'datetime'">
          <v-container pa-0 grid-list-xl>
            <v-layout>
              <v-flex xs6>
                <DateField v-model="value[fieldName].from" :label="field.label + ' (From)'" />
              </v-flex>
              <v-flex xs6>
                <DateField v-model="value[fieldName].to" :label="field.label + ' (To)'" />
              </v-flex>
            </v-layout>
          </v-container>
        </template>
        <v-select
          v-else-if="field.type === 'entity'"
          v-model="value[fieldName]"
          item-value="_id"
          :item-text="$api.getOptionItemText(entities[field.entity])"
          :items="options[field.entity]"
          :label="field.label"
          multiple
          clearable
          chips
          counter
        />
        <v-combobox
          v-else-if="field.type === 'string'"
          v-model="value[fieldName]"
          :loading="autoInput[fieldName].loading"
          :items="autoInput[fieldName].items"
          :item-value="fieldName"
          :item-text="fieldName"
          :search-input="autoInput[fieldName].input"
          @update:search-input="autoInput[fieldName].input = $event"
          @keyup.enter="search"
          no-filter
          dense
          hide-selected
          hide-no-data
          :label="field.label"
          :return-object="false"
        >
          <template v-slot:item="data">
            <v-list-item-content>
              <v-list-item-title v-html="data.item[fieldName]"></v-list-item-title>
            </v-list-item-content>
          </template>
        </v-combobox>
        <v-card v-else-if="field.type === 'fieldset'" class="mb-4 mt-2">
          <v-card-title>
            <h4 class="title font-weight-regular">{{field.label}}</h4>
          </v-card-title>
          <v-card-text>
            {{field}}
            <ListFilterFields
              :fields="configs.fieldsets[field.fieldset].fields"
              :viewType="viewType"
              :value="value[fieldName].$match"
              :collection="collection"
              :namespace="fieldName"
            />
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import DateField from "@/components/blocks/DateField";
import DatetimeField from "@/components/blocks/DatetimeField";
import loadOptionsMixin from "./loadOptionsMixin";
import ListFilterFields from "./ListFilterFields";

export default {
  name: "ListFilterFields",
  mixins: [loadOptionsMixin],
  components: { DateField, DatetimeField, ListFilterFields },
  props: {
    fields: Object,
    viewType: String,
    value: Object,
    collection: String
  },
  inject: ["configs"],
  data() {
    const fields = this.fields;
    const filterFields = {};
    const autoInput = {};

    for (let fieldName in fields) {
      const field = fields[fieldName];
      if (!field.view.includes(this.viewType)) continue;
      filterFields[fieldName] = field;

      switch (field.type) {
        case "fieldset":
          this.value[fieldName] = {
              $match:{}
          };
          break;
        case "number":
        case "date":
        case "datetime":
          this.value[fieldName] = {
            from: null,
            to: null
          };
          break;
        case "string":
          this.value[fieldName] = "";
          autoInput[fieldName] = {
            loading: false,
            items: [],
            input: null
          };
          break;
        default:
          this.value[fieldName] = null;
      }
    }

    return {
      loading: true,
      autoInput,
      filterFields
    };
  },
  async created() {
    await this.initOptions(this.filterFields);
    this.loading = false;
  },
  mounted() {
    for (let fieldName in this.filterFields) {
      const field = this.filterFields[fieldName];

      if (field.type === "string") {
        this.$watch(`autoInput.${fieldName}.input`, val => {
          this.autoCompleteSearch(fieldName, val);
        });
      }
    }
  },
  methods: {
    resetFilter() {
      this.$refs.form.reset();
    },
    search() {
      this.$emit("search", this.value);
    },
    async autoCompleteSearch(fieldName, val) {
      const autoInput = this.autoInput[fieldName];
      autoInput.loading = true;

      let filter = {};
      filter[fieldName] = ".*" + val + ".*";

      let result = await this.$api.query("/" + this.collection, {
        filter,
        page: { size: 5 },
        fields: fieldName
      });
      if (result.error) {
        console.error(result.error);
      } else {
        autoInput.items = result.data;
      }

      autoInput.loading = false;
    }
  }
};
</script>