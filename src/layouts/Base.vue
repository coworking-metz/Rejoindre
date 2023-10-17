<template>
    <!-- Main -->
    <main class="container">
        <small>
            <nav aria-label="breadcrumb">
                <ul>
                    <li><a href="https://www.coworking-metz.fr/"><img src="/favicon.ico"></a></li>
                    <!-- <li><a href="https://www.coworking-metz.fr/nous-rejoindre/">Nous rejoindre</a></li> -->
                    <slot name="breadcrumbs"></slot>
                </ul>
            </nav>
        </small>
        <article class="grid">
            <div>
                <slot></slot>
            </div>
            <div>
                <span v-if="props.fond" class="fond duotone">
                    <img :src="props.fond">
                </span>
                <img v-if="props.logo && props.logo != 'false'" class="logo" :src="props.logo">
            </div>
        </article>
    </main>
    <!-- ./ Main -->
    <SiteFooter />
</template>

<script setup>
import SiteFooter from "@/components/SiteFooter.vue";


const props = defineProps({
    fond: {
        type: String,
        default: '/images/cowo.jpg'
    }, logo: {
        type: String,
        default: '/images/logo.png'
    }
});

</script>

<style lang="scss" scoped></style>