const state = {
  loading: false,
  totalSupply: 0,
  cost: 0,
  error: false,
  errorMsg: "",
};

const fetchDataRequest = () => {
  return {
    type: "checkDataRequest",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    ...payload,
    type: "checkDataSuccess",
  };
};

const fetchDataFailed = (payload) => {
  return {
    errorMsg: payload,
    type: "checkDataFailed",
  };
};

const mutations = {
  checkDataRequest(state) {
    state.loading = true;
    state.error = false;
    state.errorMsg = "";
  },
  checkDataSuccess(state, payload) {
    state.loading = false;
    state.totalSupply = payload.totalSupply;
    state.error = false;
    state.errorMsg = "";
  },
  checkDataFailed(state, payload) {
    state.loading = false;
    state.error = true;
    state.errorMsg = payload.errorMsg;
  },
  clearData(state) {
    state.loading = false;
    state.totalSupply = "";
    state.error = false;
    state.errorMsg = "";
  },
};

const actions = {
  async fetchData({ commit, rootState }) {
    commit(fetchDataRequest());
    try {
      const totalSupply = await rootState.wallet.smartContract.methods
        .totalSupply()
        .call();

      commit(
        fetchDataSuccess({
          totalSupply,
        })
      );
    } catch (err) {
      commit(fetchDataFailed("无法从合约获取数据."));
    }
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
