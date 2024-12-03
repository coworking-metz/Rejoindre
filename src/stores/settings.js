import { defineStore } from "pinia";

export const useSettingsStore = defineStore("settings", {
  persist: true,
  state: () => ({
    settings: {},
  }),
  getters: {
    ready: (state) => Object.keys(state.settings).length > 0,
    mention: (state) => (w, key) => state.settings.mentions?.[w]?.[key] ?? (w+'.'+key),
    get: (state) => (key) => state.settings[key],
  },
  actions: {
    set(settings) {
      this.settings = Object.assign({}, settings);
    },
  },
});
