<template>
    <div class="w-11/12 md:w-4/5 shadow stats absolute bottom-5">
        <div class="stat place-items-center place-content-center">
            <div class="stat-title">总数</div>
            <div class="stat-value">2000</div>
        </div>
        <div class="stat place-items-center place-content-center">
            <div class="stat-title">铸造价格</div>
            <div class="stat-value text-success">0</div>
        </div>
        <div class="stat place-items-center place-content-center">
            <div class="stat-title">网络</div>
            <div class="stat-value text-primary">
                <a
                    href="https://polygon.technology/"
                    target="blank"
                    ref="noopener"
                >{{ CONFIG.NETWORK.NAME }}</a>
            </div>
        </div>
    </div>
</template>

<script>
import CONFIG from '@/config/config.json'

export default {
    setup() {
        return {
            CONFIG
        }
    }
}
</script>