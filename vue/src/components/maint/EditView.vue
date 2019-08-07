<template>
  <div>
    <v-card v-if="item">
      <template v-if="entity.references && id !== 'new'">
        <v-tabs>
          <v-tab>
            <v-icon>mdi-information-variant</v-icon>
          </v-tab>
          <v-tab
            v-for="(reference, refName) in entity.references"
            :key="refName"
            :href="'#tab-' + refName"
          >{{ reference.label }}</v-tab>

          <v-tab-item>
            <EditForm
              v-model="item"
              :alert="alert"
              :id="id"
              :fields="entity.fields"
              @submit="submit"
              @reset="reset"
            />
          </v-tab-item>
          <v-tab-item
            v-for="(reference, refName) in entity.references"
            :key="refName"
            :value="'tab-' + refName"
          >
            <RefView :reference="reference"/>
          </v-tab-item>
        </v-tabs>
      </template>
      <template v-else>
        <EditForm
          v-model="item"
          :alert="alert"
          :id="id"
          :fields="entity.fields"
          @submit="submit"
          @reset="reset"
        />
      </template>
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
import EditForm from "./EditForm";
import RefView from "./RefView";

export default {
  components: { BaseAlert, EditForm, RefView },
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
      if (this.id === "new") this.$refs.form.reset();
      else {
        this.$refs.form.resetValidation();
        this.getItem();
      }
    }
  }
};
</script>