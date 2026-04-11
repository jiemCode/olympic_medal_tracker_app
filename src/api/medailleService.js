import axiosClient from './axiosClient'

export const medailleService = {
  getAll: (params) => axiosClient.get('/medailles', { params }),
  getById: (id) => axiosClient.get(`/medailles/${id}`),
  getByAthlete: (athleteId) => axiosClient.get(`/medailles/athlete/${athleteId}`),
  getByCompetition: (competitionId) => axiosClient.get(`/medailles/competition/${competitionId}`),
  create: (data) => axiosClient.post('/medailles', data),
  update: (id, data) => axiosClient.put(`/medailles/${id}`, data),
  delete: (id) => axiosClient.delete(`/medailles/${id}`),
}
