<template>
    <footer class="container-fluid">
        <small>Une question ? Contactez l'association via <a @click="brevoOpen">notre module de discussion</a>.</small>
        <br>
        <small>
            <a href="https://www.coworking-metz.fr/faq/">FAQ</a>
            • <a href="https://www.coworking-metz.fr/reglement-interieur/">Règlement intérieur</a>
            • <a href="https://www.coworking-metz.fr/">Notre site</a>
            • <span @click="modeTestToggle">🐔</span>

        </small>

    </footer>
</template>

<script setup>
import { brevoOpen, modeTestToggle, modeTestOn } from '@/mixins/utils';

</script>

<style lang="scss" scoped>
footer {
    max-width: 600px;
    font-size: smaller;
    text-align: center;
    margin-bottom: 15vh;
}
</style>