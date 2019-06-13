<template>
  <div>
    <v-toolbar app>
      <v-toolbar-side-icon @click="showNav = !showNav"/>
      <v-toolbar-title class="headline">ASD</v-toolbar-title>
    </v-toolbar>

    <v-navigation-drawer :permanent="showNav" app width="250">
      <v-list class="pa-0">
        <v-list-tile>
          <v-list-tile-content>
            <v-list-tile-title class="title">ASD</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
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

      <v-list class="pt-0" dense>
        <v-list-tile v-for="(item, index) in menu" :key="index" :to="item.link" exact>
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{item.title}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "AppToolbar",
  data() {
    return {
      showNav: true,
      menu: [
        {
          title: "Page1",
          icon: "bookmark",
          link: { name: "index" }
        }
      ]
    };
  }
};
</script>