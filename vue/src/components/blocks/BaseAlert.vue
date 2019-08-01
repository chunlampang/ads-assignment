<template>
  <v-alert
    class="my-2"
    border="left"
    outlined
    dense
    :value="value"
    :type="type"
    transition="scale-transition"
  >{{msg}}</v-alert>
</template>

<script>
export default {
  props: {
    value: Boolean,
    type: String,
    msg: String
  }
};
</script>
