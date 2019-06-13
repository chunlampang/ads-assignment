<template>
  <div>
    <v-toolbar app>
      <v-toolbar-side-icon @click="showNav = !showNav"/>
      <v-toolbar-title class="headline text-uppercase">Title</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat>
          <v-icon>search</v-icon>
        </v-btn>
        <v-btn flat>Link Two</v-btn>
        <v-btn icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-navigation-drawer :permanent="showNav" app>
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img>
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>RunExcept</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-list-tile :to="{ name: 'index' }" exact>
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{$t.pages.home}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>

        <v-list-group v-for="(item, index) in items" :key="index" :prepend-icon="item.icon">
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>{{item.title}}</v-list-tile-title>
            </v-list-tile>
          </template>

          <v-list-tile v-for="(child, index) in item.children" :key="index" :to="child.link" exact>
            <v-list-tile-action></v-list-tile-action>
            <v-list-tile-action v-if="child.icon">
              <v-icon>{{child.icon}}</v-icon>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-list-tile-title>{{ child.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "AppToolbar",
  data() {
    let config = this.$api.config;

    let menu = {
      showNav: true,
      items: []
    };
    let entities = config.entities;

    for (let entityID in entities) {
      let entity = entities[entityID];
      menu.items.push({
        title: entity.display[this.$t.lang].name,
        icon: "question_answer",
        link: { name: entityID + "List", params: { entityID: entityID } }
      });
    }
    //langMenu
    let langMenu = {
      title: "Languages",
      icon: "language",
      children: []
    };
    for (let code in config.locales.items) {
      let locale = config.locales.items[code];
      if (!locale.active) continue;
      langMenu.children.push({
        title: locale.name,
        link: { params: { locale: code } }
      });
    }
    menu.items.push(langMenu);

    return menu;
  }
};
</script>