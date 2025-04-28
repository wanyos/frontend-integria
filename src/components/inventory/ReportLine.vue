<template>
  <section class="main-container">
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
          :subtitle="mobileLinesStore.totalErrorStatus.length"
          class="item-info"
        >
          <!-- <template #right-icon> <BaseBadge :label="42" /> </template> -->
        </InfoItem>
      </div>
    </section>

    <section class="container__status-error">
      <TableChart
        title="Lines error status"
        :data-column="columns"
        :data-row="rows"
        :special-column-indices="[0, 1, 2, 3, 4, 5, 6, 7, 8]"
        :special-column-classes="[
          'one-width',
          'one-width',
          'one-width',
          'two-width',
          'column-description',
          'one-width',
          'one-width',
          'one-width',
          'one-width'
        ]"
        class="table-status"
        :table-classes="'no-border-shadow'"
      />
    </section>

    <section class="container-chart">
      <GradientLine title="Total lines by employee" :incidents="linesByEmployee" />
    </section>
  </section>
</template>

<script setup>
import InfoItem from '@/components/InfoItem.vue'
import BaseBadge from '@/components/BaseBadge.vue'
import TableChart from '../TableChart.vue'
import GradientLine from '../GradientLine.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { ref, computed, onMounted } from 'vue'
import { useMobileLinesStore } from '@/stores/inventory/mobileLines.js'
import { useAuthenticationStore } from '@/stores/authentication'

const mobileLinesStore = useMobileLinesStore()
const authStore = useAuthenticationStore()
const isLoading = ref(false)
const columns = ref([])
const rows = ref([])
let token = null

const linesByEmployee = [
  {
    hour: 0,
    count: 28
  },
  {
    hour: 1,
    count: 44
  },
  {
    hour: 2,
    count: 23
  },
  {
    hour: 3,
    count: 16
  },
  {
    hour: 4,
    count: 17
  },
  {
    hour: 5,
    count: 29
  },
  {
    hour: 6,
    count: 115
  },
  {
    hour: 7,
    count: 452
  },
  {
    hour: 8,
    count: 435
  },
  {
    hour: 9,
    count: 447
  },
  {
    hour: 10,
    count: 472
  },
  {
    hour: 11,
    count: 457
  },
  {
    hour: 12,
    count: 420
  },
  {
    hour: 13,
    count: 551
  },
  {
    hour: 14,
    count: 345
  },
  {
    hour: 15,
    count: 181
  },
  {
    hour: 16,
    count: 104
  },
  {
    hour: 17,
    count: 75
  },
  {
    hour: 18,
    count: 56
  },
  {
    hour: 19,
    count: 68
  },
  {
    hour: 20,
    count: 58
  },
  {
    hour: 21,
    count: 56
  },
  {
    hour: 22,
    count: 40
  },
  {
    hour: 23,
    count: 47
  }
]

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

    columns.value = Object.keys(mobileLinesStore.totalErrorStatus[0])
    columns.value = ['N', ...columns.value]
    rows.value = mobileLinesStore.totalErrorStatus.map((row, index) => {
      return {
        N: index + 1,
        ...row
      }
    })
  } catch (error) {
    console.error('Error fetching mobile lines:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="css">
.main-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

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

.container__status-error {
  border: 1px solid var(--color-text);
  border-radius: 15px;
  padding: 1rem;
  height: 20rem;
  overflow-x: auto;
  width: 70rem;
  margin-left: auto;
  margin-right: auto;
}

.column-description {
  width: 9rem;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  max-width: 10rem;
}

.table-status {
  width: 100%;
  overflow-y: auto;
  max-height: 20rem;
}

.one-width {
  width: 0.8rem;
}

.two-width {
  width: 5rem;
}

.no-border-shadow {
  border: none !important;
  box-shadow: none !important;
}

.container-chart {
  border: 1px solid red;
  height: 300px;
}
</style>
