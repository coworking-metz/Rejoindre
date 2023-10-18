<template>
    <Base fond="/images/visite.jpg">
    <template #breadcrumbs>
        <li>Visite</li>
    </template>

    <hgroup>
        <h1>Votre visite</h1>
        <h2>Choisissez une date dans le liste ci-dessous pour effectuer votre visite du coworking. Un membre de l'assocation vous acceuillera et vous présentera le lieu et son fonctionnement.
        </h2>
    </hgroup>
    <small>Les visites ont lieu uniquement les <b>mardi</b> à <b>10h</b>.</small>
    <div class="days">
        <template v-for="day in data.days">
            <button class="day" @click="choisir(day)">
                <span class="nom">{{ day.nom }}</span>
                <span class="jour">{{ day.jour }}</span>
                <span class="mois">{{ day.mois }}</span>
            </button>
        </template>
    </div>
    <!-- <label>Date
            <input type="datetime-local" ref="dateInput" v-model="data.visite" @focus="choisir" @click="choisir">
            <small>Les visites ont lieu uniquement les <b>lundi</b> et <b>mardi</b> à 10h.</small>
        </label> -->
    <form @submit.prevent="submitForm" v-if="data.visite">
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


const data = reactive({
    visite: null,
    days: []
})

watch(() => data.visite, (newDate, oldDate) => {
    if (newDate) {
        const dateObj = new Date(newDate);
        dateObj.setHours(10, 0, 0, 0);
        if (dateObj <= new Date()) {
            // dateInput.value.setCustomValidity("La date doit être dans le futur.");
            data.visite = oldDate; // revert to old value
            return;
        }
        const dayOfWeek = dateObj.getDay();
        if (dayOfWeek !== 1 && dayOfWeek !== 2) {
            // dateInput.value.setCustomValidity("Les visites ont lieu les lundi et mardi à 10h.");
            data.visite = oldDate; // revert to old value
            return;
        }
    }
});


onMounted(() => {
    // data.visite = getNextDate();
    data.days = getNextTuesdays();
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

function choisir(day) {
    data.visite = day.date
}
function submitForm() {
    rejoindreStore.visite = data.visite;
    router.push('/infos')
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
function getNextTuesdays(nb = 12) {
    const tuesdays = [];
    let currentDate = new Date();
    currentDate.setHours(10);
    currentDate.setMinutes(0);
    const frenchMonths = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    // Création de l'objet Intl.DateTimeFormat pour obtenir le nom du jour en français
    const dateFormatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' });

    while (tuesdays.length < nb) {
        currentDate.setDate(currentDate.getDate() + 1);

        if (currentDate.getDay() === 2) {
            tuesdays.push({
                date: new Date(currentDate),
                jour: currentDate.getDate(),
                mois: frenchMonths[currentDate.getMonth()],
                nom: dateFormatter.format(currentDate) // Ajout du nom du jour
            });
        }
    }

    return tuesdays;
}

</script>

<style lang="scss" scoped>
.days {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: .5rem;
    padding: 1rem 0;

    .day {
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        font-size: .6rem;

        .jour {
            font-size: 1rem;
        }

        .mois {}
    }
}
</style>