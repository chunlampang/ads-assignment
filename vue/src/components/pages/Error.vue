<template>
  <v-layout>
    <v-flex xs12>
      <h3 class="display-2 primary--text">{{code}}</h3>
      <v-divider class="primary" />
      <p class="px-2 py-4 subheading">{{messages[code]}}</p>
      <v-btn class="primary" :to="{name: 'index'}">Back to home page</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "Error",
  props: {
    code: Number
  },
  data() {
    return {
      messages: {
        404: "Page Not Found :("
      }
    };
  }
};
</script>
