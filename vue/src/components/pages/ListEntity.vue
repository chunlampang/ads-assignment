<template>
  <BaseTable v-model="list" :fields="fields"/>
</template>

<script>
import BaseTable from "@/components/blocks/BaseTable";

export default {
  name: "ListEntity",
  components: { BaseTable },
  props: {
    entityID: {
      type: String,
      required: true
    }
  },
  data() {
    let entity = this.$api.config.entities[this.entityID];
    return {
      entity,
      fields: entity.fields,
      list: []
    };
  }
};
</script>