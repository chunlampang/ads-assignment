<template>
  <v-app>
    <AppToolbar/>
    <v-content>
      <router-view class="pb-5"/>
      <AppFooter/>
    </v-content>
  </v-app>
</template>

<script>
import AppToolbar from "./AppToolbar";
import AppFooter from "./AppFooter";

export default {
  name: "AppFrame",
  components: {
    AppToolbar,
    AppFooter
  }
};
</script>
