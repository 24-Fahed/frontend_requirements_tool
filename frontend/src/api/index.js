import axios from 'axios'

const apiClient = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default {
  async getRequirements(categoryId = null) {
    const params = categoryId ? { categoryId } : {}
    const res = await apiClient.get('/api/requirements', { params })
    return res.data
  },

  async getComponents() {
    const res = await apiClient.get('/api/components')
    return res.data
  },

  async getDefaultLayout(layoutId = null) {
    const params = layoutId ? { layoutId } : {}
    const res = await apiClient.get('/api/default-layout', { params })
    return res.data
  },

  async saveResults(result) {
    const res = await apiClient.post('/api/results', result)
    return res.data
  },

  async getResults() {
    const res = await apiClient.get('/api/results')
    return res.data
  },
}
