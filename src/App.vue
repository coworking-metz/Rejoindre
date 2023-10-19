<template>
  <template v-if="settings.ready">

    <RouterView></RouterView>
  </template>
  <template v-else>
    <div class="loader">
      <h2>Chargement</h2>
      <progress></progress>
    </div>

  </template>
</template>

<script setup>

import { useSettingsStore } from '@/stores/settings'
import { reactive, watch, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useApi } from '@/mixins/api';
const settings = useSettingsStore()
const api = useApi();

onMounted(() => {
  api.get('app-settings').then(response => {
    settings.set(response)
  })
})
</script>


<style lang="scss" scoped>
.loader {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 80%;
  width: 400px;
  text-align: center;

  >* {
    margin: 0;
  }
}
</style>
