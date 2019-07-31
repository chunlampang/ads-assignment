<template>
  <v-layout row wrap>
    <v-flex xs12>
      <div class="headline">{{value.plural}}</div>
      <v-divider class="primary" />
      <v-alert :value="alert.show" :type="alert.type">{{alert.msg}}</v-alert>
    </v-flex>

    <v-flex xs12></v-flex>
    <v-flex class="mt-4" xs12>
      <v-data-table
        :headers="headers"
        :items="items.data"
        :tserver-items-length="items.meta.total"
        :options.sync="pagination"
        :loading="loading"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar color="primary" dark dense flat>
            <v-btn
              :to="{ name: 'maint-' + value.singular, params: { id: 'new' } }"
              class="text-none"
              text
            >{{'New ' + value.singular}}</v-btn>
            <v-spacer />
            <v-divider class="mx-2" vertical inset></v-divider>
            <v-btn @click="search" icon>
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-toolbar>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header expand-icon="mdi-magnify" disable-icon-rotate>Search</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-form ref="searchForm" v-model="filter.valid" @submit.prevent="search">
                  <v-layout row wrap>
                    <template v-for="(field, fieldName) in value.fields">
                      <template v-if="field.view.includes('filter')">
                        <v-flex :key="fieldName" xs12>
                          <template v-if="field.type === 'number'">
                            <v-container pa-0 grid-list-xl>
                              <v-layout>
                                <v-flex xs6>
                                  <v-text-field
                                    type="number"
                                    v-model="filter.params[fieldName].from"
                                    :label="field.label + ' (From)'"
                                  />
                                </v-flex>
                                <v-flex xs6>
                                  <v-text-field
                                    type="number"
                                    v-model="filter.params[fieldName].to"
                                    :label="field.label+ ' (To)'"
                                  />
                                </v-flex>
                              </v-layout>
                            </v-container>
                          </template>
                          <v-autocomplete
                            v-else-if="field.type === 'string'"
                            v-model="filter.params[fieldName]"
                            :loading="filter.loading[fieldName]"
                            :items="filter.options[fieldName]"
                            item-value="_id"
                            item-text="_id"
                            :search-input="autoCompleteSearch(fieldName)"
                            @update:search-input="state = $event"
                            flat
                            no-filter
                            :label="field.label"
                          >
                            <template v-slot:item="data">
                              <v-list-item-content>
                                <v-list-item-title v-html="data.item[fieldName]"></v-list-item-title>
                              </v-list-item-content>
                            </template>
                          </v-autocomplete>
                        </v-flex>
                      </template>
                    </template>
                    <v-flex xs12>
                      <v-btn type="submit" :disabled="!filter.valid" class="text-none">Search</v-btn>
                      <v-btn @click="resetFilter" class="text-none">Reset</v-btn>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </template>
        <template v-slot:items="{ item }">
          <template v-for="(field, fieldName) in value.fields">
            <td v-if="field.view.includes('list')" :key="fieldName">
              <template v-if="field.type === 'date'">{{$utils.dateToString(item[fieldName])}}</template>
              <template v-else>{{item[fieldName] }}</template>
            </td>
          </template>
          <td width="152px">
            <v-btn :to="{ name: 'maint-' + value.singular, params: { id: item._id }}" icon>
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn @click="showDeleteDialog(item)" icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>
        </template>
      </v-data-table>
      <v-dialog v-model="deleteDialog.visible" width="500">
        <v-card>
          <v-card-title class="headline grey lighten-2" primary-title>Warning</v-card-title>
          <v-card-text>Confirm Delete?</v-card-text>
          <v-divider></v-divider>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="deleteDialog.visible = false">Cancel</v-btn>
            <v-btn color="primary" text @click="deleteItem(deleteDialog.item)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  props: {
    value: Object
  },
  data() {
    console.log(this.$route);
    let headers = [];
    let filter = {
      valid: true,
      params: {},
      loading: {},
      options: {}
    };

    let fields = this.value.fields;
    for (let fieldName in fields) {
      if (fields[fieldName].view.includes("filter")) {
        filter.params[fieldName] = {};
      }
      if (fields[fieldName].view.includes("list")) {
        headers.push({
          text: fields[fieldName].label,
          value: fieldName
        });
      }
    }

    headers.push({ text: "Actions", value: "", sortable: false });

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
        sortBy: "",
        descending: false,
        page: 1,
        rowsPerPage: 10
      },
      deleteDialog: { visible: false, item: null },
      alert: {
        show: false
      },
      filter
    };
  },
  computed: {
    apiOptions() {
      let sort = this.pagination.sortBy;
      if (this.pagination.descending) sort = "-" + sort;

      let size = this.pagination.rowsPerPage;
      if (size === -1) size = "";

      return {
        page: {
          size,
          number: this.pagination.page
        },
        sort
      };
    }
  },
  watch: {
    apiOptions() {
      this.search();
    },
    filter: {
      handler(val) {
        this.search();
      },
      deep: true
    }
  },
  methods: {
    async search() {
      this.loading = true;
      let result = await this.$api.query("/" + this.value.collection, {
        filter: this.filter,
        ...this.apiOptions
      });
      if (result.error) {
        console.error(result.error);
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
        "/" + this.value.collection,
        item._id
      );
      if (result.ok) {
        this.alert = {
          show: true,
          type: "success",
          msg: `${item._id} is deleted.`
        };

        this.search();
      }
    },
    resetFilter() {
      this.alert.show = false;
      this.$refs.searchForm.reset();
    },
    autoCompleteSearch(field) {
      console.log(field);
      /*
      this.students.loading = true;
      let result = await this.$api.getStudents(
        { search: ".*" + search + ".*" },
        { page: { size: 10 } }
      );
      if (result.error) {
        console.error(result.error);
      } else {
        this.students.items = result.data;
      }
      this.students.loading = false;
      */
    }
  }
};
</script>
