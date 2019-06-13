<template>
  <v-container>
    <h3 class="headline">{{code}}</h3>
    <p>{{messages[code]}}</p>
  </v-container>
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
        404: "Page Not Found."
      }
    };
  }
};
</script>
