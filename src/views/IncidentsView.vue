<template>
  <section class="main-container container-report">
    <article class="section-header">
      <div class="div-datepicker">
        <DateFilter @set-date="selectDate" />
      </div>
      <button
        @click="search"
        :disabled="dates.initDate === null"
        class="btn__search"
        :class="isDisabled"
      >
        Search
      </button>
    </article>

    <article class="chart-base container-servidesk">
      <loading
        v-model:active="isLoading"
        :can-cancel="true"
        :is-full-page="false"
        :color="'#1565C0'"
      />
      <p>{{ datesServidesk }}</p>
      <TableChart
        v-if="issIncidents.length !== 0"
        title="Summary of incidents at ISS Servidersk"
        :data-column="columnsServidesk"
        :data-row="issIncidents"
      />
    </article>

    <article class="chart-base container-integria">
      <loading
        v-model:active="isLoading"
        :can-cancel="true"
        :is-full-page="false"
        :color="'#1565C0'"
      />
      <p>{{ datesIntegria }}</p>
      <TableChart
        v-if="integriaTechnology.length !== 0"
        title="Summary of incidents in integria technology"
        :data-column="columnsIntegriaTec"
        :data-row="integriaTechnology"
        class="tableTecIntegria"
      />
    </article>

    <div class="div__process">
      <button @click="startProcess" class="btn__search btn__send" :class="isArrayFiles">
        Start process
      </button>
    </div>

    <div class="chart-base container-files">
      <CardFile
        v-for="(file, index) in filesIss"
        :key="index"
        :title="file.name"
        :icon="IconExcel"
        :size="file.content.byteLength"
        @drag-start="e => handleFileDragStart(e, file)"
      />

      <CardFile
        v-for="(file, index) in filesIntegria"
        :key="index"
        :title="file.name"
        :icon="IconExcel"
        :size="file.content.byteLength"
        @drag-start="e => handleFileDragStart(e, file)"
      />
    </div>

    <article class="chart-base container-incidents">
      <loading
        v-model:active="isLoading"
        :can-cancel="true"
        :is-full-page="false"
        :color="'#1565C0'"
      />
      <p>{{ datesIntegria }}</p>

      <CardItem
        v-for="(item, index) in sortedIncidents"
        :key="index"
        :title="item.resolutor"
        :count="item.totalIncidents"
        :emails-to="item.emailsTo"
        :emails-cc="item.emailsCc"
        :email-response="emailResponses[item.resolutor]"
        @update:newEmailsTo="emails => newEmailsTo(emails, index)"
        @update:newEmailsCc="emails => newEmailsCc(emails, index)"
        @button-click="handleSendGmail(item)"
      />
    </article>
  </section>
</template>

<script setup>
import IncidentsApi from '@/api/incidents_api'
import { onMounted, ref, reactive, computed } from 'vue'
import { useAuthenticationStore } from '@/stores/authentication'
import TableChart from '@/components/TableChart.vue'
import DateFilter from '@/components/DateFilter.vue'
import CardFile from '@/components/global-components/CardFile.vue'
import IconExcel from '@/assets/img/img-excel.webp'
import CardItem from '@/components/global-components/CardItem.vue'
import dayjs from 'dayjs'
import Loading from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'
import { createFileIss, createFileIntegria } from '../utils/create_files.js'
import { EMAIL_LIST } from '@/constants/emailList.js'

const columnsServidesk = ['Location', 'Incidents']
const columnsIntegriaTec = ['Type', 'Incidents']

const incidents = ref([])
const issIncidents = ref([])
const integriaTechnology = ref([])

const filesIss = ref([])
const filesIntegria = ref([])

const integriaInit = ref(dayjs('2024-01-01'))
const isLoading = ref(false)
const authStore = useAuthenticationStore()
let token = null
const dates = reactive({ initDate: null, endDate: null })

const emailResponses = ref({})

let incIss = null
let integriaTec = null

const selectDate = date => {
  dates.endDate = dayjs(date)
  dates.initDate = dates.endDate.subtract(6, 'day')
}

const isDisabled = computed(() => (dates.initDate === null ? 'btnDisabled' : 'btnEnabled'))
const datesServidesk = computed(() =>
  dates.endDate !== null
    ? `Dates servidesk 01 Jan, 2024 -- ${dates.endDate.format('DD MMM,YYYY')}`
    : ''
)
const datesIntegria = computed(() =>
  dates.endDate !== null
    ? `Dates integria: ${integriaInit.value.format('DD MMM,YYYY')} -- ${dates.endDate.format('DD MMM,YYYY')}`
    : ''
)

const isArrayFiles = computed(() =>
  issIncidents.value.length === 0 && integriaTechnology.value === 0 ? 'btnDisabled' : 'btnEnabled'
)

const sortedIncidents = computed(() => {
  return [...incidents.value].sort((a, b) => {
    if (a.emailsTo.length > 0 && b.emailsTo.length === 0) return -1
    if (a.emailsTo.length === 0 && b.emailsTo.length > 0) return 1
    return 0
  })
})

onMounted(async () => {
  try {
    token = authStore.isAuthenticated
    if (!token) {
      console.log('!!!Error in token....')
    }
  } catch (error) {
    console.error('Error fetching incidents:', error)
  }
})

