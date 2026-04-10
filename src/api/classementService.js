import axiosClient from './axiosClient'

export const classementService = {
  getAll: (tri) => axiosClient.get('/classement', { params: tri ? { tri } : {} }),
  getByPays: (paysId) => axiosClient.get(`/classement/pays/${paysId}`),
}
