<template>
    <Base fond="/images/visite.jpg" logo="false">
    <template #breadcrumbs>
        <li><router-link to="/">Informations</router-link></li>
        <li>Rendez-vous</li>
    </template>

    <hgroup>
        <h1>Votre visite</h1>
        <h2>Avant de pouvoir utiliser l'espace, vous devez réaliser une visite.</h2>
    </hgroup>
    <form @submit.prevent="submitForm">
        <label>Date
            <input type="datetime-local" ref="dateInput" v-model="data.visite" @focus="choisir" @click="choisir">
            <small>Les visites ont lieu uniquement les <b>lundi</b> et <b>mardi</b> à 10h.</small>
        </label>

        <p>
            <center>Vous avez choisi le <kbd>{{ recap }}</kbd></center>
        </p>
        <button type="submit" class="contrast">Valider cette date</button>
    </form>
    </Base>
</template>

<script setup>
import { useRejoindreStore } from '@/stores/rejoindre'
import { reactive, onMounted, watch, computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const rejoindreStore = useRejoindreStore();
const router = useRouter();
const dateInput = ref(null);


const data = reactive({
    visite: null,
})

watch(() => data.visite, (newDate, oldDate) => {
    dateInput.value.setCustomValidity('');
    if (newDate) {
        const dateObj = new Date(newDate);
        dateObj.setHours(10, 0, 0, 0);
        if (dateObj <= new Date()) {
            dateInput.value.setCustomValidity("La date doit être dans le futur.");
            dateInput.value.reportValidity();
            data.visite = oldDate; // revert to old value
            return;
        }
        const dayOfWeek = dateObj.getDay();
        if (dayOfWeek !== 1 && dayOfWeek !== 2) {
            dateInput.value.setCustomValidity("Les visites ont lieu les lundi et mardi à 10h.");
            dateInput.value.reportValidity();
            data.visite = oldDate; // revert to old value
            return;
        }
    }
});


onMounted(() => {
    data.visite = getNextDate();
})

const recap = computed(() => {
    if (!data.visite) return 'Choisir une date'
    let d = new Date(data.visite);
    let date = d.toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    return date;
})
function choisir() {
    setTimeout(() => {
        dateInput.value.showPicker()
    }, 50);

}
function submitForm() {
    rejoindreStore.visite = data.visite;
    router.push('/mot-de-passe')
}

function getNextDate() {
    const today = new Date();

    // Régler la timezone sur Europe/Paris
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset() - 60);

    // Trouver le prochain lundi ou mardi
    let nextDay = today.getDay() === 0 ? 1 : today.getDay() === 1 ? 2 : 8 - today.getDay() + 1;
    let nextDate = new Date(today);
    nextDate.setDate(today.getDate() + nextDay);
    nextDate.setHours(10, 0, 0, 0);

    // Formater la date en format datetime-local
    let year = nextDate.getFullYear();
    let month = (nextDate.getMonth() + 1).toString().padStart(2, '0');
    let day = nextDate.getDate().toString().padStart(2, '0');
    let hours = nextDate.getHours().toString().padStart(2, '0');
    let minutes = nextDate.getMinutes().toString().padStart(2, '0');

    let formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
    console.log(formattedDate)
    return formattedDate;
}
</script>

<style lang="scss" scoped></style>