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
        <v-flex v-for="(field, fieldName) in this.value.fields" :key="fieldName" xs12>
          <v-menu
            v-if="field.type === Date"
            v-model="dp[fieldName]"
            :close-on-content-click="false"
            :nudge-right="40"
            lazy
            transition="scale-transition"
            offset-y
            full-width
            max-width="290px"
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="item[fieldName]"
                :label="field.label"
                hint="YYYY/MM/DD format"
                persistent-hint
                prepend-icon="event"
                readonly
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker v-model="item[fieldName]" no-title @input="dp[fieldName] = false"></v-date-picker>
          </v-menu>

          <v-text-field v-else v-model="item[fieldName]" :rules="field.rules" :label="field.label" />
        </v-flex>
        <v-flex xs12>
          <v-btn type="submit" class="text-none">Submit</v-btn>
          <v-btn @click="reset" class="text-none">Reset</v-btn>
        </v-flex>
      </v-form>
    </v-flex>
  </v-layout>
</template>
<script>
export default {
  props: {
    value: Function
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
      dp:{}
    };
  },
  created() {
    this.breadcrumbs = [
      {
        text: this.value.plural,
        to: { name: this.value.plural },
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
      let result = await this.$api.get(this.value.apiPath, this.id);
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
        result = await this.$api.insert(this.value.apiPath, this.item);
      else
        result = await this.$api.update(this.value.apiPath, this.id, this.item);

      if (result.ok) {
        this.alert = {
          show: true,
          type: "success",
          msg: "Saved."
        };

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
