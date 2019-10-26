<template>
    <div>
        Daily
        <daily-chart></daily-chart>
    </div>
</template>

<script>
    import DailyChart from '@/components/DailyChart.vue';

    export default {
        name: 'daily',
        components: {
            DailyChart
        }
    }
</script>
