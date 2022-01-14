<template>
    <div class="text-center hero-content">
        <div class="max-w-md">
            <h1 class="mb-5 text-6xl font-bold tracking-widest">逗比国猫咪</h1>
            <p class="mb-5">一个船新的免费随机生成NFT系列</p>
            <button class="shadow-2xl lg:btn-lg btn btn-md btn-primary">铸造</button>
            <AppSocialMedia />
        </div>
    </div>
</template>

<script>
import AppSocialMedia from "./AppSocialMedia.vue"

export default {
    components: {
        AppSocialMedia
    }
}
</script>