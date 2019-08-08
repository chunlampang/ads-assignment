<template>
  <v-layout row wrap>
    <v-flex xs12>
      <div class="headline">{{entity.plural}}</div>
      <v-divider class="primary" />
      <BaseAlert :value="alert.show" :type="alert.type" :msg="alert.msg" />
    </v-flex>
    <v-flex class="mt-4" xs12>
      <ListView :alert="alert" :entity="entity" viewType="list" />
    </v-flex>
  </v-layout>
</template>
<script>
import BaseAlert from "@/components/blocks/BaseAlert";
import ListView from "./ListView";

export default {
  components: { BaseAlert, ListView },
  props: {
    entity: Object
  },
  data() {
    return {
      alert: {
        show: false
      }
    };
  }
};
</script>
