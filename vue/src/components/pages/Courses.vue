<template>
  <v-layout row wrap>
    <v-flex xs12>
      <div class="headline">Courses</div>
      <v-divider class="primary" />
    </v-flex>
    <v-flex xs12>
      <v-layout row wrap>
        <v-flex xs12>
          <v-select
            :items="departments"
            item-text="deptName"
            item-value="_id"
            label="Department(s)"
            v-model="filter.department"
            clearable
            chips
          ></v-select>
        </v-flex>
        <v-flex xs12>
          <v-text-field type="number" v-model="filter.year" label="Year" />
        </v-flex>
        <v-flex xs12>
          <v-autocomplete
            v-model="filter.student"
            :loading="students.loading"
            :items="students.items"
            item-value="_id"
            item-text="_id"
            :search-input.sync="students.search"
            flat
            no-filter
            label="Student ID"
          >
            <template v-slot:item="data">
              <v-list-item-content>
                <v-list-item-title v-html="data.item.stuName"></v-list-item-title>
                <v-list-item-sub-title v-html="data.item._id"></v-list-item-sub-title>
              </v-list-item-content>
            </template>
          </v-autocomplete>
        </v-flex>
      </v-layout>
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
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      departments: [],
      students: {
        search: null,
        loading: false,
        items: []
      },
      headers: [
        { text: "ID", value: "_join.course._id" },
        { text: "Title", value: "_join.course.title" },
        { text: "Department", value: "department" },
        { text: "Year", value: "year" }
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
        year: null,
        student: null
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
    "students.search"(val) {
      this.searchStudents(val);
    },
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
    async searchStudents(search) {
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
    },
    async search() {
      this.loading = true;
      let result = await this.$api.getCoursesTitle(
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
