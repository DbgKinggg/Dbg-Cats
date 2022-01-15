<template>
    <div class="text-center hero-content">
        <div class="max-w-md">
            <h1
                class="mb-5 inline-block text-4xl md:text-6xl font-bold tracking-widest transform transition-all cursor-pointer hover:-translate-y-1 text-neutral"
            >
                逗比国
                <span class="text-primary text-5xl md:text-7xl md:-ml-5">猫咪</span>
            </h1>
            <p class="mb-5">一个船新的开源免费随机生成NFT系列</p>
            <div
                class="stat-value text-3xl md:text-4xl text-black mb-3 transform transition-all cursor-pointer hover:-translate-y-1"
                @click="fetchData"
            >
                已铸造：
                <span v-if="!totalSupply">-</span>
                <template v-if="totalSupply">{{ totalSupply }}</template>
                /&nbsp;{{ CONFIG.MAX_SUPPLY }}
            </div>
            <div>
                <div class="tooltip" data-tip="在Opensea查看你已铸造的NFT" v-if="minted">
                    <a
                        class="shadow-2xl lg:btn-lg btn btn-md glass"
                        :href="CONFIG.MARKETPLACE_LINK"
                        target="blank"
                        ref="noopener"
                    >查看NFT</a>
                </div>
                <button
                    type="button"
                    class="shadow-2xl lg:btn-lg btn btn-md btn-primary pointer-cursor loading"
                    v-else-if="minting"
                ></button>
                <button
                    class="shadow-2xl lg:btn-lg btn btn-md btn-primary"
                    @click="mintNFT"
                    v-else
                >铸造</button>
            </div>
            <AppSocialMedia />
            <div class="alert alert-error text-lg" v-if="errorMsg">{{ errorMsg }}</div>
        </div>
    </div>
</template>

<script>
import AppSocialMedia from "./AppSocialMedia.vue"
import { useStore } from 'vuex'
import { computed } from 'vue'
import CONFIG from '@/config/config.json'
import { useToast } from "vue-toastification"

export default {
    setup() {
        const store = useStore()
        const toast = useToast()

        const showErrorMessage = (message) => {
            toast.error(message)
        }

        const mintNFT = () => {
            const wallet = store.state.wallet
            if (!wallet.account || !wallet.smartContract || !wallet.web3) {
                showErrorMessage("请先连接钱包哟！")
                return false
            }

            store.dispatch('contract/mintNFT')
        };

        const fetchData = () => {
            if (store.state.wallet.smartContract) {
                store.dispatch('contract/fetchData')
            } else {
                showErrorMessage("请先连接钱包才能查看NFT数据")
            }
        }

        return {
            errorMsg: computed(() => store.state.wallet.errorMsg),
            totalSupply: computed(() => store.state.contract.totalSupply),
            minting: computed(() => store.state.contract.minting),
            minted: computed(() => store.state.contract.minted),
            CONFIG,
            mintNFT,
            fetchData
        }
    },
    components: {
        AppSocialMedia
    }
}
</script>