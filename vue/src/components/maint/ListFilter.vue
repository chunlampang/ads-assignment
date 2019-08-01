<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header ripple>
        <div>
          <v-icon color="primary">mdi-filter</v-icon>
          <span class="ml-3 subtitle-1 font-weight-medium">Filter</span>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-form ref="form" v-model="valid" @submit.prevent="search">
          <v-layout row wrap>
            <template v-for="(field, fieldName) in entity.fields">
              <template v-if="field.view.includes('filter')">
                <v-flex :key="fieldName" xs12>
                  <template v-if="field.type === 'number'">
                    <v-container pa-0 grid-list-xl>
                      <v-layout>
                        <v-flex xs6>
                          <v-text-field
                            type="number"
                            v-model="value[fieldName].from"
                            :label="field.label + ' (From)'"
                          />
                        </v-flex>
                        <v-flex xs6>
                          <v-text-field
                            type="number"
                            v-model="value[fieldName].to"
                            :label="field.label+ ' (To)'"
                          />
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </template>
                  <v-autocomplete
                    v-else-if="field.type === 'string'"
                    v-model="value[fieldName]"
                    :loading="loading[fieldName]"
                    :items="options[fieldName]"
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
              <v-btn type="submit" :disabled="!valid" class="text-none">Search</v-btn>
              <v-btn @click="resetFilter" class="text-none">Reset</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
export default {
  props: {
    entity: Object,
    value: Object
  },
  data() {
    return {
      valid: true,
      loading: {},
      options: {}
    };
  },
  created() {
    let fields = this.entity.fields;
    for (let fieldName in fields) {
      if (fields[fieldName].view.includes("filter")) {
        this.value[fieldName] = {};
      }
    }
  },
  methods: {
    resetFilter() {
      this.$refs.form.reset();
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
