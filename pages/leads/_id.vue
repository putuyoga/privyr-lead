<template>
  <div class="page">
    <div class="webhook">
      <h2 class="webhook-title">Webhook URL</h2>
      <div class="webhook-url" @click="copyUrl()">
        <div class="webhook-loading" v-if="loadingState.regenerateWebhook">
          Getting you a new URL, please wait...
        </div>
        <input v-else id="webhookUrl" disabled :value="webhookUrl" />
      </div>
      <p class="webhook-notice">
        This URL will listen to any incoming post request, and add lead data
        into database.
        <a href="#" @click="regenerateWebhookId()">Regenerate webhook url</a>
      </p>
    </div>

    <h2>Leads</h2>
    <div class="div-table">
      <div class="div-table-row table-head">
        <div class="div-table-col">Name</div>
        <div class="div-table-col">Email</div>
        <div class="div-table-col">Phone</div>
      </div>
      <template v-if="leads.length > 0">
        <div
          v-for="(lead, num) in leads"
          :key="lead.name"
          class="div-table-row"
          :class="{ even: num % 2 === 0 }"
        >
          <div class="div-table-col">{{ lead.name }}</div>
          <div class="div-table-col">{{ lead.email }}</div>
          <div class="div-table-col">{{ lead.phone }}</div>
        </div>
      </template>
      <template v-else>
        <p>
          This user doesn't have any lead saved. Insert new lead by make a
          <code style="color: green">curl</code> request to the webhook URL.
        </p>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import * as Service from '~/service'

export default Vue.extend({
  /**
   * URL Format: /leads/:userId
   * where `userId` is a positive number
   */
  validate({ params }) {
    return /^\d+$/.test(params.id)
  },

  /**
   * Retrieve user webhook URL and lead informations
   */
  async asyncData({ params }) {
    const userId = params.id
    const { data: leads, error } = await Service.getLeads(userId)
    if (error?.code === 404) return { userId }

    const webhookId = await Service.getWebhookId(userId)
    const webhookUrl = `http://localhost:3000/webhooks/${webhookId}`
    return { userId, leads, webhookUrl }
  },
  data: () => ({
    userId: 'empty',
    leads: [],
    webhookUrl: 'No Webhook URL. Click below link to generate.',
    loadingState: {
      regenerateWebhook: false,
      fetchMoreLeads: false,
    },
  }),

  methods: {
    copyUrl() {
      const urlElement = document.getElementById('webhookUrl') as any
      if (!urlElement) return
      urlElement?.select()
      urlElement?.setSelectionRange(0, 99999)
      navigator.clipboard.writeText(urlElement.value)
      alert('Copied the url to the clipboard')
    },
    async regenerateWebhookId() {
      this.loadingState.regenerateWebhook = true
      try {
        const webhookId = await Service.requestNewWebhookId(this.userId)
        this.webhookUrl = `http://localhost:3000/webhooks/${webhookId}`
      } catch (error) {
        alert(`Error occured. Detail: ${error}`)
        this.webhookUrl = 'Failed to generate webhook URL, please try again'
      }
      this.loadingState.regenerateWebhook = false
    },
  },
})
</script>

<style scoped>
.webhook {
  max-width: 400px;
  margin-bottom: 10px;
}

.webhook-title {
  font-size: 12px;
  text-transform: uppercase;
  margin-bottom: 6px;
}

.webhook-url {
  display: flex;
  background-color: #f1f0f3;
  margin-bottom: 6px;
}

.webhook-url div {
  padding: 12px;
  width: 100%;
}

.webhook-url input {
  padding: 12px;
  flex: 1;
  border: 0;
  cursor: pointer;
}

.webhook-loading {
  font-size: 14px;
  color: green;
}

.webhook-notice {
  color: #888;
  font-size: 12px;
  margin: 0;
}

.page {
  margin: auto;
  max-width: 800px;
  padding: 10px;
}

.div-table {
  display: table;
  width: 100%;
  border: 1px solid #666666;
  border-spacing: 5px; /* cellspacing:poor IE support for  this */
}

.table-head {
  font-weight: bold;
}

.div-table-row {
  display: table-row;
  width: auto;
  clear: both;
  background-color: #eee;
}
.div-table-col {
  padding: 4px;
  float: left; /* fix for  buggy browsers */
  display: table-column;
  width: 30%;
}

.div-table-row.even {
  background-color: white;
}
</style>
