import axiosClient from './axiosClient'

export const paysService = {
  getAll: (params) => axiosClient.get('/pays', { params }),
  getById: (id) => axiosClient.get(`/pays/${id}`),
  create: (data) => axiosClient.post('/pays', data),
  update: (id, data) => axiosClient.put(`/pays/${id}`, data),
  delete: (id) => axiosClient.delete(`/pays/${id}`),
}
