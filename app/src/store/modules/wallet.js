import Web3 from "web3/dist/web3.min.js";

const defaultState = {
  loading: false,
  account: null,
  smartContract: null,
  web3: null,
  errorMsg: "",
};

const connectRequest = () => {
  return {
    type: "connectionRequest",
  };
};

const connectSuccess = (payload) => {
  return {
    ...payload,
    type: "connectionSuccess",
  };
};

const connectFailed = (payload) => {
  return {
    type: "connectionFailed",
    errorMsg: payload,
  };
};

const updateAccountRequest = (payload) => {
  return {
    ...payload,
    type: "updateAccount",
  };
};

const updateErrorMessage = (payload) => {
  return {
    type: "updateErrorMessage",
    errorMsg: payload,
  };
};

const disconnectWallet = () => {
  return {
    type: "disconnectWallet",
  };
};

const mutations = {
  connectionRequest(state) {
    state.loading = true;
  },
  connectionSuccess(state, payload) {
    state.loading = false;
    state.account = payload.account;
    state.smartContract = payload.smartContract;
    state.web3 = payload.web3;
  },
  connectionFailed(state, payload) {
    state.loading = false;
    state.errorMsg = payload.errorMsg;
  },
  updateAccount(state, payload) {
    state.account = payload.account;
  },
  updateErrorMessage(state, payload) {
    state.errorMsg = payload.errorMsg;
  },
  disconnectWallet(state) {
    state.loading = false;
    state.account = null;
    state.smartContract = null;
    state.web3 = null;
    state.errorMsg = "";
  },
};

const actions = {
  async connect({ commit, dispatch }) {
    commit(connectRequest());

    let abi, CONFIG;
    await import("@/config/abi.json").then(({ default: json }) => {
      abi = json;
    });

    await import("@/config/config.json").then(({ default: json }) => {
      CONFIG = json;
    });

    const { ethereum } = window;
    const metamaskIsInstalled = ethereum && ethereum.isMetaMask;

    if (metamaskIsInstalled) {
      let web3 = new Web3(
        ethereum || Web3.givenProvider || "ws://some.local-or-remote.node:8546"
      );

      ethereum.on("chainChanged", () => {
        commit(updateErrorMessage(""));
        dispatch("connect");
      });

      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        const networkId = await ethereum.request({
          method: "net_version",
        });
        const targetNetworkId = CONFIG.NETWORK.ID;

        if (networkId == targetNetworkId) {
          const SmartContractObj = new web3.eth.Contract(
            abi,
            CONFIG.CONTRACT_ADDRESS
          );

          commit(
            connectSuccess({
              account: accounts[0],
              smartContract: SmartContractObj,
              web3: web3,
            })
          );

          // Add listeners
          ethereum.on("accountsChanged", (accounts) => {
            commit(updateAccountRequest({ account: accounts[0] }));
          });
        } else {
          // switch to correct network
          await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x" + targetNetworkId.toString(16) }],
          });

          commit(connectFailed(`请更改网络为 ${CONFIG.NETWORK.NAME}.`));
        }
      } catch (err) {
        commit(connectFailed("未知错误 T^T: " + err.message));
      }
    } else {
      commit(connectFailed("请先安装Metamask钱包."));
    }
  },
  async disconnect({ commit }) {
    commit(disconnectWallet());
    commit("contract/clearData", {}, { root: true });
  },
};

export default {
  namespaced: true,
  state: defaultState,
  actions,
  mutations,
};
