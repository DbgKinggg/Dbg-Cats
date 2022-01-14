<template>
    <div
        class="navbar mb-2 shadow-lg bg-neutral text-neutral-content rounded-box absolute top-5 w-11/12 md:w-4/5"
    >
        <div class="flex-1 px-2 mx-2">
            <span class="text-lg font-bold">
                <a href="/">逗比国猫咪</a>
            </span>
        </div>
        <div class="flex-none">
            <button class="btn btn-ghost" v-if="!account" @click="connectWallet">连接钱包</button>
            <button class="btn btn-ghost text-red-300" v-else @click="disconnectWallet">断开连接</button>
        </div>
    </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
    setup() {
        const store = useStore()

        const account = computed(() => store.state.wallet.account)
        // const smartContract = computed(() => store.state.wallet.smartContract)

        // const getData = (account, smartContract) => {
        //     if (account !== "" && smartContract !== null) {
        //         store.dispatch('data/fetchData')
        //     }
        // }

        return {
            account,
            // smartContract,
            connectWallet: async () => {
                await store.dispatch('wallet/connect')

                // if (!store.state.wallet.errorMsg) {
                //     getData(account.value, smartContract.value)
                // }
            },
            disconnectWallet: async () => {
                await store.dispatch('wallet/disconnect')
            }
        }
    }
}
</script>