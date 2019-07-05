import * as types from './mutation-types'

const mutations = {
  [types.SYSTEM_AUTHENTICATED](state, authenticated) {
    state.authenticated = authenticated
  },
  [types.SYSTEM_OPEN_ID](state, openid) {
    state.openid = openid
  },
  [types.SYSTEM_BALANCE](state, balance) {
    state.balance = balance
  },
  [types.SYSTEM_USER](state, user) {
    state.user = user
  },
  [types.SYSTEM_LOCATION](state, location) {
    state.location = location
  },
  [types.SYSTEM_CODE](state, code) {
    state.code = code
  },
  [types.SYSTEM_MOBILE](state, mobile) {
    state.mobile = mobile
  },
  [types.SYSTEM_IDENTITYID](state, identityId) {
    state.identityId = identityId
  },
  [types.SYSTEM_SIGNATURE](state, signature) {
    state.signature = signature
  },
  [types.SYSTEM_ENCRYPTED_DATA](state, encryptedData) {
    state.encryptedData = encryptedData
  },
  [types.SYSTEM_IV](state, iv) {
    state.iv = iv
  },
  [types.SYSTEM_SESSION_KEY](state, sessionKey) {
    state.sessionKey = sessionKey
  },
  [types.SYSTEM_CAR](state, car) {
    state.car = car
  },
  [types.SYSTEM_PLATENO](state, plateNo) {
    state.plateNo = plateNo
  },
  [types.SYSTEM_ISSUEDATA](state, issueData) {
    state.issueData = issueData
  }
}

export default mutations
