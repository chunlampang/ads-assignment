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
        <v-form ref="form" v-model="valid" @submit.prevent="search" autocomplete="off">
          <v-card flat>
            <v-card-text>
              <ListFilterFields
                :fields="entity.fields"
                :viewType="viewType"
                :value="value"
                :collection="entity.collection"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="resetFilter" color="warning" text class="text-none">Reset</v-btn>
              <v-btn
                ref="btnSubmit"
                type="submit"
                :disabled="!valid"
                color="primary"
                text
                class="text-none"
              >Search</v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
import ListFilterFields from "./ListFilterFields";

export default {
  name: "ListFilter",
  components: { ListFilterFields },
  props: {
    entity: Object,
    viewType: String,
    value: Object
  },
  data() {
    return {
      valid: true
    };
  },
  methods: {
    resetFilter() {
      this.$refs.form.reset();
    },
    search() {
      this.$emit("search", this.value);
    }
  }
};
</script>
