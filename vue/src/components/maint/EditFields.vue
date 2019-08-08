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
              :item-text="$api.getOptionItemText(entities[field.entity])"
              :items="options[field.entity]"
              :label="field.label + (required(field)?' *':'')"
              :readonly="readonly(field)"
              :append-icon="readonly(field)?'mdi-pencil-off':null"
              :clearable="!readonly(field)"
            />
            <template v-else-if="field.type === 'fieldset'">
              <v-expansion-panels v-model="activeFieldsetPanels[fieldName]" class="mb-4">
                <v-expansion-panel>
                  <v-expansion-panel-header ripple>
                    <h4 class="title font-weight-regular">{{field.label}}</h4>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <EditFields
                      v-model="value[fieldName]"
                      :fields="configs.fieldsets[field.fieldset].fields"
                      :id="id"
                    />
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </template>
            <template v-else-if="field.type === 'list'">
              <v-card>
                <v-card-title>
                  <div>
                    <h4 class="title font-weight-regular">{{field.label}}</h4>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn @click="showDeleteDialog(fieldName)" v-on="on" small icon>
                          <v-icon>mdi-delete</v-icon>
                        </v-btn>
                      </template>
                      <span>Delete</span>
                    </v-tooltip>
                    <span class="subtitle-1">Selected: {{getSelectedCount(fieldName)}}</span>
                  </div>
                </v-card-title>
                <v-card-text>
                  <v-data-iterator :items="value[fieldName]" :items-per-page="5">
                    <template v-slot:default="props">
                      <v-card v-for="(item, index) in props.items" :key="index" flat>
                        <v-card-title>
                          <v-checkbox
                            :key="props.pagination.pageStart + index"
                            v-model="selected[fieldName][props.pagination.pageStart + index]"
                          >
                            <template v-slot:label>
                              <div
                                class="title primary--text font-weight-regular"
                              >{{props.pagination.pageStart + index + 1 }}</div>
                            </template>
                          </v-checkbox>
                          <v-divider class="primary ml-6" />
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

    <v-dialog v-model="deleteDialog.visible" width="400">
      <v-card>
        <v-card-title class="headline" primary-title>Are you confirm to delete?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog.visible = false">Cancel</v-btn>
          <v-btn color="primary" text @click="deleteItem()">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import DateField from "@/components/blocks/DateField";
import DatetimeField from "@/components/blocks/DatetimeField";
import EditFields from "./EditFields";
import loadOptionsMixin from "./loadOptionsMixin";

export default {
  name: "EditFields",
  mixins: [loadOptionsMixin],
  components: { DateField, DatetimeField, EditFields },
  props: {
    fields: Object,
    value: Object,
    id: String | Number
  },
  inject: ["configs"],
  data() {
    let editFields = {},
      activeFieldsetPanels = {},
      selected = {},
      calFields = [];

    for (let fieldName in this.fields) {
      const field = this.fields[fieldName];
      if (!field.view.includes("edit")) continue;
      editFields[fieldName] = field;

      switch (field.type) {
        case "fieldset":
          activeFieldsetPanels[fieldName] = 0;
          if (this.id === "new") {
            this.value[fieldName] = {};
          }
          continue;
        case "list":
          selected[fieldName] = [];
          break;
      }

      if (field.cal) {
        console.log(field.cal);

        calFields[fieldName] = field.cal.fc;
        /*
        this.$watch('calFields.'+fieldName, v => {
          this.value[fieldName] = v;
        });
        */
      }
    }

    return {
      loading: true,
      rulesCache: {},
      selected,
      calFields,
      deleteDialog: {
        visible: false,
        fieldName: null
      },
      activeFieldsetPanels,
      editFields
    };
  },
  async created() {
    await this.initOptions(this.editFields);

    this.loading = false;
  },
  methods: {
    getSelectedCount(fieldName) {
      let count = 0;
      let checkboxs = this.selected[fieldName];
      for (let i = 0; i < checkboxs.length; i++) {
        if (checkboxs[i]) {
          count++;
        }
      }
      return count;
    },
    showDeleteDialog(fieldName) {
      this.deleteDialog.visible = true;
      this.deleteDialog.fieldName = fieldName;
    },
    deleteItem() {
      let indexs = this.selected[this.deleteDialog.fieldName];

      console.log(indexs);
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
