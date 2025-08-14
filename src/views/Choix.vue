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
        <strong>Vous voulez faire de notre Coworking votre lieu de travail régulier ?</strong><br>
        <small>
            Commencez par réserver votre <strong>journée d’essai gratuite et sans engagement</strong>.
            Après cette visite, vous pourrez adhérer à notre association souscrire un abonnement.
        </small><br><br>
        <center>
            <router-link to="/rendez-vous" role="button" class="button primary">🏢 Prendre rendez-vous pour une journée
                d’essai</router-link>
        </center>

        <br/>
        <br/>

        <strong>Vous êtes simplement de passage&nbsp;?</strong><br>
        <small>
            Optez pour une <strong>journée de coworking “nomade”</strong>, sans adhésion et sans engagement, en bénéficiant de tous les services proposés par notre espace<sup>*</sup>.
            Idéal pour travailler une ou deux journées lors d’un séjour à Metz.
        </small><br><br>
        <center>
            <router-link to="/infos?nomade=true" role="button" class="button secondary">⏲️ Réserver une journée
                “nomade”</router-link>
        </center>
    </section>
        <small>
            <sup>*</sup> : Grands bureaux fonctionnels, espace climatisé, internet fibre, imprimante et machine à café / thé. Tout ces services sont inclus sans surcoût.<br/><br/>

        <small>Votre fréquentation de notre espace de coworking implique de <a
                href="https://www.coworking-metz.fr/nous-rejoindre/">respecter notre règlement intérieur</a>. En
            cas de
            question, <a @click="brevoOpen">contactez-nous via notre module de discussion</a></small></small>

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
