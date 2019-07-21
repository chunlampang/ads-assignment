<template>
  <v-layout row wrap>
    <v-flex xs12>
      <div class="headline">Popular courses</div>
      <v-divider class="primary" />
    </v-flex>
    <v-flex xs12>
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
          <v-text-field type="number" v-model="filter.year" label="Year" />
        </v-flex>
      </v-layout>
    </v-flex>
    <template v-for="(item, index) in items">
      <v-flex v-if="index < 3" :key="index" xs12 sm4>
        <v-card>
          <v-card-title>
            <div class="headline">{{index+1}}</div>
            {{item.course + ' - ' + item._join.course.title}}
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
    <v-flex v-if="items.length > 3" xs12>
      <v-list dense three-line>
        <template v-for="(item, index) in items.slice(3)">
          <v-divider v-if="index > 0" :key="'d-'+index" />
          <v-list-tile :key="'t-'+index">
            <v-list-tile-avatar>{{index+4}}</v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{item.course + ' - ' + item._join.course.title}}</v-list-tile-title>
              <v-list-tile-sub-title>{{item._join.department.deptName + ` (${item.year})`}}</v-list-tile-sub-title>
              <v-list-tile-sub-title>Enrolled: {{printEnrolled(item)}}</v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
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
