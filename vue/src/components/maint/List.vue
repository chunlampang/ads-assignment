<template>
  <v-layout row wrap>
    <v-flex xs12>
      <div class="headline">{{entity.plural}}</div>
      <v-divider class="primary" />
      <BaseAlert :value="alert.show" :type="alert.type" :msg="alert.msg" />
    </v-flex>
    <v-flex class="mt-4" xs12>
      <v-data-table
        :headers="headers"
        :items="items.data"
        :server-items-length="items.meta.total"
        :options.sync="pagination"
        :loading="loading"
        multi-sort
        class="elevation-1"
        id="maint-data-list"
      >
        <template v-slot:top>
          <ListFilter v-model="filter" :entity="entity" @search="search(true)" />
          <!-- tool -->
          <v-toolbar color="primary" dark dense flat>
            <v-btn
              @click="showEditDialog('new')"
              class="text-none"
              text
            >{{'New ' + entity.singular}}</v-btn>
            <v-spacer />
            <v-divider class="mx-2" vertical inset></v-divider>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn @click="search" v-on="on" icon>
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </template>
              <span>Refresh</span>
            </v-tooltip>
          </v-toolbar>
        </template>
        <!-- List -->
        <template v-slot:item="{ item }">
          <tr>
            <td>
              <!-- Actions -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="showEditDialog(item._id)" v-on="on" small icon>
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Edit</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn @click="showDeleteDialog(item)" v-on="on" small icon>
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
                <span>Delete</span>
              </v-tooltip>
            </td>
            <template v-for="(header, index) in headers">
              <template v-if="index > 0">
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
      <v-dialog v-model="editDialog.visible" width="800">
        <v-card v-if="editDialog.visible">
          <v-card-title class="primary white--text">
            {{(editDialog.id==='new'?'New ':'Edit ') + entity.singular}}
            <v-spacer />
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  :to="{ name: 'maint-' + entity.singular, params: { id: editDialog.id }}"
                  target="_blank"
                  v-on="on"
                  dark
                  small
                  icon
                >
                  <v-icon>mdi-open-in-new</v-icon>
                </v-btn>
              </template>
              <span>Open in new tab</span>
            </v-tooltip>
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn @click="editDialog.visible = false" v-on="on" dark small icon>
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
              <span>Close</span>
            </v-tooltip>
          </v-card-title>
          <EditForm
            :id="editDialog.id"
            :entity="entity"
            @updated="itemUpdated"
            style="overflow-y: auto; max-height:600px"
          />
        </v-card>
      </v-dialog>
      <v-dialog v-model="deleteDialog.visible" width="400">
        <v-card>
          <v-card-title class="headline" primary-title>Are you confirm to delete?</v-card-title>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="deleteDialog.visible = false">Cancel</v-btn>
            <v-btn color="primary" text @click="deleteItem(deleteDialog.item)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>
<script>
import BaseAlert from "@/components/blocks/BaseAlert";
import ListFilter from "./ListFilter";
import EditForm from "./EditForm";

export default {
  components: { BaseAlert, ListFilter, EditForm },
  props: {
    entity: Object
  },
  inject: ["entities"],
  data() {
    const headers = [{ text: "Actions", value: "", sortable: false }];
    const listFields = [];
    const joinEntity = [];

    const fields = this.entity.fields;
    for (let fieldName in fields) {
      const field = fields[fieldName];
      if (!field.view.includes("list")) continue;

      if (field.type === "entity") {
        let entity = this.entities[field.entity];

        if (entity.desc) {
          joinEntity.push(field.entity);

          if (entity.desc.key) {
            let key = entity.fields[entity.desc.key];
            let dotKey = `_join.${field.entity}.${entity.desc.key}`;
            headers.push({
              text: key.label,
              type: field.type + "-key",
              value: dotKey
            });
            listFields.push(dotKey);
          }

          if (entity.desc.label) {
            let label = entity.fields[entity.desc.label];
            let dotLabel = `_join.${field.entity}.${entity.desc.label}`;
            headers.push({
              text: label.label,
              type: field.type + "-label",
              value: dotLabel
            });
            listFields.push(dotLabel);
          }
          continue;
        } //else default
      }
      //default
      headers.push({
        text: field.label,
        type: field.type,
        value: fieldName
      });
      listFields.push(fieldName);
    }

    return {
      headers,
      items: {
        meta: {
          total: 0
        },
        data: []
      },
      loading: false,
      pagination: {
        sortBy: [],
        sortDesc: [],
        page: 1,
        itemsPerPage: 10
      },
      editDialog: { visible: false, id: null },
      deleteDialog: { visible: false, item: null },
      alert: {
        show: false
      },
      filter: {},
      listFields,
      joinEntity
    };
  },
  computed: {
    apiOptions() {
      const { sortBy, sortDesc, itemsPerPage } = this.pagination;
      //sort
      let sort = [];
      for (let i = 0; i < sortBy.length; i++) {
        sort.push(sortDesc[i] ? "-" + sortBy[i] : sortBy[i]);
      }
      //page
      let page;
      if (itemsPerPage !== -1) {
        page = {
          size: itemsPerPage,
          number: this.pagination.page
        };
      }
      return { page, sort };
    }
  },
  watch: {
    apiOptions() {
      this.search();
    },
    "editDialog.visible"(v) {
      if (!v) {
        this.query();
      }
    }
  },
  methods: {
    search(toFirstPage) {
      if (toFirstPage && this.pagination.page !== 1) {
        let newOptions = {};
        Object.assign(newOptions, this.pagination);
        newOptions.page = 1;
        this.pagination = newOptions;
        return;
      }
      this.alert.show = false;
      this.query();
    },
    async query() {
      this.loading = true;
      let result = await this.$api.query("/" + this.entity.collection, {
        filter: this.filter,
        fields: this.listFields,
        join: this.joinEntity,
        ...this.apiOptions
      });
      if (result.error) {
        this.showError(result.error);
      } else {
        this.items = result;
      }
      this.loading = false;
    },
    editItem(item) {
      this.$router.push({
        name: "department",
        params: { id: item._id }
      });
    },
    showEditDialog(id) {
      this.editDialog.visible = true;
      this.editDialog.id = id;
    },
    itemUpdated(data) {
      if (this.editDialog.id === "new") {
        this.editDialog.id = data._id;
      }
    },
    showDeleteDialog(item) {
      this.deleteDialog.visible = true;
      this.deleteDialog.item = item;
    },
    async deleteItem(item) {
      this.deleteDialog.visible = false;
      let result = await this.$api.delete(
        "/" + this.entity.collection,
        item._id
      );
      if (result.ok) {
        this.alert = {
          show: true,
          type: "success",
          msg: `${item._id} is deleted.`
        };

        this.query();
      } else if (result.error) {
        this.showError(result.error);
      }
    },
    showError(msg) {
      this.alert = {
        show: true,
        type: "error",
        msg
      };
    }
  }
};
</script>
<style scoped>
#maint-data-list >>> thead th {
  white-space: nowrap;
  min-width: 100px;
}
#maint-data-list >>> thead th:first-child {
  min-width: 120px;
}
</style>
