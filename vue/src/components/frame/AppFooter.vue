<template>
  <v-footer class="pa-3" absolute>
    <v-spacer></v-spacer>
    <div>{{$t.messages.copyright(new Date().getFullYear())}}</div>
  </v-footer>
</template>

<script>
export default {
  name: "AppFooter"
};
</script>