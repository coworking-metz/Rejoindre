<template>
    <Base fond="/images/salle-collab.jpg">
    <template #breadcrumbs>
        <li><router-link to="/visite">Visite</router-link></li>
        <li><router-link to="/infos">Informations</router-link></li>
        <!-- <li><router-link to="/mot-de-passe">Création de compte</router-link></li> -->
        <li>Récapitulatif</li>
    </template>

    <section clas="loading" v-if="data.loading">
        <hgroup>
            <h1>Enregistrement de votre demande...</h1>
        </hgroup>
        <button class="contrast" aria-busy="true">Veuillez patienter…</button>
    </section>
    <template v-else>
        <hgroup>
            <h1>{{ settings.mention('recap', 'titre') }}</h1>
            <h2 v-html="settings.mention('recap', 'texte').replaceAll('{date_visite}', dateVisite)"
                class="pre">
            </h2>
        </hgroup>
        <strong>
            <h3>Préparer votre visite</h3>
            <button @click="calendrier">Ajouter le rendez-vous à votre calendrier</button>
            <!-- todo app -->

        </strong>
    </template>
    </Base>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings'
import { useRejoindreStore } from '@/stores/rejoindre'
import { reactive, onMounted, watch, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { generateICS } from '@/mixins/utils';
import { useApi } from '@/mixins/api';
const settings = useSettingsStore()

const data = reactive({
    loading: true
})
const api = useApi();

function calendrier() {
    generateICS('Visite du Coworking Metz', 'visite-coworking-metz', rejoindreStore.visite);
}

onMounted(() => {
    data.loading = true;
    let payload = {
        visite: rejoindreStore.visite,
        user: rejoindreStore.user,
    }

    BrevoConversations('updateIntegrationData', {
        email: payload.user.email,
        firstName: payload.user.prenom,
        lastName: payload.user.nom,
        visite: payload.visite
    });

    api.get('nouvelle-visite', { payload: JSON.stringify(payload) }).then(response => {
        console.log(response);
        data.loading = false;
        // rejoindreStore.visite=null;
        // rejoindreStore.user={};
    })
});
const rejoindreStore = useRejoindreStore();
const router = useRouter();
const dateVisite = computed(() => {
    const d = new Date(rejoindreStore.visite);
    return d.toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });

})
</script>

<style lang="scss" scoped>
</style>
