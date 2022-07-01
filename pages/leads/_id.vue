<template>
  <div class="page">
    <div class="webhook">
      <h2 class="webhook-title">Webhook URL</h2>
      <div class="webhook-url">
        <div v-if="loadingState.regenerateWebhook" class="webhook-loading">
          Getting you a new URL, please wait...
        </div>
        <input v-else id="webhookUrl" disabled :value="webhookUrl" />
      </div>
      <p class="webhook-notice">
        This URL will listen to any incoming post request, and add lead data
        into the database.
        <a href="#" @click="regenerateWebhookId()">Regenerate webhook url</a>
      </p>
    </div>

    <h2>Leads</h2>
    <div class="table">
      <div class="table-row table-head">
        <div class="table-col">Name</div>
        <div class="table-col">Email</div>
        <div class="table-col">Phone</div>
        <div class="table-col">Added Date</div>
      </div>
      <template v-if="leads.length > 0">
        <template v-for="(lead, num) in leads">
          <div
            :key="lead.name"
            class="table-row"
            :class="{ even: num % 2 === 0 }"
            @click="$set(rowExpand, num, !rowExpand[num])"
          >
            <div class="table-col">{{ lead.name }}</div>
            <div class="table-col">{{ lead.email }}</div>
            <div class="table-col">{{ lead.phone }}</div>
            <div class="table-col">
              {{ formatDate(lead.createdAt._seconds) }}
            </div>
          </div>
          <div
            v-if="rowExpand[num]"
            :key="`${lead.name}_detail`"
            class="extra-detail"
          >
            <u>Other Information:</u>
            <ul v-if="lead.other">
              <li v-for="key in Object.keys(lead.other)" :key="key">
                {{ key }}: {{ lead.other[key] }}
              </li>
            </ul>
            <p v-else>This lead has no other information</p>
          </div>
        </template>
        <a
          v-if="!loadingState.fetchMoreLeads && canLoadMore"
          href="#"
          @click="loadMoreLeads()"
        >
          load more
        </a>
        <span v-if="loadingState.fetchMoreLeads">fetching....</span>
      </template>
      <template v-else>
        <p>
          This user doesn't have any lead. Add new lead by make a
          <code style="color: green">curl</code> request to the webhook URL.
        </p>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import dayjs from 'dayjs'
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
    const webhookUrl = `${Service.baseUrl}/webhooks/${webhookId}`
    return { userId, leads, webhookUrl }
  },

  data: () => ({
    userId: 'empty',
    leads: [] as Service.Lead[],
    webhookUrl: 'No Webhook URL. Click below link to generate.',
    rowExpand: {},
    canLoadMore: true,
    loadingState: {
      regenerateWebhook: false,
      fetchMoreLeads: false,
    },
  }),

  methods: {
    async regenerateWebhookId() {
      this.loadingState.regenerateWebhook = true
      try {
        const webhookId = await Service.requestNewWebhookId(this.userId)
        this.webhookUrl = `${Service.baseUrl}/webhooks/${webhookId}`
      } catch (error) {
        alert(`Error occured. Detail: ${error}`)
        this.webhookUrl = 'Failed to generate webhook URL, please try again'
      }
      this.loadingState.regenerateWebhook = false
    },
    async loadMoreLeads() {
      if (!this.leads.length) return
      this.loadingState.fetchMoreLeads = true
      try {
        const lastItem = this.leads[this.leads.length - 1]
        const result = await Service.getLeads(this.userId, lastItem.createdAt)
        if (result.data && result.data.length > 0) {
          this.leads.push(...result.data)
        } else {
          this.canLoadMore = false
        }
      } catch (error) {
        alert(`Error to load more leads. Detail: ${error}`)
        // eslint-disable-next-line no-console
        console.error(error)
      }
      this.loadingState.fetchMoreLeads = false
    },
    formatDate(timestamp: number) {
      const ms = 1000
      return dayjs(timestamp * ms).format('DD-MM-YYYY HH:mm')
    },
  },
})
</script>

<style scoped>
/**
 * TODO: Clean up and migrate it to SCSS
 * Also some love for responsive layout?
 */
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

.table {
  display: table;
  width: 100%;
  border: 1px solid #666666;
  border-spacing: 5px;
}

.table-head {
  font-weight: bold;
}

.table-row {
  display: table-row;
  width: auto;
  clear: both;
  background-color: #eee;
}

.table-row:hover {
  cursor: pointer;
  opacity: 0.5;
}

.extra-detail {
  font-size: 12px;
  padding: 4px;
  background-color: #f7f0b6;
}

.table-col {
  padding: 4px;
  float: left;
  display: table-column;
  min-width: 20%;
  max-width: 23%;
}

.table-row.even {
  background-color: white;
}

ul {
  margin: 0;
  padding: 0;
  margin-top: 10px;
  list-style: none;
}
</style>
