const storeAction = {
  setAuthenticated: ({commit}, data) => {
    commit('setAuthenticated', data)
  },
  setUser: ({commit}, data) => {
    commit('setUser', data)
  }
}

export default storeAction
