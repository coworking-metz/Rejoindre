<template>
    <Base fond="/images/visite.jpg">
    <template #breadcrumbs>
        <li>Visite</li>
    </template>
    <template v-if="settings.get('visites').fermer_visites">
        <hgroup>
            <h1>{{ settings.mention('visite', 'titre_closed') }}</h1>
            <h2 v-html="settings.mention('visite', 'texte_closed')" class="pre">
            </h2>
        </hgroup>

    </template>
    <template v-else>

        <hgroup>
            <h1>{{ settings.mention('visite', 'titre') }}</h1>
            <h2 v-html="settings.mention('visite', 'texte')" class="pre">
            </h2>
        </hgroup>
        <small>Les visites ont lieu uniquement les <b>{{ jours_de_visites }}</b> à
            <b>{{ visites.horaire }}</b><template v-if="visites.fermer_vacances"> en dehors des vacances
                scolaires</template>.</small>
        <div class="days">
            <template v-for="day in data.days">
                <button class="day" :class="{ 'selected': day.date == data.selected }"
                    :disabled="day.visites >= data.max">
                    <input type="radio" :value="day.date" v-model="data.selected">
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
        <form @submit.prevent="submitForm" v-if="recap">
            <!-- <p>
            <center>Vous avez choisi le <kbd>{{ recap }}</kbd></center>
        </p> -->
            <button type="submit" class="contrast">Valider le {{ recap }}</button>
        </form>
    </template>

    </Base>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings'
import { useRejoindreStore } from '@/stores/rejoindre'
import { reactive, onMounted, watch, computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { joinFrench } from '@/mixins/utils';

const rejoindreStore = useRejoindreStore();
const settings = useSettingsStore()
const router = useRouter();

const visites = settings.get('visites');
const data = reactive({
    days: [],
    selected: null,
    max: 4
})

const jours_de_visites = computed(() => {
    const jours = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const ret = [];
    for (const jour of visites.jours_de_visites) {
        ret.push(jours[jour]);
    }
    return joinFrench(ret)
})


onMounted(() => {
    data.visite = rejoindreStore.visite;
    data.days = getNextDays(visites.jours_de_visites, visites.limite_mois, visites.empecher_visites);
})

const recap = computed(() => {
    if (!data.selected) return;
    let d = new Date(data.selected);
    let date = d.toLocaleDateString('fr-FR', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
    return date;
})


function submitForm() {
    rejoindreStore.visite = data.selected;
    router.push('/infos')
}

function getNextDays(days, monthsLimit = 12, exclude = []) {
    const result = [];
    let currentDate = new Date();
    const time = visites.horaire.split(':');
    currentDate.setHours(time[0]);
    currentDate.setMinutes(time[1]);
    currentDate.setSeconds(0);

    const frenchMonths = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

    const endMonth = (currentDate.getMonth() + monthsLimit) % 12;
    const endYear = currentDate.getFullYear() + Math.floor((currentDate.getMonth() + monthsLimit) / 12);

    // Création de l'objet Intl.DateTimeFormat pour obtenir le nom du jour en français
    const dateFormatter = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' });

    while (true) {
        currentDate.setDate(currentDate.getDate() + 1);

        const currentDateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

        if (!exclude.includes(currentDateString) && days.includes(currentDate.getDay())) {
            result.push({
                time: currentDate.getTime(),
                date: new Date(currentDate),
                jour: currentDate.getDate(),
                mois: frenchMonths[currentDate.getMonth()],
                nom: dateFormatter.format(currentDate), // Ajout du nom du jour,
                visites: visites.dates[currentDateString] || 0
            });
        }

        if (currentDate.getFullYear() > endYear || (currentDate.getFullYear() === endYear && currentDate.getMonth() >= endMonth)) {
            break;
        }
    }

    return result;
}



</script>

<style lang="scss">
.days {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: .5rem;
    padding: 1rem 0;
    justify-items: center;

    .day {
        position: relative;

        &[disabled] {
            color: #555;
            border-color: #333;
            background-image: linear-gradient(45deg, #fefefe 25%, #eeeeee 25%, #eeeeee 50%, #fefefe 50%, #fefefe 75%, #eeeeee 75%, #eeeeee 100%);
            background-size: 56.57px 56.57px;
            background-repeat: repeat;

            &:after {
                content: 'Complet';
                position: absolute;
                top: 50%;
                left: 50%;
                transform-origin: center;
                transform: translate(-50%, -50%) rotate(-45deg);
                background-color: #ff2f00;
                color: white;
                font-family: monospace;
                padding: .2rem .8rem;
            }
        }

        // &:not([data-visites="0"]):before {
        //     position: absolute;
        //     content: attr(data-visites);
        //     top: 0;
        //     right: 0;
        //     width: 1.1rem;
        //     height: 1.1rem;
        //     background-color: #ff2f00;
        //     border-radius: 50%;
        //     text-align: center;
        //     line-height: 1.1rem;
        //     transform: translate(25%, -25%);
        // }

        &.selected {
            background-color: black;
            color: white;
            border-color: #555;
        }

        position: relative;

        >input {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
        }

        padding: .5rem 0;
        margin: 0;
        font-size: .6rem;

        >* {
            display: block;
        }

        .jour {
            font-size: 1rem;
        }

        .mois {}
    }
}
</style>
