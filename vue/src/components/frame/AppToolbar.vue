<template>
  <div>
    <v-toolbar app color="primary" dark>
      <v-toolbar-side-icon @click="showNav = !showNav" />
      <v-toolbar-title
        class="headline"
        @click="gotoHome"
        style="cursor:pointer"
      >Advanced Database Systems - Assignment 2 (Part B)</v-toolbar-title>
    </v-toolbar>

    <v-navigation-drawer v-model="showNav" app width="250" temporary>
      <v-list class="pa-0" dark>
        <v-list-tile class="primary">
          <v-list-tile-content>
            <v-list-tile-title class="title">Assignment 2 (Part B)</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-divider></v-divider>

      <v-list class="py-0" dense>
        <v-list-tile :to="{ name: 'index' }" exact>
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-divider></v-divider>

      <v-list class="py-0" dense>
        <template v-for="(item, index) in menu">
          <v-list-tile :key="index" :to="item.link" exact>
            <v-list-tile-action>
              <v-icon>{{item.icon}}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{item.title}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  props: {
    menu: Array
  },
  data() {
    return {
      showNav: false
    };
  },
  methods: {
    gotoHome() {
      this.$router.push({ name: "index" });
    }
  }
};
</script>