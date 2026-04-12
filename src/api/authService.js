import axiosClient from './axiosClient'

const authService = {
  login: (username, password) =>
    axiosClient.post('/auth/login', { username, password }),

  register: (username, password) =>
    axiosClient.post('/auth/register', { username, password }),
}

export default authService
