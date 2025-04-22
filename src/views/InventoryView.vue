<template>
  <section class="main-container container-report">
    <div class="item div__select">
      <ComboBox :options="SELECT_OBJECT" icon-name="hi-solid-chip" v-model="selectedObject" />
    </div>
    <div v-if="selectedObject" class="container-objects">
      <component :is="selectedComponent" />
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref, watch, shallowRef } from 'vue'
import { useAuthenticationStore } from '@/stores/authentication'
import { SELECT_OBJECT } from '@/constants/constants'
import ComboBox from '@/components/ComboBox.vue'
import ReportLine from '@/components/inventory/ReportLine.vue'

const authStore = useAuthenticationStore()
const selectedObject = ref(null)
const selectedComponent = shallowRef(null)
let token = null

const componentMap = {
  'Linea movil': ReportLine
}

onMounted(async () => {
  try {
    token = authStore.isAuthenticated
    if (!token) {
      console.log('!!!Error in token....')
    }
  } catch (error) {
    console.error('Error fetching inventory:', error)
  }
})

watch(
  () => selectedObject.value,
  newValue => {
    if (newValue && componentMap[newValue]) {
      selectedComponent.value = componentMap[newValue]
    } else {
      selectedComponent.value = null
    }
  }
)
</script>

<style lang="css" scoped>
.container-report {
  min-height: 95%;
  margin-top: 15px;
  border-radius: 15px;
  padding: 10px 15px;
  display: grid;
  grid-template-columns: repeat(6, minmax(150px, 1fr));
  grid-template-rows: auto 1fr auto;
  gap: 10px;
}

.container-objects {
  grid-column: 1 / -1;
  grid-row: 2 / 3;
}

.item {
  background-color: #fff;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
