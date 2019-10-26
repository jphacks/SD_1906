<template>
    <div>
        Daily
        <daily-chart></daily-chart>
    </div>
</template>

<script>
    import Push from 'push.js';
    import DailyChart from '@/components/DailyChart.vue';

    export default {
        name: 'daily',
        components: {
            DailyChart
        },
        methods: {
            notify: function(){
                Push.create('枯れてまうーーーーー');
            }
        },
        created(){
            setTimeout(this.notify, 30 * 1000)
        }
    }
</script>
