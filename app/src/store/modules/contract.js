import CONFIG from "@/config/config.json";
import { useToast } from "vue-toastification";

const state = {
  loading: false,
  minting: false,
  totalSupply: 0,
  cost: 0,
  error: false,
  errorMsg: "",
  minted: false,
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

const mintingNFT = () => {
  return {
    type: "mintingNFT",
  };
};

const mintNFTFailed = (payload) => {
  return {
    errorMsg: payload,
    type: "mintNFTFailed",
  };
};

const mintNFTSuccess = () => {
  return {
    type: "mintNFTSuccess",
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
  mintingNFT(state) {
    state.minting = true;
    state.error = false;
    state.errorMsg = "";
  },
  mintNFTFailed(state, payload) {
    state.minting = false;
    state.error = true;
    state.errorMsg = payload.errorMsg;
  },
  mintNFTSuccess(state) {
    state.minting = false;
    state.error = false;
    state.errorMsg = "";
    state.minted = true;
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
  async mintNFT({ dispatch, commit, rootState }) {
    if (!rootState.wallet) {
      return false;
    }

    commit(mintingNFT());
    const toast = useToast();
    const wallet = rootState.wallet;
    const cost = CONFIG.MINT_COST;
    const gasLimit = CONFIG.GAS_LIMIT;
    const totalCostWei = wallet.web3.utils.toWei(String(cost));
    const totalGasLimit = String(gasLimit);

    wallet.smartContract.methods
      .mint(1)
      .send({
        gasLimit: totalGasLimit,
        to: CONFIG.CONTRACT_ADDRESS,
        from: wallet.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        commit(mintNFTFailed(err.message));
        toast.error(err.message);
      })
      .then(() => {
        commit(mintNFTSuccess());
        dispatch("fetchData");

        toast.success("已成功铸造你的NFT！请到Opensea查看");
      });
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
};
