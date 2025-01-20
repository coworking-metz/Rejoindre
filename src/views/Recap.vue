<template>
    <Base fond="/images/salle-collab.jpg">
    <template #breadcrumbs>
        <li><a href="/">Nous rejoindre</a></li>
        <li v-if="!nomade"><router-link to="/visite">Visite</router-link></li>
        <li><router-link to="/infos">Informations</router-link></li>
        <li>Récapitulatif</li>
    </template>

    <section clas="loading" v-if="data.loading">
        <hgroup>
            <h1>Enregistrement de votre demande...</h1>
        </hgroup>
        <button class="contrast" aria-busy="true">Veuillez patienter…</button>
    </section>
    <template v-else>
        <template v-if="!data.done">
            <hgroup>
                <h1>Merci d'avoir entré vos informations</h1>
            </hgroup>
            <button class="contrast" @click="finaliser">Finaliser la démarche</button>
        </template>

        <template v-else>
            <template v-if="nomade">
                <strong>
                    <h3>Votre compte a été enregistré</h3>
                    <p>Merci de procéder au paiement pour finaliser votre réservation du <strong>{{ datePresence
                            }}</strong>
                    </p>
                    <a :href="'https://www.coworking-metz.fr/boutique/ticket-journee-nomade/?al_id=' + data.user_id + '&startDate=' + rejoindreStore.user.datePresence"
                        role="button">🛒 Passez au paiement</a>

                </strong>

            </template>
            <template v-else>
                <hgroup>
                    <h1>{{ settings.mention('recap', 'titre') }}</h1>
                    <h2 v-html="settings.mention('recap', 'texte').replaceAll('{date_visite}', dateVisite)" class="pre">
                    </h2>
                </hgroup>
                <strong>
                    <h3>Préparer votre visite</h3>
                    <button @click="calendrier">Ajouter le rendez-vous à votre calendrier</button>
                    <!-- todo app -->

                </strong>
            </template>
        </template>
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
import { modeTestOn } from '../mixins/utils';
const settings = useSettingsStore()

const data = reactive({
    loading: false,
    done: false,
    user_id: false
})
const api = useApi();
const nomade = computed(() => !!rejoindreStore.user.nomade)

function calendrier() {
    generateICS('Visite du Coworking Metz', 'visite-coworking-metz', rejoindreStore.visite);
}
let payload;
onMounted(() => {
    payload = {
        visite: rejoindreStore.visite,
        user: rejoindreStore.user,
    }

    BrevoConversations('updateIntegrationData', {
        email: payload.user.email,
        firstName: payload.user.prenom,
        lastName: payload.user.nom,
        visite: payload.visite
    });
    if (modeTestOn()) {
        console.log(JSON.parse(JSON.stringify(payload)))
    } else {
        finaliser()
    }
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
const datePresence = computed(() => {
    const d = new Date(rejoindreStore.user.datePresence);
    return d.toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });

})
function finaliser() {
    data.loading = true;
    payload.modeTest = modeTestOn()
    api.get('nouvelle-visite', { payload: JSON.stringify(payload) }).then(response => {
        console.log(response);
        data.user_id = response.user_id;
        data.loading = false;
        data.done = true;
    })
}
</script>

<style lang="scss" scoped></style>
