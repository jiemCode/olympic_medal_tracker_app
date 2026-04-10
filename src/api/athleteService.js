import axiosClient from './axiosClient'

export const athleteService = {
  getAll: (params) => axiosClient.get('/athletes', { params }),
  getById: (id) => axiosClient.get(`/athletes/${id}`),
  getByPays: (paysId) => axiosClient.get(`/athletes/pays/${paysId}`),
  create: (data) => axiosClient.post('/athletes', data),
  update: (id, data) => axiosClient.put(`/athletes/${id}`, data),
  delete: (id) => axiosClient.delete(`/athletes/${id}`),
}
