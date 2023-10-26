<template>
    <Base>
    <template #breadcrumbs>
        <li><router-link to="/visite">Visite</router-link></li>
        <li>Informations</li>
    </template>

    <hgroup>
        <h1>Qui êtes-vous ?</h1>
        <h2>Entrez les informations utiles pour votre visite</h2>
    </hgroup>
    <form @submit.prevent="submitForm">
        <label>
            Adresse e-mail
            <input type="email" ref="email" v-model="data.user.email" placeholder="E-mail"
                aria-label="Mail" autocomplete="email" required :aria-invalid="data.emailInvalide" />
            <small v-if="data.emailInvalideMessage" style="color:var(--del-color)">{{
                data.emailInvalideMessage
            }}</small>
        </label>
        <label>
            Nom
            <input type="text" v-model="data.user.nom" placeholder="Nom de famille" aria-label="Nom"
                autocomplete="name" required />
        </label>
        <label>
            Prénom
            <input type="text" v-model="data.user.prenom" placeholder="Prénom(s)" aria-label="Prénom"
                autocomplete="name" required />
        </label>
        <fieldset>
            <label>
                <input ref="cgu" type="checkbox" _role="switch" required v-model="data.cgu" />
                J'ai lu et compris <a href="https://www.coworking-metz.fr/nous-rejoindre/"
                    target="_blank">les
                    conditions d'accès et d'utilisation de notre espace de Coworking</a>
            </label>
        </fieldset>
        <button :aria-busy="data.loading" type="submit" class="contrast">Continuer</button>
    </form>
    </Base>
</template>

<script setup>
import { useRejoindreStore } from '@/stores/rejoindre'
import { reactive, watch, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { useApi } from '@/mixins/api';

const api = useApi();
const email = ref(null);
const cgu = ref(null);
const rejoindreStore = useRejoindreStore();
const router = useRouter();

const data = reactive({
    user: {
        nom: import.meta.env.VITE_TEST_NOM,
        prenom: import.meta.env.VITE_TEST_PRENOM,
        email: import.meta.env.VITE_TEST_EMAIL
    },
    loading: false,
    emailInvalide: null,
    emailInvalideMessage: '',
    cgu: false
})
watch(() => data.user.email, (n, o) => {
    // checkUserExists()
});
onMounted(() => {
    // cgu.value.setCustomValidity(`Vous devez lire et accepter les conditions d'accès pour continuer.`);

    // checkUserExists();
})
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
    // cgu.value.setCustomValidity(`Vous devez lire et accepter les conditions d'accès pour continuer.`);
    // if (!data.cgu) {
    //     cgu.value.reportValidity();

    //     return;
    // }
    rejoindreStore.user = Object.assign({}, data.user);


    // router.push('/mot-de-passe')
    router.push('/recap')
}
</script>

<style lang="scss" scoped>
</style>
