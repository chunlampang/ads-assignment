<template>
  <v-container>
    <v-layout v-if="!loading" row wrap>
      <template v-for="(field, fieldName) in editFields">
        <v-flex :key="fieldName" xs12>
          <template v-if="fieldsetSrc && fieldsetSrc.key === fieldName">
            <v-combobox
              v-model="fieldsetAutoInput.item"
              :label="field.label + (required(field)?' *':'')"
              :rules="getRules(field)"
              :readonly="readonly(field)"
              :loading="fieldsetAutoInput.loading"
              :items="fieldsetAutoInput.items"
              :item-value="fieldName"
              :item-text="fieldName"
              :search-input.sync="fieldsetAutoInput.input"
              no-filter
              dense
              hide-no-data
              validate-on-blur
              :placeholder="`Input '${fieldsRoot[fieldsetSrc.itemkey].label}' first`"
            >
              <template v-slot:item="data">
                <v-list-item-content>
                  <v-list-item-title v-html="data.item[fieldName]"></v-list-item-title>
                </v-list-item-content>
              </template>
            </v-combobox>
            <input type="hidden" :value="value[fieldName]" />
          </template>
          <v-select
            v-else-if="field.type === 'entity'"
            v-model="value[fieldName]"
            :label="field.label + (required(field)?' *':'')"
            :rules="getRules(field)"
            :readonly="readonly(field)"
            item-value="_id"
            :item-text="$api.getOptionItemText(entities[field.entity])"
            :items="options[field.entity]"
            :append-icon="readonly(field)?'mdi-pencil-off':null"
            :clearable="!readonly(field)"
          />
          <template v-else-if="field.type === 'fieldset'">
            <v-expansion-panels v-model="activeFieldsetPanels[fieldName]" class="mb-4 mt-2">
              <v-expansion-panel>
                <v-expansion-panel-header ripple>
                  <h4 class="title font-weight-regular">{{field.label}}</h4>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <EditFields
                    v-model="value[fieldName]"
                    :fields="configs.fieldsets[field.fieldset].fields"
                    :id="id"
                    :fieldsetSrc="field.src"
                    :fieldsRoot="fieldsRoot"
                    :valueRoot="valueRoot"
                  />
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </template>
          <EditFieldsList
            v-else-if="field.type === 'list'"
            v-model="value[fieldName]"
            :label="field.label"
            :rules="field.rules"
            :readonly="readonly(field)"
            :fields="field.fields"
          />
          <DateField
            v-else-if="field.type === 'date'"
            v-model="value[fieldName]"
            :label="field.label + (required(field)?' *':'')"
            :rules="getRules(field)"
            :readonly="readonly(field)"
          />
          <DatetimeField
            v-else-if="field.type === 'datetime'"
            v-model="value[fieldName]"
            :label="field.label + (required(field)?' *':'')"
            :rules="getRules(field)"
            :readonly="readonly(field)"
          />
          <v-text-field
            v-else
            :type="field.type === 'number'? 'number' : 'text'"
            v-model="value[fieldName]"
            :label="field.label +(required(field)?' *':'')"
            :rules="getRules(field)"
            :readonly="readonly(field)"
            :append-icon="readonly(field)?'mdi-pencil-off':null"
            :clearable="!readonly(field)"
          />
        </v-flex>
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
import EditFieldsList from "./EditFieldsList";
import loadOptionsMixin from "./loadOptionsMixin";

export default {
  name: "EditFields",
  mixins: [loadOptionsMixin],
  components: { DateField, DatetimeField, EditFieldsList },
  props: {
    fields: Object,
    fieldsRoot: {
      type: Object,
      default() {
        return this.fields;
      }
    },
    value: Object,
    valueRoot: {
      type: Object,
      default() {
        return this.value;
      }
    },
    id: String | Number,
    fieldsetSrc: Object
  },
  inject: ["configs"],
  data() {
    const editFields = {},
      activeFieldsetPanels = {},
      calOrder = [];

    for (let fieldName in this.fields) {
      const field = this.fields[fieldName];
      if (!field.view.includes("edit")) continue;
      editFields[fieldName] = field;

      switch (field.type) {
        case "fieldset":
          activeFieldsetPanels[fieldName] = 0;
          if (!this.value[fieldName]) this.value[fieldName] = {};
          continue;
        case "list":
          if (!this.value[fieldName]) this.value[fieldName] = [];
          continue;
      }

      if (field.cal) {
        if (!calOrder[field.cal.order]) calOrder[field.cal.order] = [];
        calOrder[field.cal.order].push({
          field: fieldName,
          fc: eval(`item => ${field.cal.fc}`)
        });
      }
    }

    const data = {
      loading: true,
      rulesCache: {},
      deleteDialog: {
        visible: false,
        fieldName: null
      },
      activeFieldsetPanels,
      editFields,
      calOrder
    };

    if (this.fieldsetSrc) {
      const fieldsetAutoInput = { loading: false, items: [], input: null };

      fieldsetAutoInput.item = this.value[this.fieldsetSrc.key];
      data.fieldsetAutoInput = fieldsetAutoInput;
    }

    return data;
  },
  async created() {
    await this.initOptions(this.editFields);
    if (this.fieldsetSrc) {
      this.$watch(
        "valueRoot." + this.fieldsetSrc.itemkey,
        this.getFieldsetSrcOption
      );
      this.getFieldsetSrcOption();
      this.$watch("fieldsetAutoInput.item", v => {
        if (typeof v === "object") Object.assign(this.value, v);
      });
    }

    for (let fieldName in this.editFields) {
      const field = this.fields[fieldName];
      if (field.cal) {
        this.$watch("calFields." + fieldName, v => {
          this.value[fieldName] = v;
        });
      }
    }
    this.loading = false;
  },
  computed: {
    calFields() {
      let calFields = {};

      for (let calIndex in this.calOrder) {
        let fcItems = this.calOrder[calIndex];
        for (let fcItem of fcItems) {
          calFields[fcItem.field] = fcItem.fc(this.value);
        }
      }
      return calFields;
    }
  },
  methods: {
    async getFieldsetSrcOption() {
      this.fieldsetAutoInput.loading = true;
      let { entity } = this.fieldsetSrc;

      let filter = {};

      let result;
      let id = this.valueRoot[this.fieldsetSrc.itemkey];
      if (id) {
        result = await this.$api.get(
          "/" + this.entities[entity].collection,
          this.valueRoot[this.fieldsetSrc.itemkey]
        );
        if (result.error) {
          console.error(result.error);
        } else {
          this.fieldsetAutoInput.items = [];

          for (let item of result.data.courses) {
            this.fieldsetAutoInput.items.push(item.course);
          }
        }
      }
      this.fieldsetAutoInput.loading = false;
    },
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
