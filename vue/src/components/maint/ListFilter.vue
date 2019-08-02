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
          <v-card flat>
            <v-card-text>
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
                      :loading="autoInput[fieldName].loading"
                      :items="autoInput[fieldName].items"
                      :item-value="fieldName"
                      :item-text="fieldName"
                      :search-input="autoInput[fieldName].input"
                      @update:search-input="autoInput[fieldName].input = $event"
                      no-filter
                      hide-no-data
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
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="resetFilter" color="warning" text class="text-none">Reset</v-btn>
              <v-btn type="submit" :disabled="!valid" color="primary" text class="text-none">Search</v-btn>
            </v-card-actions>
          </v-card>
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
    const fields = this.entity.fields;
    const autoInput = {};

    for (let fieldName in fields) {
      const field = fields[fieldName];
      if (!field.view.includes("filter")) continue;
      switch (field.type) {
        case "number":
          this.value[fieldName] = {
            from: "",
            to: ""
          };
          break;
        case "string":
          this.value[fieldName] = "";
          autoInput[fieldName] = {
            loading: false,
            items: [],
            input: null
          };
          break;
      }
    }

    return {
      valid: true,
      autoInput
    };
  },
  mounted() {
    let fields = this.entity.fields;
    for (let fieldName in fields) {
      const field = fields[fieldName];
      if (!field.view.includes("filter")) continue;

      if (field.type === "string") {
        this.$watch(`autoInput.${fieldName}.input`, val => {
          this.autoCompleteSearch(fieldName, val);
        });
      }
    }
    console.log(this.value);
  },
  methods: {
    resetFilter() {
      this.$refs.form.reset();
    },
    async autoCompleteSearch(fieldName, val) {
      const autoInput = this.autoInput[fieldName];
      autoInput.loading = true;

      let filter = {};
      filter[fieldName] = { $like: ".*" + val + ".*" };

      let result = await this.$api.query("/" + this.entity.collection, {
        filter,
        page: { size: 10 },
        fields: fieldName
      });
      if (result.error) {
        console.error(result.error);
      } else {
        autoInput.items = result.data;
      }

      autoInput.loading = false;
    }
  }
};
</script>
