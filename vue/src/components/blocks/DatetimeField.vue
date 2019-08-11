<template>
  <div class="datetime-field">
    <v-dialog v-model="showPicker" :disabled="readonly" max-width="330">
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="valueStr"
          :label="label"
          :append-icon="readonly?'mdi-pencil-off':'mdi-calendar-clock'"
          :rules="rulesWithFormat"
          v-on="on"
          readonly
          :clearable="!readonly"
        >
          <template v-slot:append-outer>
            <slot name="append-outer"></slot>
          </template>
        </v-text-field>
      </template>
      <v-card v-if="showPicker">
        <v-card-title class="text-center">
          <div style="width:100%">
            <v-btn text :color="active==0?'primary':'grey'" width="50%" @click="active=0">Date</v-btn>
            <v-btn text :color="active==1?'primary':'grey'" width="50%" @click="active=1">Time</v-btn>
          </div>
        </v-card-title>
        <v-card-text class="text-center" style="height:390px">
          <v-window v-model="active" vertical>
            <v-window-item :value="0">
              <v-date-picker v-model="date" style="box-shadow: none" color="primary" show-current />
            </v-window-item>
            <v-window-item :value="1">
              <v-time-picker
                ref="timePicker"
                v-model="time"
                style="box-shadow: none"
                color="primary"
                use-seconds
                scrollable
              ></v-time-picker>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn text color="grey" @click="showPicker = false">Cancel</v-btn>
          <v-btn text color="primary" @click="clickOk">OK</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
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
        v => !v || !isNaN(this.$utils.stringToDatetime(v)) || "Invalid Format"
      ],
      active: 0,
      date: "",
      time: ""
    };
  },
  computed: {
    valueStr: {
      get() {
        return this.$utils.datetimeToString(this.value);
      },
      set(v) {
        this.$emit("valChange", !v ? v : this.$utils.stringToDatetime(v));
      }
    }
  },
  watch: {
    showPicker(v) {
      if (v) {
        if (this.value) {
          this.date = moment(this.value).format("YYYY-MM-DD");
          this.time = moment(this.value).format("HH:mm:ss");
        } else {
          this.date = "";
          this.time = "";
        }
      }
    }
  },
  methods: {
    clickOk() {
      let v = moment(this.date + this.time, "YYYY-MM-DDHH:mm:ss").toDate();
      this.valueStr = this.$utils.datetimeToString(v);
      this.showPicker = false;
    }
  }
};
</script>

<style scoped>
.datetime-field >>> .v-dialog__container {
  display: none !important;
}
</style>
