<template>
  <v-app>
    <AppToolbar :menu="menu" />
    <v-content>
      <v-container class="pb-5" fluid>
        <v-layout row wrap justify-center>
          <v-flex xs12 sm10 md8>
            <v-card>
              <v-card-text>
                <v-layout row wrap>
                  <v-flex xs12>
                    <v-container>
                      <router-view :key="$route.path" />
                    </v-container>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
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
