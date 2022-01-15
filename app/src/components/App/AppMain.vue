<template>
    <div class="text-center hero-content">
        <div class="max-w-md">
            <h1
                class="mb-5 inline-block text-6xl font-bold tracking-widest transform transition-all cursor-pointer hover:-translate-y-1 text-neutral"
            >
                逗比国
                <span class="text-primary -ml-6">猫咪</span>
            </h1>
            <p class="mb-5">一个船新的开源免费随机生成NFT系列</p>
            <div
                class="stat-value text-4xl text-black mb-3 transform transition-all cursor-pointer hover:-translate-y-1"
            >
                已铸造：
                <span v-if="!totalSupply">-</span>
                <template v-if="totalSupply">{{ totalSupply }}</template>
                /&nbsp;{{ CONFIG.MAX_SUPPLY }}
            </div>
            <button class="shadow-2xl lg:btn-lg btn btn-md btn-primary">铸造</button>
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

export default {
    setup() {
        const store = useStore()

        return {
            errorMsg: computed(() => store.state.wallet.errorMsg),
            totalSupply: computed(() => store.state.contract.totalSupply),
            CONFIG,
        }
    },
    components: {
        AppSocialMedia
    }
}
</script>