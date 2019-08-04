<template>
  <v-layout row wrap>
    <v-flex class="mb-4" xs12>
      <div class="headline">{{entity.plural}}</div>
      <v-divider class="primary" />
      <v-breadcrumbs :items="breadcrumbs" class="pt-0">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
      <BaseAlert :value="alert.show" :type="alert.type" :msg="alert.msg" />
    </v-flex>
    <v-flex xs12>
      <EditForm :id="id" :entity="entity" :alert="alert" @updated="updated" />
    </v-flex>
  </v-layout>
</template>
<script>
import BaseAlert from "@/components/blocks/BaseAlert";
import EditForm from "./EditForm";

export default {
  components: { BaseAlert, EditForm },
  props: {
    entity: Object
  },
  data() {
    return {
      id: this.$route.params.id,
      breadcrumbs: [],
      alert: {
        show: false
      }
    };
  },
  async created() {
    this.breadcrumbs = [
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
  },
  computed: {
    itemTitle() {
      if (this.id === "new") return "New " + this.entity.singular;
      return this.id;
    }
  },
  methods: {
    updated(data) {
      if (this.id === "new") {
        this.$router.replace({
          params: { id: data._id }
        });
      }
    }
  }
};
</script>
