<template>
    <Base>
    <template #breadcrumbs>
        <li><a href="/">Nous rejoindre</a></li>
        <li v-if="!nomade"><router-link to="/visite">Visite</router-link></li>
        <li>Informations</li>
    </template>

    <hgroup>
        <h1>{{ settings.mention('infos', 'titre') }}</h1>
        <h2 v-html="settings.mention('infos', 'texte')" class="pre"></h2>
    </hgroup>
    <form @submit.prevent="submitForm">
        <label v-if="nomade">
            A quelle date souhaitez-vous venir ?
            <input type="date" ref="datePresence" v-model="data.user.datePresence" placeholder="Jour ouvré"
                aria-label="Date de présence" required :aria-invalid="data.datePresenceInvalide" />
            <small v-if="data.datePresenceInvalideMessage" style="color:var(--del-color)">{{
                data.datePresenceInvalideMessage
            }}</small>
        </label>
        <label>
            Adresse e-mail
            <input type="email" ref="email" v-model="data.user.email" placeholder="E-mail" aria-label="Mail"
                autocomplete="email" required :aria-invalid="data.emailInvalide" />
            <small v-if="data.emailInvalideMessage" style="color:var(--del-color)">{{
                data.emailInvalideMessage
            }}</small>
        </label>
        <label>
            Nom
            <input type="text" v-model="data.user.nom" placeholder="Nom de famille" aria-label="Nom" autocomplete="name"
                required />
        </label>
        <label>
            Prénom
            <input type="text" v-model="data.user.prenom" placeholder="Prénom(s)" aria-label="Prénom"
                autocomplete="name" required />
        </label>
        <label>
            Votre enreprise ou votre domaine d'activité
            <input type="text" v-model="data.user.activite" placeholder="Entreprise ou activité"
                aria-label="Activité" />
        </label>
        <fieldset>
            <label>
                <small>
                    <input ref="cgu" type="checkbox" _role="switch" required v-model="data.cgu" /> En cochant cette
                    case, je
                    confirme avoir lu <a href='https://www.coworking-metz.fr/reglement-interieur/' target='_blank'>le
                        règlement intérieur de l'espace</a>. J'accepte également de recevoir les e-mails envoyés par
                    l'association à propos de mon utilisation du coworking*.
                </small>
            </label>
        </fieldset>
        <button :aria-busy="data.loading" type="submit" class="contrast">Continuer</button>
    </form>
    <p style="font-size:.5rem">* : L'assocation Coworking Metz vous contactera par mail à l'écheance de vos abonnements ou adhésion, ains qu'une fois par trimestre dans le cadre d'un mail d'information à destination des adhérents. Nous ne vous enverrons jamais de spams ou de démarchages commerciaux, et ne procédons pas à des reventes de données personnelles.</p>
    </Base>

</template>

<script setup>
import { useSettingsStore } from '@/stores/settings'
import { useRejoindreStore } from '@/stores/rejoindre'
import { reactive, watch, onMounted, ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

import { useApi } from '@/mixins/api';

const api = useApi();
const email = ref(null);
const cgu = ref(null);
const rejoindreStore = useRejoindreStore();
const settings = useSettingsStore()
const router = useRouter();
const route = useRoute();

const nomade = computed(() => data.user.nomade || route.query.nomade === 'true');

const data = reactive({
    user: {
        nom: import.meta.env.VITE_TEST_NOM,
        prenom: import.meta.env.VITE_TEST_PRENOM,
        email: import.meta.env.VITE_TEST_EMAIL,
        activite: '',
        datePresence: null
    },
    loading: false,
    emailInvalide: null,
    datePresenceInvalide: null,
    emailInvalideMessage: '',
    cgu: false
})
watch(() => data.user.email, (n, o) => {
    // checkUserExists()
});
onMounted(() => {
    setToWorkday();
    // cgu.value.setCustomValidity(`Vous devez lire et accepter les conditions d'accès pour continuer.`);

    // checkUserExists();
})

// Watch for changes in datePresence and validate
watch(() => data.user.datePresence, (newDate) => {
    if (!isWorkday(newDate)) {
        data.datePresenceInvalide = true;
        data.datePresenceInvalideMessage = 'Veuillez sélectionner un jour de semaine.';
    } else {
        data.datePresenceInvalide = false;
        data.datePresenceInvalideMessage = '';
    }
});

/**
 * Check if a date is a workday (Monday to Friday).
 * @param {string} dateStr - The date in YYYY-MM-DD format.
 * @returns {boolean} True if the date is a workday, false otherwise.
 */
function isWorkday(dateStr) {
    const date = new Date(dateStr);
    const day = date.getDay();
    return day !== 0 && day !== 6; // Exclude Sunday (0) and Saturday (6)
}

/**
 * Set datePresence to the next workday if it is not a workday.
 * @param {string} dateStr - The date in YYYY-MM-DD format.
 */
function setToWorkday() {
    let date = new Date();
    while (!isWorkday(date.toISOString().split('T')[0])) {
        date.setDate(date.getDate() + 1); // Move to the next day
    }
    data.user.datePresence = date.toISOString().split('T')[0];
}

let sti;
function checkUserExists() {
    data.emailInvalideMessage = ''
    data.emailInvalide = null;
    clearTimeout(sti);
    sti = setTimeout(() => {
        if (!email.value) return;
        if (data.user.email) {
            data.loading = true;
            api.get('user-exists', { email: data.user.email }).then(response => {
                if (!email.value) return;
                if (response.exists) {
                    data.emailInvalide = true;
                    data.emailInvalideMessage = 'Cette adresse est déjà utiliséé par un de nos adhérents.'
                } else {
                    data.emailInvalide = false;
                }
            }).finally(() => {
                data.loading = false;
            })
        }
    }, 500);
}
function submitForm() {
    data.loading = true;
    // cgu.value.setCustomValidity(`Vous devez lire et accepter les conditions d'accès pour continuer.`);
    // if (!data.cgu) {
    //     cgu.value.reportValidity();

    //     return;
    // }
    if (nomade.value === true) {
        data.user.nomade = true
    }
    rejoindreStore.user = Object.assign({}, data.user);
    // if (nomade.value == true) {
    //     router.push('/mot-de-passe')
    // } else {
        router.push('/recap')
    // }
}
</script>

<style lang="scss" scoped></style>
