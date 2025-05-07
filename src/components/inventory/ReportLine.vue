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
        <button @click="showLinesStatus(item.lines, item.status)" class="button__item">
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

    <div class="custom-separator"></div>

    <div class="div__info-employees">
      <div class="div__combo">
        <ComboBox
          :options="comboValues"
          icon-name="md-formatlistnumbered-outlined"
          v-model="countLines"
          class="combobox"
        />
        <div class="item">
          <InfoItem :title="`Total employees ${employeeItems.length}`" class="item-info" />
        </div>
      </div>

      <form class="form-search" @submit.prevent="searchEmployee">
        <label for="employeeId">Employee</label>
        <input
          type="number"
          id="employeeId"
          v-model="employeeSearch"
          min="0"
          max="999999"
          placeholder="Enter ID"
        />
        <button type="submit">Search</button>
      </form>
    </div>

    <section class="container-lines__employees container-item__employees">
      <div v-for="(item, index) in employeeItems" :key="index" class="item employee-item">
        <InfoItem
          :title="`user: ${item.owner}`"
          :subtitle="`lines: ${item.lineNames}`"
          title-class="title__infoitem"
          :subtitle-class="'subtitle__infoitem'"
          class="item-info"
        />
      </div>
    </section>
  </section>
</template>

<script setup>
import InfoItem from '@/components/InfoItem.vue'
import BaseBadge from '@/components/BaseBadge.vue'
import TableChart from '@/components/TableChart.vue'
import ComboBox from '@/components/ComboBox.vue'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { ref, onMounted, watch } from 'vue'
import { useMobileLinesStore } from '@/stores/inventory/mobileLines.js'
import { useAuthenticationStore } from '@/stores/authentication'

const mobileLinesStore = useMobileLinesStore()
const authStore = useAuthenticationStore()

const employeeItems = ref([])
const totalLines = ref(0)
const groupsByStatus = ref([])
const selectedLines = ref([])
const isStatus = ref('')
const countLines = ref('')
const employeeSearch = ref('')

const isLoading = ref(false)
const columns = ref([])
let token = null

const comboValues = ref([])

const showLinesStatus = (lines, status) => {
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

const showLinesEmployee = () => {
  const linesEmployee = mobileLinesStore.linesByEmployee
  employeeItems.value = []

  if (!linesEmployee.length) return
  const numLines = parseInt(countLines.value)
  // Como el array ya está ordenado por owner, vamos a agrupar
  const ownerMap = {}
  // Agrupar todas las líneas por propietario
  linesEmployee.forEach(line => {
    if (!ownerMap[line.owner]) {
      ownerMap[line.owner] = []
    }
    ownerMap[line.owner].push(line)
  })

  // Filtrar propietarios con exactamente N líneas
  Object.entries(ownerMap).forEach(([owner, lines]) => {
    if (lines.length === numLines) {
      // Extraer los nombres de cada línea
      const lineNames = lines.map(line => line.name || 'Sin nombre').join(', ')
      employeeItems.value.push({
        owner,
        lines: lines,
        lineNames: lineNames
      })
    }
  })
  // console.log(`Found ${employeeItems.value.length} employees with ${countLines.value} lines`)
  // console.log('Employee data:', employeeItems.value)
}

const searchEmployee = () => {
  // Verifica que el valor sea un número de hasta 6 dígitos
  if (employeeSearch.value && /^\d{1,6}$/.test(employeeSearch.value)) {
    console.log('Searching for employee:', employeeSearch.value)
  } else {
    console.warn('Invalid employee ID')
  }
}

const getEmployeeLinesOptions = () => {
  const linesEmployee = mobileLinesStore.linesByEmployee
  const lineCountSet = new Set()
  const ownerCounts = {}
  // Contar líneas por propietario
  linesEmployee.forEach(line => {
    ownerCounts[line.owner] = (ownerCounts[line.owner] || 0) + 1
  })
  // Añadir los conteos al Set
  Object.values(ownerCounts).forEach(count => {
    lineCountSet.add(count)
  })
  return Array.from(lineCountSet)
    .sort((a, b) => a - b)
    .map(count => `${count} lines`)
}

watch(
  () => countLines.value,
  () => {
    showLinesEmployee()
  }
)

onMounted(async () => {
  isLoading.value = true
  try {
    token = authStore.isAuthenticated
    if (!token) {
      throw new Error('No authentication token available')
    }

    if (!mobileLinesStore.linesByEmployee.length) {
      await mobileLinesStore.getLinesByEmployee(token)
    }

    if (!mobileLinesStore.linesByStatus.length) {
      await mobileLinesStore.getLinesByStatus(token)
    }

    comboValues.value = getEmployeeLinesOptions()
    countLines.value = comboValues.value[0]
    showLinesEmployee()

    totalLines.value = mobileLinesStore.totalByStatus
    groupsByStatus.value = mobileLinesStore.linesByStatus
    const firstGroup = groupsByStatus.value
    const groupStatus = firstGroup[0].status
    const groupLines = firstGroup[0].lines

    showLinesStatus(groupLines, groupStatus)

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

.combobox {
  width: 12rem;
  display: flex;
  align-items: center;
}

.div__info-employees {
  display: flex;
  justify-content: space-between;
  position: relative;
  z-index: 20;
}

.div__combo {
  display: flex;
  gap: 0.5rem;
}

.item {
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container-lines__status,
.container-lines__employees {
  width: 100%;
  z-index: 1;
  width: 95%;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: center;
}

.container-item__employees {
  border: 3px solid var(--hover-button);
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, auto));
  gap: 0.75rem;
  gap: 0.5rem;
  overflow-y: auto;
  overflow-x: hidden;
  height: 20rem;
}

.employee-item {
  width: fit-content;
  max-width: 100%;
  padding: 10px;
  justify-self: start;
  align-self: start;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.column-description {
  max-width: 300px;
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

/*** class to InfoItem */
.title__infoitem {
  margin-left: 6px;
  color: #030712;
  font-size: 14px;
  font-weight: 500;
}

.subtitle__infoitem {
  color: #030712;
  font-size: 12px;
  font-weight: 400;
  margin-top: 5px;
}

/** section separator */
.custom-separator {
  height: 5px;
  background-color: var(--hover-button);
  border-radius: 2px;
  margin: 0 auto;
  width: 100%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/**     styles form search */
.form-search {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-search label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-search input {
  width: 100px;
  height: 32px;
  padding: 0 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.form-search input:focus {
  outline: none;
  border-color: #0088cc;
  box-shadow: 0 0 0 2px rgba(0, 136, 204, 0.2);
}

.form-search button {
  background-color: #0088cc;
  color: white;
  font-size: 14px;
  font-weight: 500;
  height: 32px;
  padding: 0 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.form-search button:hover {
  background-color: #006da3;
}
</style>
