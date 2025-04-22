<template>
  <section>
    <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="false"
      :color="'#1565C0'"
    />

    <section class="container-items">
      <div class="item">
        <InfoItem
          title="Total mobile lines"
          :subtitle="mobileLinesStore.totalMobilelines"
          class="item-info"
        >
          <!-- <template #right-icon> <BaseBadge :label="42" /> </template> -->
        </InfoItem>
      </div>

      <div class="item">
        <InfoItem
          title="Total new lines"
          :subtitle="mobileLinesStore.totalMobileNewLines"
          class="item-info"
        >
          <!-- <template #right-icon> <BaseBadge :label="42" /> </template> -->
        </InfoItem>
      </div>

      <div class="item">
        <InfoItem
          title="Total inuse lines"
          :subtitle="mobileLinesStore.totalMobileInuseLines"
          class="item-info"
        >
          <!-- <template #right-icon> <BaseBadge :label="42" /> </template> -->
        </InfoItem>
      </div>

      <div class="item">
        <InfoItem
          title="Total status error"
          :subtitle="mobileLinesStore.totalErrorStatus"
          class="item-info"
        >
          <!-- <template #right-icon> <BaseBadge :label="42" /> </template> -->
        </InfoItem>
      </div>
    </section>
  </section>
</template>

<script setup>
import InfoItem from '@/components/InfoItem.vue'
import BaseBadge from '@/components/BaseBadge.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { ref, onMounted } from 'vue'
import { useMobileLinesStore } from '@/stores/inventory/mobileLines.js'
import { useAuthenticationStore } from '@/stores/authentication'

const mobileLinesStore = useMobileLinesStore()
const authStore = useAuthenticationStore()
const isLoading = ref(false)
let token = null

onMounted(async () => {
  isLoading.value = true
  try {
    token = authStore.isAuthenticated
    if (!token) {
      throw new Error('No authentication token available')
    }

    await Promise.all([
      mobileLinesStore.getTotalMobileLines(token),
      mobileLinesStore.getTotalMobileNewLines(token),
      mobileLinesStore.getTotalMobileInuseLines(token),
      mobileLinesStore.getTotalErrorStatusLines(token)
    ])
  } catch (error) {
    console.error('Error fetching mobile lines:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="css" scoped>
.container-items {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.item {
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
