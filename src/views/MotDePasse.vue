<template>
    <Base>
    <template #breadcrumbs>
        <li><router-link to="/visite">Visite</router-link></li>
        <li><router-link to="/infos">Informations</router-link></li>
        <li>Création de compte</li>
    </template>

    <hgroup>
        <h1>Votre compte</h1>
        <h2>Pour suivre votre inscription, vous devez finaliser la création de votre compte.</h2>
    </hgroup>
    <form @submit.prevent="submitForm">
        <label>
            Mot de passe
            <input type="password" v-model="data.password" minlength="5" placeholder="Mot de passe" aria-label="Password"
                required />
        </label>
        <label>
            Vérification du mot de passe
            <input ref="verification" type="password" minlength="5" v-model="data.verification"
                placeholder="Le même mot de passe" aria-label="Password verification" required />
        </label>
        <button type="submit" class="contrast">Continuer</button>
    </form>
    </Base>
</template>

<script setup>
import { useRejoindreStore } from '@/stores/rejoindre'
import { reactive, watch, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';


// Utiliser l'API
const rejoindreStore = useRejoindreStore();
const router = useRouter();
const verification = ref(null);
const data = reactive({
    password: '',
    verification: ''
})


function submitForm() {


    if (data.password != data.verification) {
        verification.value.setCustomValidity(`les deux mots de passe ne correspondent pas.`);
        verification.value.reportValidity();
        return;
    }
    rejoindreStore.user.password = data.password;


    router.push('/recap')
}
</script>

<style lang="scss" scoped></style>