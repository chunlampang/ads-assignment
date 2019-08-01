<template>
  <v-app>
    <AppToolbar :menu="menu" />
    <v-content>
      <v-container class="pb-5" fluid>
        <v-layout row wrap justify-center>
          <v-flex xs11 sm10 md9 lg8 xl7>
            <v-container>
              <transition name="scroll-y-transition">
                <router-view :key="$route.path" />
              </transition>
            </v-container>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <AppFooter :menu="menu" />
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
  inject: ["menu"]
};
</script>
