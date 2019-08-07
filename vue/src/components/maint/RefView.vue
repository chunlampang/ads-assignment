<template>
  <v-card flat>
    <v-card-text>{{ reference }}</v-card-text>
  </v-card>
</template>
<script>
export default {
  props: {
    reference: Object
  },
  data() {
    return {};
  },
  methods: {
    async getRef(ref) {
      console.log("ref", ref, this.entities[ref.entity].collection);

      let filter = {};
      filter[ref.field] = this.id;

      let result = await this.$api.query(
        "/" + this.entities[ref.entity].collection,
        {
          fields: ref.field,
          filter
        }
      );
      console.log(result.data);
      this.refs[ref.field];
      return result.data;
    }
  }
};
</script>
