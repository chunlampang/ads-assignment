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
        hint="Format: YYYY/MM/DD"
        persistent-hint
        append-icon="mdi-calendar"
        :rules="rulesWithFormat"
        v-on="on"
        readonly
      ></v-text-field>
    </template>
    <v-date-picker v-model="date" no-title @input="showPicker = false"></v-date-picker>
  </v-menu>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "valChange"
  },
  props: {
    value: Date | String,
    label: String,
    rules: Array,
    readonly:Boolean
  },
  data() {
    return {
      showPicker: false,
      rulesWithFormat: [
        v => !isNaN(this.$utils.stringToDate(v)) || "Invalid Format"
      ]
    };
  },
  computed: {
    valueStr: {
      get() {
        return this.$utils.dateToString(this.value);
      },
      set(v) {
        this.$emit("valChange", this.$utils.stringToDate(v));
      }
    },
    date: {
      get() {
        const d = this.$utils.stringToDate(this.valueStr);
        const month = (d.getMonth() + 1 + "").padStart(2, "0"),
          day = (d.getDate() + "").padStart(2, "0");
        return `${d.getFullYear()}-${month}-${day}`;
      },
      set(v) {
        const [year, month, day] = v.split("-");
        this.valueStr = this.$utils.dateToString(
          new Date(year, month - 1, day)
        );
      }
    }
  }
};
</script>
