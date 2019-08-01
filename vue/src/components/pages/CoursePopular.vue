<template>
  <v-layout row wrap>
    <v-flex xs12>
      <div class="headline">Popular Courses</div>
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
      </v-layout>
    </v-flex>
    <v-flex xs12>
      <v-container grid-list-xl>
        <v-layout row wrap justify-center justify-space-between>
          <template v-for="(item, index) in items.slice(0,3)">
            <v-flex :key="index" sm12 md4>
              <v-card>
                <v-card-title>
                  <div class="headline">{{index+1}}</div>
                  <div>{{item.course + ' - ' + item._join.course.title}}</div>
                </v-card-title>
                <v-card-text>
                  <v-layout row wrap>
                    <v-flex xs12>{{item._join.department.deptName + ` (${item.year})`}}</v-flex>
                    <v-flex xs12>Enrolled: {{printEnrolled(item)}}</v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-flex>
          </template>
        </v-layout>
      </v-container>
    </v-flex>
    <v-flex v-if="items.length > 3" xs12>
      <v-list dense three-line>
        <template v-for="(item, index) in items.slice(3)">
          <v-divider v-if="index > 0" :key="'d-'+index" />
          <v-list-item :key="'t-'+index">
            <v-list-item-avatar>{{index+4}}</v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>{{item.course + ' - ' + item._join.course.title}}</v-list-item-title>
              <v-list-item-subtitle>{{item._join.department.deptName + ` (${item.year})`}}</v-list-item-subtitle>
              <v-list-item-subtitle>Enrolled: {{printEnrolled(item)}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      departments: [],
      items: [],
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
      let result = await this.$api.getJoinedOffers(this.filter, {
        page: { size: 10, number: 1 },
        sort: "-enrolledCount"
      });
      if (result.error) {
        console.error(result.error);
      } else {
        this.items = result.data;
      }
      this.loading = false;
    },
    printEnrolled(item) {
      return `${item.enrolledCount}/${item.classSize} (${(item.enrolledCount /
        item.classSize) *
        100}%)`;
    }
  }
};
</script>
