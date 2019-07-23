<template>
  <v-layout row wrap>
    <v-flex xs12>
      <div class="headline">{{value.plural}}</div>
      <v-divider class="primary" />
      <v-alert :value="alert.show" :type="alert.type">{{alert.msg}}</v-alert>
    </v-flex>
    <v-flex class="mt-4" xs12>
      <v-toolbar color="primary" dark dense flat>
        <v-btn
          :to="{ name: value.singular, params: { id: 'new' } }"
          class="text-none"
          flat
        >{{'New ' + value.singular}}</v-btn>
        <v-spacer />
        <v-divider class="mx-2" vertical inset></v-divider>
        <v-btn @click="search" flat icon>
          <v-icon>refresh</v-icon>
        </v-btn>
      </v-toolbar>
      <v-data-table
        :headers="headers"
        :items="items.data"
        :total-items="items.meta.total"
        :pagination.sync="pagination"
        :loading="loading"
        disable-initial-sort
        class="elevation-1"
        flat
      >
        <template v-slot:items="{ item }">
          <td v-for="(field, fieldName) in value.fields" :key="fieldName">
            <template v-if="field.type === Date">{{$utils.dateToString(item[fieldName])}}</template>
            <template v-else>{{item[fieldName] }}</template>
          </td>
          <td width="152px">
            <v-btn :to="{ name: value.singular, params: { id: item._id }}" icon>
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn @click="showDeleteDialog(item)" icon>
              <v-icon>delete</v-icon>
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
            <v-btn color="primary" flat @click="deleteDialog.visible = false">Cancel</v-btn>
            <v-btn color="primary" flat @click="deleteItem(deleteDialog.item)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  props: {
    value: Function
  },
  data() {
    let headers = [];

    let fields = this.value.fields;
    for (let fieldName in fields) {
      headers.push({
        text: fields[fieldName].label,
        value: fieldName
      });
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
      filter: {
        department: [],
        year: null
      },
      deleteDialog: { visible: false, item: null },
      alert: {
        show: false
      }
    };
  },
  created() {
    console.log(new this.value());
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
      let result = await this.$api.query(this.value.apiPath, {
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
      let result = await this.$api.delete(this.value.apiPath, item._id);
      if (result.ok) {
        this.alert = {
          show: true,
          type: "success",
          msg: `${item._id} is deleted.`
        };

        this.search();
      }
    }
  }
};
</script>
