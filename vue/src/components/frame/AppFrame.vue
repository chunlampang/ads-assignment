<template>
  <v-app v-if="ready">
    <AppToolbar :menu="menu" />
    <v-content>
      <v-container fluid>
        <v-layout row wrap justify-center>
          <v-flex xs11 sm10 md9 lg8 xl7>
            <v-container>
              <transition name="scroll-y-transition">
                <router-view :key="$route.name" />
              </transition>
            </v-container>
          </v-flex>
        </v-layout>
      </v-container>
      <AppFooter :menu="menu" />
    </v-content>
  </v-app>
</template>

<script>
import AppToolbar from "./AppToolbar";
import AppFooter from "./AppFooter";

export default {
  components: {
    AppToolbar,
    AppFooter
  },
  data() {
    let menu = [];
    for (let route of this.$router.options.routes) {
      if (route.meta && route.meta.menu) {
        let m = route.meta.menu;
        menu.push({ icon: m.icon, title: m.title, link: { name: route.name } });
      }
    }

    return {
      ready: false,
      menu,
      configs: null,

      // options, optionsRequests used by maint/loadOptionsMixin.js
      options: {},
      optionsRequests: []
    };
  },
  provide() {
    const provide = {};

    Object.defineProperty(provide, "menu", {
      enumerable: true,
      get: () => this.menu
    });
    Object.defineProperty(provide, "configs", {
      enumerable: true,
      get: () => this.configs
    });
    Object.defineProperty(provide, "entities", {
      enumerable: true,
      get: () => this.configs.entities
    });
    Object.defineProperty(provide, "options", {
      enumerable: true,
      get: () => this.options
    });
    Object.defineProperty(provide, "optionsRequests", {
      enumerable: true,
      get: () => this.optionsRequests
    });

    return provide;
  },
  watch: {
    "$route.name"() {
      this.options = {};
      this.optionsRequests = [];
    },
    $route(v) {
      console.debug("route", v);
    }
  },
  async created() {
    let configs = (this.configs = await this.$api.getConfigs());
    let entities = configs.entities;

    for (let entityId in entities) {
      let entity = entities[entityId];
      let routeName = "maint-" + entity.plural;
      //append vue router
      let appendRoutes = [];
      appendRoutes.push({
        path: "/" + entity.collection,
        name: routeName,
        component: () => import("@/components/maint/List"),
        props: route => ({ entity })
      });
      appendRoutes.push({
        path: `/${entity.collection}/:id`,
        name: "maint-" + entity.singular,
        component: () => import("@/components/maint/Edit"),
        props: route => ({ entity })
      });
      this.$router.addRoutes(appendRoutes);
      //append menu
      this.menu.push({
        title: entity.plural,
        icon: entity.icon || "mdi-wrench",
        link: { name: routeName }
      });
    }

    this.$router.addRoutes([
      {
        path: "/:path*",
        component: () => import("@/components/pages/Error"),
        props: { code: 404 }
      }
    ]);

    this.ready = true;
  },
  methods: {
    toggleNav(v) {
      this.showNav = v;
    }
  }
};
</script>
