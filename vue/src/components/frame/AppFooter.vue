<template>
  <v-footer dark padless>
    <v-card class="flex secondary" flat tile>
      <v-card-title class="py-4 body-2">
        <v-layout justify-center text-center row>
          <template v-for="(item, index) in menu">
            <v-flex xs12 sm6 md4 :key="index">
              <v-btn :to="item.link" exact text class="text-none">{{item.title}}</v-btn>
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
        class="primary justify-center overline"
      >Advanced Database Systems - Assignment 2 (Part B) - Group 5A</v-card-actions>
    </v-card>
  </v-footer>
</template>

<script>
export default {
  props: {
    menu: Array
  }
};
</script>