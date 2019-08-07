<template>
  <v-form ref="form" v-model="valid" @submit.prevent="submit">
    <v-card-text>
      <BaseAlert v-if="alert.self" :value="alert.show" :type="alert.type" :msg="alert.msg" />
      <EditFields v-model="value" :id="id" :fields="fields" />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn @click="reset" color="warning" text class="text-none">Reset</v-btn>
      <v-btn type="submit" :disabled="!valid" color="primary" text class="text-none">Submit</v-btn>
    </v-card-actions>
  </v-form>
</template>
<script>
import BaseAlert from "@/components/blocks/BaseAlert";
import EditFields from "./EditFields";

export default {
  components: { BaseAlert, EditFields },
  props: {
    value: Object,
    alert: Object,
    id: Number | String,
    fields: Object
  },
  data() {
    return {
      valid: false
    };
  },
  methods: {
    submit() {
      this.alert.show = false;
      if (!this.$refs.form.validate()) return;

      this.$emit("submit");
    },
    reset() {
      this.alert.show = false;
      this.$emit("reset");
    }
  }
};
</script>
