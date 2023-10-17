import { defineStore } from "pinia";

export const useRejoindreStore = defineStore("rejoindre", {
  persist: true,
  state: () => ({
    visite: null,
    user: {
      nom: null,
      prenom: null,
      email: null,
      password: null,
    },
  }),
  actions: {},
});
