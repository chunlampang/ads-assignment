<template>
  <v-footer dark height="auto">
    <v-card class="flex grey darken-3" flat tile>
      <v-card-title class="py-4">
        <v-layout row wrap justify-center class="text-xs-center">
          <template v-for="(item, index) in menu">
            <v-flex xs12 sm6 md4 v-if="item.meta && item.meta.menu" :key="index">
              <v-btn :to="{name:item.name}" exact flat class="text-none">{{item.meta.menu.title}}</v-btn>
            </v-flex>
          </template>
          <v-flex xs12>
            <v-divider class="ma-4" />
            <div class="mb-4">
              <u>Implemented By</u>
            </div>
          </v-flex>
          <v-flex xs12 sm6 md4>Ng Sze Yeung Chris (51470300)</v-flex>
          <v-flex xs12 sm6 md4>Pang Chun Lam (55750220)</v-flex>
          <v-flex xs12 sm6 md4>Yeung Chun Ho (55749780)</v-flex>
        </v-layout>
      </v-card-title>

      <v-card-actions
        class="primary justify-center"
      >Advanced Database Systems - Assignment 2 (Part B) - Group 5A</v-card-actions>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  data() {
    return {
      menu: this.$router.options.routes
    };
  }
};
</script>