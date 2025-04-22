import { ref } from 'vue'
import { defineStore } from 'pinia'
import MobileLineApi from '@/api/inventory/mobileLine_api.js'

export const useMobileLinesStore = defineStore('mobileLines', () => {
  // total lines, en uso, sin uso, error en el status

  const totalMobilelines = ref(0)
  const totalMobileNewLines = ref(0)
  const totalMobileInuseLines = ref(0)
  const totalErrorStatus = ref(0)

  const getTotalMobileLines = async token => {
    totalMobilelines.value = await MobileLineApi.getMobileLinesCount(token)
  }

  const getTotalMobileNewLines = async token => {
    totalMobileNewLines.value = await MobileLineApi.getMobileNewLinesCount(token)
  }

  const getTotalMobileInuseLines = async token => {
    totalMobileInuseLines.value = await MobileLineApi.getMobileInuseLinesCount(token)
  }

  const getTotalErrorStatusLines = async token => {
    totalErrorStatus.value = await MobileLineApi.getErrorStatusLinesCount(token)
  }

  return {
    getTotalMobileLines,
    getTotalMobileNewLines,
    getTotalMobileInuseLines,
    getTotalErrorStatusLines,
    totalMobilelines,
    totalMobileNewLines,
    totalMobileInuseLines,
    totalErrorStatus
  }
})
