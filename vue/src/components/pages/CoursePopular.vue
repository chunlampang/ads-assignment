<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          c) Find the information of the course which is the most popular course enrolled by students.
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 sm6>
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
              <v-flex xs12 sm6>
                <v-text-field type="number" v-model="filter.year" label="Year"/>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex v-if="item" xs12>
        <v-card>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12>{{ item._join.course._id }}</v-flex>
              <v-flex xs12>{{ item._join.course.title }}</v-flex>
              <v-flex xs12>{{ item.department }}</v-flex>
              <v-flex xs12>{{ item.year }}</v-flex>
              <v-flex xs12>{{ item }}</v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
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
        { text: "Year", value: "year" }
      ],
      item: null,
      loading: false,
      filter: {
        department: [],
        year: null
      }
    };
  },
  created() {
    this.loadOptions();
    this.search();
  },
  watch: {
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
      let result = await this.$api.getMostPopularCourse(this.filter);
      if (result.error) {
        console.error(result.error);
      } else {
        this.item = result.data[0];
      }
      this.loading = false;
    }
  }
};
</script>
