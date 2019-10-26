<template>
    <div>
        Daily
        <lifespan-chart></lifespan-chart>
    </div>
</template>

<script>
    import LifespanChart from '@/components/LifespanChart.vue';

    export default {
        name: 'lifespan',
        components: {
            LifespanChart
        }
    }
</script>
