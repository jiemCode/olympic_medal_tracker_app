import axiosClient from './axiosClient'

export const competitionService = {
  getAll: (params) => axiosClient.get('/competitions', { params }),
  getById: (id) => axiosClient.get(`/competitions/${id}`),
  create: (data) => axiosClient.post('/competitions', data),
  update: (id, data) => axiosClient.put(`/competitions/${id}`, data),
  delete: (id) => axiosClient.delete(`/competitions/${id}`),
}
