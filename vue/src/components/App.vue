<template>
  <AppFrame v-if="ready" />
</template>

<script>
import AppFrame from "./frame/AppFrame";

export default {
  name: "App",
  components: { AppFrame },
  data() {
    return {
      ready: false,
      menu: [
        { title: "Offers", icon: "book", link: { name: "offers" } },
        { title: "Courses Info", icon: "book", link: { name: "coursesInfo" } },
        {
          title: "Popular Courses",
          icon: "grade",
          link: { name: "coursePopular" }
        },
        {
          title: "Enrolled Students",
          icon: "people",
          link: { name: "enrolledStudents" }
        }
      ],
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
      console.log(entity);

      let routeName = "maint-" + entity.plural;

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