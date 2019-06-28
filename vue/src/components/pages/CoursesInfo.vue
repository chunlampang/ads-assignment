<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          b) List the information of courses offered by the CS or IS departments in 2016.
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm6>
                <v-select
                  :items="departments"
                  item-text="deptName"
                  item-value="_id"
                  label="Department(s)"
                  v-model="filter.department"
                  multiple
                  clearable
                  chips
                ></v-select>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field type="number" v-model="filter.year" label="Year"/>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
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
            <td>{{ props.item._join.course._id }}</td>
            <td>{{ props.item._join.course.title }}</td>
            <td>{{ props.item.department }}</td>
            <td>{{ props.item.year }}</td>
            <td>{{ props.item.classSize }}</td>
            <td>{{ props.item.availablePlaces }}</td>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      departments: [],
      headers: [
        { text: "ID", value: "_join.course._id" },
        { text: "Title", value: "_join.course.title" },
        { text: "Department", value: "department" },
        { text: "Year", value: "year" },
        { text: "Class Size", value: "classSize" },
        { text: "Available Places", value: "availablePlaces" }
      ],
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
    this.loadOptions();
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
    async loadOptions() {
      let result = await this.$api.getDepartments();
      if (result.error) {
        console.error(result.error);
      } else {
        this.departments = result.data;
      }
    },
    async search() {
      this.loading = true;
      let result = await this.$api.getJoinedOffers(
        this.filter,
        this.apiOptions
      );
      if (result.error) {
        console.error(result.error);
      } else {
        this.items = result;
      }
      this.loading = false;
    }
  }
};
</script>
