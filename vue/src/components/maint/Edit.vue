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
            <template v-for="(field, fieldName) in entity.fields">
              <template v-if="field.view.includes('edit')">
                <v-flex :key="fieldName" xs12>
                  <DateField
                    v-if="field.type === 'date'"
                    v-model="item[fieldName]"
                    :rules="getRules(field)"
                    :label="field.label + (required(field)?' *':'')"
                    :readonly="readonly(field)"
                  />
                  <v-text-field
                    v-else
                    v-model="item[fieldName]"
                    :type="field.type === 'number'? 'number' : 'text'"
                    :rules="getRules(field)"
                    :label="field.label +(required(field)?' *':'')"
                    :readonly="readonly(field)"
                  />
                </v-flex>
              </template>
            </template>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn @click="reset" color="warning" text class="text-none">Reset</v-btn>
            <v-btn type="submit" :disabled="!valid" color="primary" text class="text-none">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-flex>
    <v-flex v-else-if="!loading" xs12>
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
import DateField from "@/components/blocks/DateField";

export default {
  components: { BaseAlert, DateField },
  props: {
    entity: Object
  },
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
      },
      rulesCache: {}
    };
  },
  created() {
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

    this.getItem();
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
    },
    getRules(field) {
      if (this.rulesCache[field.label]) return this.rulesCache[field.label];

      const rules = [];
      if (field.rules) {
        for (let ruleName of field.rules) {
          switch (ruleName) {
            case "required":
              rules.push(v => !!v || field.label + " is required.");
              break;
            case "integer":
              rules.push(
                v =>
                  Number.isInteger(Number(v)) ||
                  field.label + " should be an integer."
              );
              break;
          }
        }
      }

      return (this.rulesCache[field.label] = rules);
    },
    readonly(field) {
      return (
        field.readonly === 2 || (field.readonly === 1 && this.id !== "new")
      );
    },
    required(field) {
      return field.rules && field.rules.includes("required");
    }
  }
};
</script>
