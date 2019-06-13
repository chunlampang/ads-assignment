<template>
  <v-data-table :headers="headers" :items="value" class="elevation-1">
    <template slot="items" slot-scope="props">
      <td v-for="(field, index) in fields" :key="index">
        <template>{{ props.item[field.name] }}</template>
      </td>
    </template>
  </v-data-table>
</template>

<script>
import arrayHandlerMixin from "./arrayHandlerMixin";

export default {
  name: "BaseTable",
  mixins: [arrayHandlerMixin],
  data() {
    let headers = [];
    for (let i = 0, ln = this.fields.length; i < ln; i++) {
      let field = this.fields[i];
      headers.push({
        text: field.label,
        value: field.name,
          align: "left",
          sortable: true,
      });
    }

    return {
      headers,
    };
  }
};
</script>