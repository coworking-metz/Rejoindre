<template>
    <Base fond="/images/pouce.jpg" logo="false">
    <template #breadcrumbs>
        <li><router-link to="/">Informations</router-link></li>
        <li><router-link to="/visite">Rendez-vous</router-link></li>
        <li><router-link to="/mot-de-passe">Création de compte</router-link></li>
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
            <h1>Demande enregistrée !</h1>
            <h2>Votre rendez-vous du <strong>{{ dateVisite }}</strong> est validé. Vous allez recevoir un e-mail
                récapitulatif.<br>
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
import { useRejoindreStore } from '@/stores/rejoindre'
import { reactive, onMounted, watch, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { generateICS } from '@/mixins/utils';
import { useApi } from '@/mixins/api';

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
    api.post('nouvelle-visite', payload).then(response => {
        console.log(response);
        data.loading = false;
        rejoindreStore.visite=null;
        rejoindreStore.user={};
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

<style lang="scss" scoped></style>