const search = async () => {
  isLoading.value = true
  const endDate = dayjs(dates.endDate).format('YYYY-MM-DD')

  // incidents integria resolutor externo
  const incIntegria = await IncidentsApi.getIncExternalResolutor(
    integriaInit.value.format('YYYY-MM-DD'),
    endDate,
    token
  )

  incidents.value = incIntegria.map(item => {
    let to = []
    let cc = []
    let cco = []
    const obj = EMAIL_LIST.find(list => item.id === list.id)
    if (obj) {
      to = obj.to
      cc = obj.cc
      cco = obj.cco
    }
    return {
      id: item.id,
      resolutor: item.resolutor,
      incidentsResolutor: item.incidents,
      totalIncidents: item.incidents.length,
      emailsTo: to,
      emailsCc: cc,
      emailsCco: cco
    }
  })

  // incidents integria tecnologia
  integriaTec = await IncidentsApi.getIncidentsTechnology(
    integriaInit.value.format('YYYY-MM-DD'),
    endDate,
    token
  )
  integriaTechnology.value = Object.entries(integriaTec).map(([type, incidents]) => ({
    type,
    total: incidents.length
  }))

  // incidents servidesk
  try {
    incIss = await IncidentsApi.getIssIncidents(token)
    issIncidents.value = Object.entries(incIss).map(([location, incidents]) => ({
      location,
      total: incidents.length
    }))
  } catch (error) {
    issIncidents.value = [{ location: 'No data', total: 0 }]
    console.error('Error fetching incidents servidesk:', error.message)
  }

  isLoading.value = false
}

const handleFileDragStart = ({ nativeEvent }, file) => {
  try {
    const blob = new Blob([file.content], { type: file.type })
    const url = URL.createObjectURL(blob)
    const dt = nativeEvent.dataTransfer
    dt.clearData()

    // Configurar para todos los navegadores
    dt.setData('text/plain', file.name)
    dt.setData('DownloadURL', `${file.type}:${file.name}:${url}`)
    // Añadir archivo real
    dt.items.add(new File([blob], file.name, { type: file.type }))

    // Limpiar memoria después de 30s
    setTimeout(() => URL.revokeObjectURL(url), 30000)
  } catch (error) {
    console.error('Error en dragstart:', error)
    nativeEvent.preventDefault()
  }
}

const newEmailsTo = (newEmails, index) => {
  if (incidents.value[index]) {
    incidents.value[index].emailsTo = newEmails
  }
}

const newEmailsCc = (newEmails, index) => {
  if (incidents.value[index]) {
    incidents.value[index].emailsCc = newEmails
  }
}

const handleSendGmail = async item => {
  const email = item.emailsTo.join(',')
  const cc = item.emailsCc.join(',')
  const cco = item.emailsCco.join(',')

  const title = `EMT - Seguimiento de incidencias ${item.resolutor}`
  const comment =
    'Buenos dias. \n\n Debido a que estamos realizando el seguimiento de las incidencias, necesitamos conocer el estado en que se encuentran las que se adjuntan en el archivo. \n\nSaludos.'

  try {
    emailResponses.value[item.resolutor] = { status: 'sending', message: 'Enviando...' }
    const incidents = item.incidentsResolutor

    const res = await fetch('http://localhost:8022/send-gmail', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: token.value },
      body: JSON.stringify({ email, cc, cco, title, comment, incidents })
    })

    const result = await res.text()
    const resultObj = JSON.parse(result)
    emailResponses.value[item.resolutor] = {
      resolutor: item.resolutor,
      status: 'Success',
      ...resultObj
    }
    // console.log('result', resultObj)
  } catch (error) {
    emailResponses.value[item.resolutor] = {
      resolutor: item.resolutor,
      status: 'error',
      message: error.message
    }
  }
}

const startProcess = async () => {
  const openDate = dayjs(dates.initDate)
  const closeDate = dayjs(dates.endDate)

  if (incIss) {
    filesIss.value = await createFileIss(incIss, dates.initDate, dates.endDate)
  }
  if (integriaTec) {
    filesIntegria.value = await createFileIntegria(integriaTec, openDate, closeDate)
  }
  // console.log('Validación:', {
  //       name: filesIss.value[0].name,
  //       type: filesIss.value[0].type,
  //       sizeBytes: filesIss.value[0].content.byteLength, // Debe ser > 0
  //       isUint8Array: filesIss.value[0].content instanceof Uint8Array // true
  //   });
}
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

.section-header {
  grid-column: 1 / -1;
  display: flex;
  padding: 10px;
  justify-content: space-between;
}

.section-search > button {
  border: 1px solid var(--color-text);
  color: var(--color-text);
  padding: 5px 15px;
  border-radius: 5px;
  margin: 5px;
  cursor: pointer;
}

.section-search > button:hover {
  background-color: var(--hover-button);
}

.chart-base {
  background-color: #fff;
  border-radius: 5px;
  padding: 15px;
}

.container-incidents {
  position: relative;
  min-height: 20rem;
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.container-servidesk {
  position: relative;
  grid-column: 1 / 4;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container-integria {
  position: relative;
  grid-column: 4 / 7;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container-servidesk .tableTecIntegria {
  margin-top: 25px;
}

.container-files {
  grid-column: 4 / 7;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 1rem;
  place-items: center;
}

.section__footer {
  padding: 1rem;
  grid-column: 1 / -1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.div__process {
  padding: 1rem;
}

.div-datepicker {
  display: flex;
  align-items: center;
}

.div-datepicker p {
  margin-left: 1rem;
  color: var(--color-text-p);
}

.btn__search {
  border: 1px solid var(--color-text);
  color: var(--color-text);
  padding: 4px 15px;
  border-radius: 5px;
  margin: 5px;
}

.btn__send {
  cursor: pointer;
}

.btnEnabled {
  cursor: pointer;
}

.btnEnabled:hover {
  background-color: var(--hover-button);
}

.btnDisabled {
  cursor: not-allowed;
}
</style>
