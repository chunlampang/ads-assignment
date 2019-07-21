<template>
  <v-layout row wrap>
    <v-flex xs12>
      <div class="headline">{{value.plural}}</div>
      <v-divider class="primary" />
    </v-flex>
    <v-flex xs12>
      <v-btn
        :to="{ name: 'department', params: { id: 'new' } }"
        class="text-none"
      >{{'New ' + value.singular}}</v-btn>
    </v-flex>
    <v-flex xs12>
      <v-data-table
        :headers="headers"
        :items="items.data"
        :total-items="items.meta.total"
        :pagination.sync="pagination"
        :loading="loading"
        disable-initial-sort
        class="elevation-1"
      >
        <template v-slot:items="props">
          <td
            v-for="field in headers.slice(0, headers.length-1)"
            :key="field.value"
          >{{ props.item[field.value] }}</td>
          <td>
            <v-icon class="mr-2" @click="editItem(props.item)">edit</v-icon>
            <v-icon @click="deleteItem(props.item)">delete</v-icon>
          </td>
        </template>
      </v-data-table>
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
    async deleteItem(item) {
      let result = await this.$api.delete(this.value.apiPath, item._id);
      if (result.ok) {
        this.search();
      }
    }
  }
};
</script>
