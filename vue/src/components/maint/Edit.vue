<template>
  <v-layout row wrap>
    <v-flex class="mb-4" xs12>
      <div class="headline">{{value.plural}}</div>
      <v-divider class="primary" />
      <v-breadcrumbs :items="breadcrumbs" class="pt-0">
        <template v-slot:divider>
          <v-icon>chevron_right</v-icon>
        </template>
      </v-breadcrumbs>
      <v-alert :value="alert.show" :type="alert.type">{{alert.msg}}</v-alert>
    </v-flex>
    <v-flex xs12>
      <v-form ref="form" v-model="valid" @submit.prevent="submit">
        <template v-for="(field, fieldName) in value.fields">
          <template v-if="field.view.includes('edit')">
            <v-flex :key="fieldName" xs12>
              <DateField
                v-if="field.type === 'date'"
                v-model="item[fieldName]"
                :rules="getRules(field)"
                :label="field.label"
                :readonly="readonly(field)"
              />
              <v-text-field
                v-else
                v-model="item[fieldName]"
                :type="field.type === 'number'? 'number' : 'text'"
                :rules="getRules(field)"
                :label="field.label"
                :readonly="readonly(field)"
              />
            </v-flex>
          </template>
        </template>
        <v-flex xs12>
          <v-btn type="submit" :disabled="!valid" class="text-none">Submit</v-btn>
          <v-btn @click="reset" class="text-none">Reset</v-btn>
        </v-flex>
      </v-form>
    </v-flex>
  </v-layout>
</template>
<script>
import DateField from "@/components/blocks/DateField";

export default {
  components: { DateField },
  props: {
    value: Object
  },
  data() {
    let id = this.$route.params.id;

    return {
      id,
      item: {},
      breadcrumbs: [],
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
        text: this.value.plural,
        to: { name: "maint-" + this.value.plural },
        exact: true
      },
      {
        text: this.itemTitle,
        disabled: true
      }
    ];

    if (this.id === "new") return;

    this.getItem();
  },
  computed: {
    itemTitle() {
      if (this.id === "new") return "New " + this.value.singular;
      return this.id;
    }
  },
  methods: {
    async getItem() {
      let result = await this.$api.get("/" + this.value.collection, this.id);
      if (result.error) {
        this.alert = {
          show: true,
          type: "error",
          msg: result.error
        };
        return;
      }

      this.item = result.data;
      if (!this.item) {
        //404
        return;
      }
    },
    async submit() {
      this.alert.show = false;
      if (!this.$refs.form.validate()) return;

      let result;
      if (this.id === "new")
        result = await this.$api.insert("/" + this.value.collection, this.item);
      else {
        delete this.item._id;
        result = await this.$api.update(
          "/" + this.value.collection,
          this.id,
          this.item
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

      return (this.rulesCache[field.label] = rules);
    },
    readonly(field) {
      return (
        field.readonly === 2 || (field.readonly === 1 && this.id !== "new")
      );
    }
  }
};
</script>
