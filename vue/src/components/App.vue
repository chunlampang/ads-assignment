<template>
  <AppFrame v-if="ready" />
</template>

<script>
import AppFrame from "./frame/AppFrame";

export default {
  name: "App",
  components: { AppFrame },
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
      entities: []
    };
  },
  provide() {
    return {
      menu: this.menu,
      entities: this.entities
    };
  },
  watch: {
    $route(v) {
      console.log("route", v);
    }
  },
  async created() {
    let entities = (this.entities = await this.$api.getEntities());

    for (let entityId in entities) {
      let entity = entities[entityId];
      let routeName = "maint-" + entity.plural;
      //append vue router
      let appendRoutes = [];
      appendRoutes.push({
        path: entity.apiPath,
        name: routeName,
        component: () => import("@/components/maint/List"),
        props: route => ({ value: entity })
      });
      appendRoutes.push({
        path: entity.apiPath + "/:id",
        name: "maint-" + entity.singular,
        component: () => import("@/components/maint/Edit"),
        props: route => ({ value: entity })
      });
      this.$router.addRoutes(appendRoutes);
      //append menu
      this.menu.push({
        title: entity.plural,
        icon: "build",
        link: { name: routeName }
      });
    }
    this.ready = true;
  }
};
</script>