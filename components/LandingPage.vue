<template>
  <div class="mx-auto h-min p-10 bg-shark-950 rounded-md max-w-lg">
    <h1 class="text-2xl font-roboto text-white mb-4">Your technology requests</h1>
    <ClientOnly>
      <NuxtLink to="/form">
        <button
          class="bg-spray-300 hover:bg-spray-200 text-black font-medium py-2 px-4 rounded mb-4 w-full"
          @click="handleNewRequest"
        >
          <font-awesome-icon :icon="['fas', 'plus']" />
          New request
        </button>
      </NuxtLink>
    </ClientOnly>
    <div class="flex justify-between text-sm px-1 font-semibold text-shark-400 mb-1">
      <h1>Technology Name</h1>
      <span>Status</span>
    </div>
    <div
      v-for="request in requests"
      :key="request._id"
      class="flex justify-between items-center py-2 px-3 mb-2 bg-gray-50 rounded-md"
    >
      <span class="text-white text-lg">{{ request.technologyName }}</span>
      <span :class="statusClass(request.status)" class="border px-2 rounded-full">
        {{ request.status }}
      </span>
    </div>

    <div v-if="requests.length === 0" class="text-shark-400 text-center text-xs mt-5">
      You haven't made any requests yet.
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      requests: []
    }
  },
  async created() {
    await this.fetchRequests()
  },
  methods: {
    async fetchRequests() {
      try {
        const response = await useFetch('/api/tech')
        this.requests = response.data.value.body
      } catch (error) {
        console.error('Error fetching requests:', error)
      }
    },
    statusClass(status) {
      return {
        'text-green border-green bg-green-10': status === 'Approved',
        'text-yellow border-yellow bg-yellow-10': status === 'Pending Approval',
        'text-red border-red bg-red-10': status === 'Rejected'
      }
    }
  }
}
</script>
