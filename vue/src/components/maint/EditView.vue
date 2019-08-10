<template>
  <div>
    <v-card v-if="item">
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <template v-if="entity.references && id !== 'new'">
          <v-tabs>
            <v-tab :href="'#tabmain'">
              <v-icon>mdi-information-variant</v-icon>
            </v-tab>
            <v-tab
              v-for="(reference, refName) in entity.references"
              :key="refName"
              :href="'#tab-' + refName"
              class="text-none"
            >{{ reference.label }}</v-tab>

            <v-tab-item value="tabmain">
              <v-card flat>
                <v-card-text>
                  <BaseAlert
                    v-if="alert.self"
                    :value="alert.show"
                    :type="alert.type"
                    :msg="alert.msg"
                  />
                  <EditFields v-model="item" :id="id" :fields="entity.fields" />
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn @click="reset" color="warning" text class="text-none">Reset</v-btn>
                  <v-btn
                    type="submit"
                    :disabled="!valid"
                    color="primary"
                    text
                    class="text-none"
                  >Submit</v-btn>
                </v-card-actions>
              </v-card>
            </v-tab-item>
            <v-tab-item
              v-for="(reference, refName) in entity.references"
              :key="refName"
              :value="'tab-' + refName"
            >
              <v-card flat>
                <v-card-text>
                  <ListView
                    :alert="alert"
                    :entity="entities[reference.entity]"
                    :viewType="reference.view"
                    readonly
                    dense
                    :constFilter="getReferenceFilter(reference)"
                  />
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </template>
        <template v-else>
          <v-card flat>
            <v-card-text>
              <BaseAlert v-if="alert.self" :value="alert.show" :type="alert.type" :msg="alert.msg" />
              <EditFields v-model="item" :id="id" :fields="entity.fields" />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn @click="reset" color="warning" text class="text-none">Reset</v-btn>
              <v-btn type="submit" :disabled="!valid" color="primary" text class="text-none">Submit</v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-form>
    </v-card>
    <v-card v-else-if="loading">
      <v-card-text>
        <h3 class="primary--text font-weight-light">Loading {{entity.singular}}... Please wait</h3>
      </v-card-text>
    </v-card>
    <v-card v-else>
      <v-card-title>
        <h3 class="primary--text">{{entity.singular}} Not Found</h3>
      </v-card-title>
      <v-divider class="primary" />
      <v-card-text>{{id}} is not exist.</v-card-text>
      <v-card-actions>
        <v-btn color="primary" text :to="{ params: { id: 'new'} }">New {{entity.singular}}</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import BaseAlert from "@/components/blocks/BaseAlert";

export default {
  name: "EditView",
  components: { BaseAlert },
  props: {
    entity: Object,
    id: String | Number,
    alert: {
      type: Object,
      default() {
        return {
          show: false,
          self: true
        };
      }
    }
  },
  inject: ["entities"],
  data() {
    return {
      item: null,
      loading: true,
      valid: false
    };
  },
  async created() {
    await this.getItem();
  },
  methods: {
    async getItem() {
      this.loading = true;
      try {
        if (this.id === "new") {
          this.item = {};
          return;
        }

        let result = await this.$api.get("/" + this.entity.collection, this.id);
        if (result.error) {
          this.item = null;
          this.alert.type = "error";
          this.alert.msg = result.error;
          this.alert.show = true;
          return;
        }

        this.item = result.data;
      } finally {
        this.loading = false;
      }
    },
    async submit() {
      this.alert.show = false;
      if (!this.$refs.form.validate()) return;

      this.$emit("submit");

      let result;
      if (this.id === "new")
        result = await this.$api.insert(
          "/" + this.entity.collection,
          this.item
        );
      else {
        let data = Object.assign({}, this.item);
        delete data._id;
        result = await this.$api.update(
          "/" + this.entity.collection,
          this.id,
          data
        );
      }
      if (result.ok) {
        this.alert.type = "success";
        this.alert.msg = "Saved.";
        this.alert.show = true;

        this.$emit("updated", result.data);
      } else if (result.error) {
        this.alert.type = "error";
        this.alert.msg = result.error;
        this.alert.show = true;
      }
    },
    reset() {
      this.alert.show = false;
      if (this.id === "new") this.$refs.form.reset();
      else {
        this.$refs.form.resetValidation();
        this.getItem();
      }
    },
    getReferenceFilter(reference) {
      let filter = {};
      filter[reference.field] = this.id;
      return filter;
    }
  }
};
</script>