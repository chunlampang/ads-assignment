<template>
  <v-data-table :headers="headers" :items="value" class="elevation-1">
    <template v-slot:top>
      <v-toolbar color="primary" dark dense flat>
        <v-toolbar-title class="mr-2">
          <h4 class="title font-weight-regular">{{label}}</h4>
        </v-toolbar-title>
        <v-divider class="mx-2" inset vertical />
        <v-tooltip v-if="!readonly" bottom>
          <template v-slot:activator="{ on }">
            <v-btn @click="showEditDialog('new')" v-on="on" small icon>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <span>{{'Add ' + label}}</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn @click="showDeleteDialog" v-on="on" small icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
          <span>Delete</span>
        </v-tooltip>
        <span class="subtitle-1">Selected: {{selectedCount}}</span>
      </v-toolbar>

      <v-dialog v-model="editDialog.visible" width="800">
        <v-form v-model="editDialog.valid" @submit.prevent="submitItem">
          <v-card v-if="editDialog.visible">
            <v-card-title class="primary white--text">
              {{(editDialog.index === -1?'New ':'Edit ') + label}}
              <v-spacer />
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="editDialog.visible = false" v-on="on" dark small icon>
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                <span>Close</span>
              </v-tooltip>
            </v-card-title>
            <v-card-text>
              <EditFields
                v-model="editDialog.item"
                :fields="fields"
                :id="editDialog.index===-1?'new':editDialog.index"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="resetItem" color="warning" text class="text-none">Reset</v-btn>
              <v-btn
                type="submit"
                :disabled="!editDialog.valid"
                color="primary"
                text
                class="text-none"
              >Submit</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>

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
    </template>
    <template v-slop:header.checkall="{ header }">
      <v-checkbox v-model="selectAll" />
    </template>
    <template v-slot:item="{ item }">
      <tr>
        <td v-if="!readonly">
          <v-checkbox v-model="selected[value.indexOf(item)]" />
        </td>
        <td>
          <!-- Actions -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="showEditDialog(item)" v-on="on" small icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Edit</span>
          </v-tooltip>
          <v-tooltip v-if="!readonly" bottom>
            <template v-slot:activator="{ on }">
              <v-btn @click="showDeleteDialogSingle(item)" v-on="on" small icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Delete</span>
          </v-tooltip>
        </td>
        <template v-for="(header, index) in headers">
          <template v-if="readonly && index > 0 || !readonly && index > 1">
            <td
              v-if="header.type === 'date'"
              :key="header.value"
            >{{$utils.dateToString(item[header.value])}}</td>
            <td
              v-else-if="header.type === 'datetime'"
              :key="header.value"
            >{{$utils.datetimeToString(item[header.value])}}</td>
            <td v-else :key="header.value">{{$utils.getVarByDotNotation(item,header.value)}}</td>
          </template>
        </template>
      </tr>
    </template>
  </v-data-table>
</template>

<script>
import EditFields from "./EditFields";

export default {
  name: "EditFieldsList",
  props: {
    fields: Object,
    value: Array,
    label: String,
    rules: Array,
    readonly: Boolean
  },
  inject: ["configs"],
  data() {
    const headers = [];
    if (!this.readonly)
      headers.push({
        text: "checkall",
        value: "checkall",
        sortable: false,
        width: 60
      });
    headers.push({
      text: "Actions",
      value: "",
      sortable: false,
      width: 120
    });

    const newItemObj = {};

    const listFields = [];
    const joinEntity = [];

    let instance = this;

    initList(this.fields);

    function initList(fields, namespace) {
      for (let fieldName in fields) {
        const field = fields[fieldName];
        if (!field.view.includes("list")) continue;

        if (namespace) fieldName = namespace + "." + fieldName;

        if (field.type === "fieldset") {
          let fieldset = instance.configs.fieldsets[field.fieldset];
          initList(fieldset.fields, fieldName);
          continue;
        }
        if (field.type === "list") {
          initList(field.fields, fieldName);
          continue;
        }
        //default
        headers.push({
          text: field.label,
          type: field.type,
          value: fieldName,
          width: 120
        });
        listFields.push(fieldName);
      }
    }

    initEdit(this.fields);

    function initEdit(fields, namespace) {
      for (let fieldName in fields) {
        const field = fields[fieldName];
        if (!field.view.includes("edit")) continue;

        if (namespace) fieldName = namespace + "." + fieldName;

        let val = field.default ? eval(field.default) : null;
        instance.$utils.setVarByDotNotation(newItemObj, fieldName, val);

        if (field.type === "fieldset") {
          let fieldset = instance.configs.fieldsets[field.fieldset];
          initEdit(fieldset.fields, fieldName);
          continue;
        }
      }
    }

    return {
      headers,
      selected: [],
      newItemObj,
      editDialog: { visible: false, item: null, valid: false, index: -1 },
      deleteDialog: {
        visible: false,
        items: []
      }
    };
  },
  computed: {
    selectedCount() {
      let count = 0;
      for (let i = 0; i < this.selected.length; i++) {
        if (this.selected[i]) count++;
      }
      return count;
    },
    selectAll: {
      get() {
        return this.selectedCount === this.selected.length;
      },
      set(v) {
        for (let i = 0; i < this.selected.length; i++) {
          this.selected[i] = v;
        }
      }
    }
  },
  methods: {
    showEditDialog(item) {
      if (item === "new") {
        this.editDialog.index = -1;
        item = this.newItemObj;
      } else {
        this.editDialog.index = this.value.indexOf(item);
      }
      this.editDialog.item = this.$utils.cloneVarDeep(item);
      this.editDialog.visible = true;
    },
    submitItem() {
      if (this.editDialog.index === -1) {
        this.value.push(this.editDialog.item);
      } else {
        Object.assign(this.value[this.editDialog.index], this.editDialog.item);
      }
      this.editDialog.visible = false;
    },
    resetItem() {
      this.editDialog.item = this.$utils.cloneVarDeep(
        this.value[this.editDialog.index]
      );
    },
    showDeleteDialogSingle(item) {
      this.deleteDialog.items = [item];
      this.deleteDialog.visible = true;
    },
    showDeleteDialog() {
      let items = [];

      for (let i = 0; i < this.selected.length; i++) {
        if (this.selected[i]) items.push(this.value[i]);
      }
      this.deleteDialog.items = items;
      this.deleteDialog.visible = true;
    },
    deleteItem() {
      this.$utils.removeItemsFromArray(this.value, this.deleteDialog.items);
      this.deleteDialog.visible = false;
      this.deleteDialog.items = [];
      this.selected = [];
    }
  }
};
</script>