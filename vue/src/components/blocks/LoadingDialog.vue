<template>
  <v-dialog v-model="value" hide-overlay persistent width="300">
    <v-card dark>
      <v-card-text>
        Loading...
        <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    }
  }
};
</script>
