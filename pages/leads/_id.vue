<template>
  <div>
    <div class="url">http://localhost/webhooks/YIAS43</div>
    <div class="div-table">
      <div class="div-table-row">
        <div class="div-table-col" align="center">Name</div>
        <div class="div-table-col">Email</div>
        <div class="div-table-col">Phone</div>
      </div>
      <div v-for="lead in leads" :key="lead.name" class="div-table-row">
        <div class="div-table-col">{{ lead.name }}</div>
        <div class="div-table-col">{{ lead.email }}</div>
        <div class="div-table-col">{{ lead.phone }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  data: () => ({
    leads: [
      { name: 'Gunther', email: 'sato@gunther.com', phone: '+6212312321' },
      { name: 'Mark', email: 'mark@gunther.com', phone: '+626571231' },
      { name: 'Lodash', email: 'lodash@gunther.com', phone: '+101282321' },
    ],
  }),
})
</script>

<style scoped>
.url {
  padding: 12px;
}
</style>
