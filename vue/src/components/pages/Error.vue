<template>
  <v-container>
    <h3 class="headline">{{code}}</h3>
    <p>{{$t.errors[code]}}</p>
  </v-container>
</template>

<script>
export default {
  name: "Error",
  props: {
    code: Number
  }
};
</script>
