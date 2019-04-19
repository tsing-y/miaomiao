const state = {
  name: window.localStorage.getItem('nowName') || '北京',
  id: window.localStorage.getItem('nowId') || '1'
};
const mutations = {
  CITY_INFO(state, payload) {
    state.name = payload.name;
    state.id = payload.id;
  }
};
const actions = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations
};
