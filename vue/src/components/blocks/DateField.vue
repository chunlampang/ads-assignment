<template>
  <v-menu
    v-model="showPicker"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    full-width
    max-width="290px"
    min-width="290px"
    :disabled="readonly"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="valueStr"
        :label="label"
        :append-icon="readonly?'mdi-pencil-off':'mdi-calendar'"
        :rules="rulesWithFormat"
        v-on="on"
        readonly
        :clearable="!readonly"
      ></v-text-field>
    </template>
    <v-date-picker v-model="date" show-current no-title color="primary" @input="showPicker = false"></v-date-picker>
  </v-menu>
</template>

<script>
import moment from "moment";

export default {
  model: {
    prop: "value",
    event: "valChange"
  },
  props: {
    value: Date | String,
    label: String,
    rules: { type: Array, default: () => [] },
    readonly: Boolean
  },
  data() {
    return {
      showPicker: false,
      rulesWithFormat: [
        ...this.rules,
        v => !v || !isNaN(this.$utils.stringToDate(v)) || "Invalid Format"
      ]
    };
  },
  computed: {
    valueStr: {
      get() {
        return this.$utils.dateToString(this.value);
      },
      set(v) {
        this.$emit("valChange", !v ? v : this.$utils.stringToDate(v));
      }
    },
    date: {
      get() {
        if (!this.value) return "";
        return moment(this.value).format("YYYY-MM-DD");
      },
      set(v) {
        this.valueStr = moment(v, "YYYY-MM-DD").toDate();
      }
    }
  }
};
</script>
