<template>
  <router-view :key="$route.params.locale"/>
</template>

<script>
export default {
  name: "App",
  async created() {
    await this.$api.loadConfig();

    //if cookies has token
    //check auth
  }
};
</script>