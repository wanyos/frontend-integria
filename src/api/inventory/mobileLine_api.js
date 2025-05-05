import ApiBase from '../apiBase'

class MobileLineApi extends ApiBase {
  async getLinesByStatus(token) {
    const needToken = true
    ApiBase._setToken(token)
    const allLinesByStatus = await this.get('/api/inventory/mobile-lines/bystatus', needToken)

    const groupLinesStatus = allLinesByStatus.reduce((groups, line) => {
      const status = line.status
      if (!groups[status]) {
        groups[status] = []
      }
      groups[status].push(line)
      return groups
    }, {})

    const linesByStatus = {
      totalLines: allLinesByStatus.length,
      groupLinesStatus
    }

    return linesByStatus
  }

  async getMobileLinesCount(token) {
    const needToken = true
    ApiBase._setToken(token)
    return await this.get('/api/inventory/mobile-lines/count', needToken)
  }

  async getMobileNewLinesCount(token) {
    const needToken = true
    ApiBase._setToken(token)
    return await this.get('/api/inventory/mobile-newlines/count', needToken)
  }

  async getMobileInuseLinesCount(token) {
    const needToken = true
    ApiBase._setToken(token)
    return await this.get('/api/inventory/mobile-inuselines/count', needToken)
  }

  async getErrorStatusLinesCount(token) {
    const needToken = true
    ApiBase._setToken(token)
    return await this.get('/api/inventory/mobile-errorstatuslines/count', needToken)
  }

  /* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

  async createMobileLine(mobileLineData) {
    return await this.post('/api/inventory/mobile-line', mobileLineData)
  }

  async updateMobileLine(mobileLineId, mobileLineData) {
    return await this.put(`/api/inventory/mobile-line/${mobileLineId}`, mobileLineData)
  }

  async deleteMobileLine(mobileLineId) {
    return await this.delete(`/api/inventory/mobile-line/${mobileLineId}`)
  }
}

export default new MobileLineApi()

// Obtener todas las líneas móviles: /api/inventory/mobile-lines
// Obtener una línea móvil específica por ID: /api/inventory/mobile-lines/:id
// Filtrar líneas móviles por estado: /api/inventory/mobile-lines/state/:state
// Filtrar líneas móviles por usuario: /api/inventory/mobile-lines/user/:userId
// Filtrar líneas móviles por departamento: /api/inventory/mobile-lines/department/:departmentId
// Obtener estadísticas de líneas móviles: /api/inventory/mobile-lines/stats
