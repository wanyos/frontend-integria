<template>
  <section class="container-report-lines">
    <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :is-full-page="false"
      :color="'#1565C0'"
    />

    <section class="container-items">
      <div class="item">
        <InfoItem title="Total mobile lines" :subtitle="totalLines" class="item-info"> </InfoItem>
      </div>

      <div v-for="(item, index) in groupsByStatus" :key="index" class="item">
        <button @click="showLines(item.lines, item.status)" class="button__item">
          <InfoItem
            :title="`Total ${item.status} lines`"
            :subtitle="item.lines.length"
            class="item-info"
          >
            <!-- <template #right-icon> <BaseBadge :label="42" /> </template> -->
          </InfoItem>
        </button>
      </div>
    </section>

    <section class="container-lines__status">
      <TableChart
        :title="`Status ${isStatus} lines`"
        :data-column="columns"
        :data-row="selectedLines"
        :special-column-classes="{
          5: 'column-description'
        }"
        class="chart-base"
      />
    </section>

    <section class="container-lines__employees">
      <BarChart
        title="Total lines by employee"
        :incidents="getLinesByEmployee"
        :categories="employees"
        :options="{ rotate: -45, rotateAlways: true, width: '50%' }"
        class="chart-base"
      />
    </section>
  </section>
</template>

<script setup>
import InfoItem from '@/components/InfoItem.vue'
import BaseBadge from '@/components/BaseBadge.vue'
import TableChart from '@/components/TableChart.vue'
import BarChart from '@/components/BarChart.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { ref, computed, onMounted } from 'vue'
import { useMobileLinesStore } from '@/stores/inventory/mobileLines.js'
import { useAuthenticationStore } from '@/stores/authentication'
import { generateDataBarchart } from '@/utils/dataProcessor.js'

const mobileLinesStore = useMobileLinesStore()
const authStore = useAuthenticationStore()

const totalLines = ref(0)
const groupsByStatus = ref([])
const selectedLines = ref([])
const isStatus = ref('')

const isLoading = ref(false)
const columns = ref([])
let token = null

const getLinesByEmployee = computed(() => generateDataBarchart(testData))
const linesByEmployee = JSON.parse(
  JSON.stringify([
    {
      hour: 0,
      count: 7
    },
    {
      hour: 1,
      count: 7
    },
    {
      hour: 2,
      count: 7
    },
    {
      hour: 3,
      count: 6
    },
    {
      hour: 4,
      count: 9
    },
    {
      hour: 5,
      count: 17
    },
    {
      hour: 6,
      count: 17
    },
    {
      hour: 7,
      count: 109
    },
    {
      hour: 8,
      count: 120
    },
    {
      hour: 9,
      count: 108
    },
    {
      hour: 10,
      count: 106
    },
    {
      hour: 11,
      count: 103
    },
    {
      hour: 12,
      count: 86
    },
    {
      hour: 13,
      count: 98
    },
    {
      hour: 14,
      count: 64
    },
    {
      hour: 15,
      count: 47
    },
    {
      hour: 16,
      count: 35
    },
    {
      hour: 17,
      count: 20
    },
    {
      hour: 18,
      count: 13
    },
    {
      hour: 19,
      count: 20
    },
    {
      hour: 20,
      count: 7
    },
    {
      hour: 21,
      count: 18
    },
    {
      hour: 22,
      count: 11
    },
    {
      hour: 23,
      count: 9
    }
  ])
)

const testData = [
  { employee: 1234, line: 1001, count: 12 },
  { employee: 12345, line: 1002, count: 7 },
  { employee: 23456, line: 1003, count: 14 },
  { employee: 34567, line: 1004, count: 3 },
  { employee: 45678, line: 1005, count: 10 },
  { employee: 56789, line: 1006, count: 8 },
  { employee: 67890, line: 1007, count: 15 },
  { employee: 78901, line: 1008, count: 5 },
  { employee: 89012, line: 1009, count: 11 },
  { employee: 90123, line: 1010, count: 6 },
  { employee: 12, line: 1011, count: 13 },
  { employee: 123, line: 1012, count: 4 },
  { employee: 234, line: 1013, count: 9 },
  { employee: 345, line: 1014, count: 2 },
  { employee: 456, line: 1015, count: 15 },
  { employee: 567, line: 1016, count: 8 },
  { employee: 678, line: 1017, count: 7 },
  { employee: 789, line: 1018, count: 14 },
  { employee: 890, line: 1019, count: 3 },
  { employee: 901, line: 1020, count: 12 },
  { employee: 34567, line: 1004, count: 3 },
  { employee: 45678, line: 1005, count: 10 },
  { employee: 56789, line: 1006, count: 8 },
  { employee: 67890, line: 1007, count: 15 },
  { employee: 78901, line: 1008, count: 5 },
  { employee: 89012, line: 1009, count: 11 },
  { employee: 90123, line: 1010, count: 6 },
  { employee: 12, line: 1011, count: 13 },
  { employee: 123, line: 1012, count: 4 },
  { employee: 234, line: 1013, count: 9 },
  { employee: 345, line: 1014, count: 2 },
  { employee: 456, line: 1015, count: 15 },
  { employee: 789, line: 1018, count: 14 },
  { employee: 890, line: 1019, count: 3 },
  { employee: 901, line: 1020, count: 12 },
  { employee: 34567, line: 1004, count: 3 },
  { employee: 45678, line: 1005, count: 10 },
  { employee: 56789, line: 1006, count: 8 },
  { employee: 67890, line: 1007, count: 15 },
  { employee: 78901, line: 1008, count: 5 },
  { employee: 89012, line: 1009, count: 11 },
  { employee: 90123, line: 1010, count: 6 },
  { employee: 12, line: 1011, count: 13 },
  { employee: 123, line: 1012, count: 4 },
  { employee: 234, line: 1013, count: 9 },
  { employee: 345, line: 1014, count: 2 },
  { employee: 456, line: 1015, count: 15 }
]

const employees = testData.map(item => String(item.employee).padStart(5, '0'))

const showLines = (lines, status) => {
  columns.value = Object.keys(lines[0])

  columns.value = ['N', ...columns.value]
  lines = lines.map((row, index) => {
    return {
      N: index + 1,
      ...row
    }
  })

  selectedLines.value = lines
  isStatus.value = status
}

onMounted(async () => {
  isLoading.value = true
  try {
    token = authStore.isAuthenticated
    if (!token) {
      throw new Error('No authentication token available')
    }

    if (!mobileLinesStore.linesByStatus.length) {
      await mobileLinesStore.getLinesByStatus(token)
    }

    totalLines.value = mobileLinesStore.totalByStatus
    groupsByStatus.value = mobileLinesStore.linesByStatus
    const firstGroup = groupsByStatus.value
    const groupStatus = firstGroup[0].status
    const groupLines = firstGroup[0].lines

    showLines(groupLines, groupStatus)

    // console.log('report total', totalLines.value)
    // console.log('retort lines', groupsByStatus.value)
    // console.log('lines', firstGroup[0].lines[0])
  } catch (error) {
    console.error('Error fetching mobile lines:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style lang="css">
.container-report-lines {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow: hidden;
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

.container-lines__status {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
}

.container-lines__employees {
  width: 90%;
  margin-left: auto;
  margin-right: auto;
}

.column-description {
  max-width: 150px;
}

.button__item {
  cursor: pointer;
}

.button__item:hover {
  background-color: var(--hover-button);
}

.container-chart {
  border: 1px solid red;
  height: 300px;
}
</style>
