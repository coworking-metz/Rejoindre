<template>
    <Base fond="/images/coworker.jpg" v-if="data.ready">
    <template #breadcrumbs>
        <li>Nous rejoindre</li>
    </template>
    <hgroup>
        <h1>Nous rejoindre</h1>
        <h2>Quel type de coworking recherchez vous ?</h2>
    </hgroup>
    <section>
        <center>
            <router-link to="/rendez-vous" role="button" class="button primary">🏢 Coworking régulier</router-link>
            <p><small><i>Vous recherchez un endroit pour travailler de manière régulière toute au long de l'année
                        (abonnement ou carnets de tickets)</i></small></p>
        </center>

        <center>
            <router-link to="/infos?nomade=true" role="button" class="button secondary">⏲️ Coworking
                ponctuel</router-link>
            <p><small><i>Vous recherchez une solution de coworking<br>temporaire (à la journée, moins d'une
                        semaine)</i></small></p>
        </center>
    </section>
    <p>
        <small>Votre fréquentation de notre espace de coworking implique de <a
                href="https://www.coworking-metz.fr/reglement-interieur/">respecter notre règlement intérieur</a>. En cas de
            question, <a @click="brevoOpen">contactez-nous via notre module de discussion</a></small>
    </p>

    </Base>
</template>

<script setup>
import { brevoOpen } from '@/mixins/utils';
import { onMounted, reactive } from 'vue';
import { useSettingsStore } from '@/stores/settings'
import { useRouter } from 'vue-router';
const router = useRouter();
const settings = useSettingsStore()
const data = reactive({
    ready: false
})

onMounted(() => {
    if (!settings.get('acces-nomades')) 
        router.push('/rendez-vous'); 
    else 
        data.ready = true;
})
</script>

<style lang="scss"></style>
