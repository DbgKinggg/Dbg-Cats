<template>
  <div class="hero min-h-screen bg-gradient-to-br from-primary to-secondary">
    <AppHeader />
    <AppMain />
    <AppFooter />
  </div>
</template>

<script>
import AppHeader from '@/components/App/AppHeader.vue'
import AppMain from '@/components/App/AppMain.vue'
import AppFooter from '@/components/App/AppFooter.vue'

export default {
  components: {
    AppHeader,
    AppMain,
    AppFooter
  }
}

</script>

<style>
</style>
