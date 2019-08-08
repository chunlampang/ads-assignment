<template>
  <v-layout row wrap :key="id">
    <v-flex xs12>
      <div class="headline">{{entity.plural}}</div>
      <v-divider class="primary" />
      <v-breadcrumbs :items="breadcrumbs" class="pt-0">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <BaseAlert :value="alert.show" :type="alert.type" :msg="alert.msg" />
    </v-flex>
    <v-flex class="mt-4" xs12>
      <EditView :id="id" :entity="entity" :alert="alert" @updated="updated" />
    </v-flex>
  </v-layout>
</template>
<script>
import BaseAlert from "@/components/blocks/BaseAlert";
import EditView from "./EditView";

export default {
  components: { BaseAlert, EditView },
  props: {
    entity: Object
  },
  data() {
    return {
      id: this.$route.params.id,
      alert: {
        show: false
      }
    };
  },
  computed: {
    itemTitle() {
      if (this.id === "new") return "New " + this.entity.singular;
      return this.id;
    },
    breadcrumbs() {
      return [
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
    }
  },
  methods: {
    updated(data) {
      if (this.id === "new") {
        this.id = data._id;
        this.$router.replace({
          params: { id: this.id }
        });
      }
    }
  }
};
</script>
