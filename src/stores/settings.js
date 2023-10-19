import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  persist: true,
  state: () => ({
    settings: {},
  }),
  getters: {
    ready: (state) => Object.keys(state.settings).length > 0,
    get: (state) => (key) => state.settings[key],
  },
  actions: {
    set(settings) {
      this.settings = Object.assign({}, settings);
    },
  },
});
