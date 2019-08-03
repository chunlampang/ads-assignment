<template>
  <v-layout row wrap>
    <v-flex class="mb-4" xs12>
      <div class="headline">{{entity.plural}}</div>
      <v-divider class="primary" />
      <v-breadcrumbs :items="breadcrumbs" class="pt-0">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <BaseAlert :value="alert.show" :type="alert.type" :msg="alert.msg" />
    </v-flex>
    <v-flex v-if="item" xs12>
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <v-card>
          <v-card-text>
            <EditFields v-model="item" :fields="entity.fields" />
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="reset" color="warning" text class="text-none">Reset</v-btn>
            <v-btn type="submit" :disabled="!valid" color="primary" text class="text-none">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-flex>
    <v-flex v-else-if="loading" xs12>
      <v-card>
        <v-card-text>
          <h3 class="primary--text font-weight-light">Loading {{entity.singular}}... Please wait</h3>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex v-else xs12>
      <v-card>
        <v-card-title>
          <h3 class="primary--text">{{entity.singular}} Not Found</h3>
        </v-card-title>
        <v-divider class="primary" />
        <v-card-text>{{id}} is not exist.</v-card-text>
        <v-card-actions>
          <v-btn color="primary" text :to="{ params: { id: 'new'} }">New {{entity.singular}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import BaseAlert from "@/components/blocks/BaseAlert";
import EditFields from "./EditFields";

export default {
  components: { BaseAlert, EditFields },
  props: {
    entity: Object
  },
  inject: ["entities"],
  data() {
    let id = this.$route.params.id;

    return {
      id,
      item: null,
      breadcrumbs: [],
      loading: true,
      valid: false,
      alert: {
        show: false
      }
    };
  },
  async created() {
    this.breadcrumbs = [
      {
        text: this.entity.plural,
        to: { name: "maint-" + this.entity.plural },
        exact: true
      },
      {
        text: this.itemTitle,
        disabled: true
      }
    ];

    await this.getItem();
  },
  computed: {
    itemTitle() {
      if (this.id === "new") return "New " + this.entity.singular;
      return this.id;
    }
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
          this.alert = {
            show: true,
            type: "error",
            msg: result.error
          };
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
        this.alert = {
          show: true,
          type: "success",
          msg: "Saved."
        };

        if (this.id === "new")
          this.$router.replace({
            params: { id: result.data._id }
          });
      } else if (result.error) {
        this.alert = {
          show: true,
          type: "error",
          msg: result.error
        };
      }
    },
    reset() {
      this.alert.show = false;
      if (this.id === "new") this.$refs.form.reset();
      else {
        this.$refs.form.resetValidation();
        this.getItem();
      }
    }
  }
};
</script>
