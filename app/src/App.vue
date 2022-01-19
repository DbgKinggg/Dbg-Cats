<template>
  <div
    class="hero min-h-screen bg-gradient-to-br from-primary to-secondary relative overflow-hidden"
  >
    <AppHeader />
    <AppMain />
    <AppFooter />
    <AppBackground />
  </div>
</template>

<script>
import AppHeader from '@/components/App/AppHeader.vue'
import AppMain from '@/components/App/AppMain.vue'
import AppFooter from '@/components/App/AppFooter.vue'
import AppBackground from "@/components/App/AppBackground.vue"

export default {
  components: {
    AppHeader,
    AppMain,
    AppFooter,
    AppBackground
  }
}

</script>