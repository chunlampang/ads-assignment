<template>
  <v-container fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card>
          d) List the numbers of students for each course, who have enrolled the course offered by the CS department in 2016.
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
      <v-flex xs12>
        <v-data-iterator
          :items="items.data"
          :total-items="items.total"
          :pagination.sync="pagination"
          :loading="loading"
          content-tag="v-layout"
          row
          wrap
        >
          <template v-slot:item="props">
            <v-flex xs12 sm6 md4 lg3>
              <v-card>
                <v-card-title>
                  <div>
                    <h4>{{ props.item.course }}</h4>
                    <div>{{ props.item.department }}</div>
                    <div>{{ props.item.year }}</div>
                  </div>
                </v-card-title>
                <v-divider></v-divider>
                <v-list dense>
                  <v-list-tile v-for="(enrolled, index) in props.item.enrolled" :key="index">
                    <v-list-tile-content>{{ enrolled.student }}</v-list-tile-content>
                  </v-list-tile>
                </v-list>
              </v-card>
            </v-flex>
          </template>
        </v-data-iterator>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      departments: [],
      items: {
        meta: {
          total: 0
        },
        data: []
      },
      loading: false,
      pagination: {
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
      let size = this.pagination.rowsPerPage;
      if (size === -1) size = "";
      
      return {
        page: {
          size,
          number: this.pagination.page
        }
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
      let result = await this.$api.getOffers(this.filter, this.apiOptions);
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
