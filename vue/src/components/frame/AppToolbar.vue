<template>
  <div>
    <v-app-bar app color="primary" dark elevate-on-scroll>
      <v-app-bar-nav-icon class="hidden-lg-and-up" @click.stop="showNav = !showNav" />
      <v-toolbar-title class="headline font-weight-light" @click="gotoHome" style="cursor:pointer">
        <v-icon class="mr-3">mdi-school</v-icon>Advanced Database Systems - Assignment 2 (Part B)
      </v-toolbar-title>
    </v-app-bar>

    <v-navigation-drawer
      v-model="showNav"
      app
      width="250"
      :expand-on-hover="$vuetify.breakpoint.lg"
    >
      <v-list shaped>
        <v-list-item-group color="primary">
          <v-list-item :to="{ name: 'index' }" exact>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Home</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>

        <v-divider></v-divider>

        <v-list-item-group color="primary">
          <template v-for="(item, index) in menu">
            <v-list-item :key="index" :to="item.link" exact>
              <v-list-item-icon>
                <v-icon>{{item.icon}}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{item.title}}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list-item-group>
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
      showNav: this.$vuetify.breakpoint.lg
    };
  },
  methods: {
    gotoHome() {
      this.$router.push({ name: "index" });
    }
  }
};
</script>
