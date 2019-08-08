<template>
  <v-layout row wrap>
    <v-flex xs12>
      <div class="headline">Popular Courses</div>
      <v-divider class="primary" />
      <BaseAlert :value="alert.show" :type="alert.type" :msg="alert.msg" />
    </v-flex>
    <v-flex class="mt-4" xs12>
      <ListFilter v-model="filter" :entity="entities.offer" viewType="list" @search="search()" />
    </v-flex>
    <v-flex xs12>
      <v-list dense three-line class="py-0">
        <template v-for="(item, index) in items">
          <v-divider v-if="index > 0" :key="'d-'+index" />
          <v-list-item :key="'t-'+index" :to="{ name: 'maint-Offer', params:{ id: item._id } }">
            <v-list-item-avatar>
              <div>
                <div class="primary--text display-1 font-weight-light">{{index+1}}</div>
                <v-icon v-if="index < 3" color="primary">mdi-trophy</v-icon>
              </div>
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                <h4
                  class="primary--text title font-weight-regular"
                >{{item.course.courseId + ' - ' + item.course.title}}</h4>
              </v-list-item-title>
              <v-list-item-subtitle>{{item._join.department.deptName + ` (${item.year})`}}</v-list-item-subtitle>
              <v-list-item-subtitle>Enrolled: {{item.enrolledCount}}/{{item.classSize}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-progress-circular
                :rotate="270"
                :size="75"
                :width="10"
                :value="enrolledPercent(item)"
                color="primary"
              >{{ enrolledPercent(item) }}%</v-progress-circular>
            </v-list-item-action>
          </v-list-item>
        </template>
      </v-list>
    </v-flex>
  </v-layout>
</template>

<script>
import BaseAlert from "@/components/blocks/BaseAlert";
import ListFilter from "../maint/ListFilter";

export default {
  components: { BaseAlert, ListFilter },
  inject: ["entities"],
  data() {
    return {
      departments: [],
      items: [],
      loading: false,
      filter: {
        department: [],
        year: null
      },
      alert: {
        show: false
      }
    };
  },
  created() {
    this.search();
  },
  methods: {
    async search() {
      this.loading = true;
      let result = await this.$api.getJoinedOffers(this.filter, {
        page: { size: 10, number: 1 },
        sort: "-enrolledCount"
      });
      if (result.error) {
        this.alert = {
          show: true,
          type: "error",
          msg
        };
      } else {
        this.items = result.data;
      }
      this.loading = false;
    },
    enrolledPercent(item) {
      return ((item.enrolledCount / item.classSize) * 100).toFixed(1);
    }
  }
};
</script>
