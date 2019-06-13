<template>
  <v-data-iterator
    :items="value"
    :rows-per-page-items="rowsPerPageItems"
    :pagination.sync="pagination"
    content-tag="v-layout"
    row
    wrap
  >
    <v-flex slot="item" slot-scope="props" xs12 sm6 md4 lg3>
      <v-card>
        <v-card-title>
          <h4>{{ props.item.name }}</h4>
        </v-card-title>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-tile v-for="(field, index) in fields" :key="index">
            <v-list-tile-content>{{field.label}}:</v-list-tile-content>
            <v-list-tile-content class="align-end">{{ props.item[field.name] }}</v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-flex>
  </v-data-iterator>
</template>

<script>
import arrayHandlerMixin from './arrayHandlerMixin';

export default {
  name: "BaseGrid",
  mixins: [arrayHandlerMixin],
  data: () => ({
    rowsPerPageItems: [4, 8, 12],
    pagination: {
      rowsPerPage: 4
    }
  })
};
</script>