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
      >
        <template v-slot:top>
          <ListFilter v-model="filter" :entity="entity" />
          <!-- tool -->
          <v-toolbar color="primary" dark dense flat>
            <v-btn
              :to="{ name: 'maint-' + entity.singular, params: { id: 'new' } }"
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
            <td style="min-width:120px">
              <!-- Actions -->
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    :to="{ name: 'maint-' + entity.singular, params: { id: item._id }}"
                    v-on="on"
                    small
                    icon
                  >
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
            <template v-for="(field, fieldName) in entity.fields">
              <td v-if="field.view.includes('list')" :key="fieldName" style="min-width:150px">
                <template v-if="field.type === 'date'">{{$utils.dateToString(item[fieldName])}}</template>
                <template v-else>{{item[fieldName] }}</template>
              </td>
            </template>
          </tr>
        </template>
      </v-data-table>
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

export default {
  components: { BaseAlert, ListFilter },
  props: {
    entity: Object
  },
  data() {
    let headers = [{ text: "Actions", value: "", sortable: false }];

    const fields = this.entity.fields;
    for (let fieldName in fields) {
      const field = fields[fieldName];
      if (!field.view.includes("list")) continue;

      headers.push({
        text: field.label,
        value: fieldName
      });
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
      deleteDialog: { visible: false, item: null },
      alert: {
        show: false
      },
      filter: {}
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
      this.alert.show = false;
      this.search();
    },
    filter: {
      handler(val) {
        console.log(val);
        this.search();
      },
      deep: true
    }
  },
  methods: {
    async search() {
      this.loading = true;
      let result = await this.$api.query("/" + this.entity.collection, {
        filter: this.filter,
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

        this.search();
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
