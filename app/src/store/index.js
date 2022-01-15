import { createStore } from "vuex";
import wallet from "./modules/wallet";
import contract from "./modules/contract";

export default createStore({
  modules: {
    wallet,
    contract,
  },
});
