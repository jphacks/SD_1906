<template>
    <div>
        Daily
        <bar-chart :chart-data="datacollection" :options="options"></bar-chart>
    </div>
</template>

<script>
    import BarChart from "@/components/BarChart.vue";

    // variables initialization
    var time_span = [];
    for (let i = 0; i <= 1440; ++i){
        // time_span.push(i);
        if (i % 60 != 0) {
            time_span.push('');
        }else{ 
            time_span.push(i/60);
        }
    }

    // test visualization
    var hitoketa_data = [];
    for (let j = 0; j <= 120; ++j){
        hitoketa_data.push(50 *(Math.tanh(-j*2/15 + 6) + 0.5) + 10 - j/50);
    }

    var update_counta = 0;

    function num2color(num) {
        if(100 >= num && num > 95){
            return "#198C00"
        }
        else if(95 >= num && num > 90){
            return "#339900"
        }
        else if(90 >= num && num > 85){
            return "#4CA600"
        }
        else if(85 >= num && num > 80){
            return "#66B200"
        }
        else if(80 >= num && num > 75){
            return "#7FBF00"
        }
        else if(75 >= num && num > 70){
            return "#99CC00"
        }
        else if(70 >= num && num > 65){
            return "#B2D800"
        }
        else if(65 >= num && num > 60){
            return "#CCE500"
        }
        else if(60 >= num && num > 55){
            return "#E5F200"
        }
        else if(55 >= num && num > 50){
            return "#FFFF00"
        }
        else if(50 >= num && num > 45){
            return "#FFE500"
        }
        else if(45 >= num && num > 40){
            return "#FFCC00"
        }
        else if(40 >= num && num > 35){
            return "#FFB200"
        }
        else if(35 >= num && num > 30){
            return "#FF9900"
        }
        else if(30 >= num && num > 25){
            return "#FF7F00"
        }
        else if(25 >= num && num > 20){
            return "#FF6600"
        }
        else if(20 >= num && num > 15){
            return "#FF4C00"
        }
        else if(15 >= num && num > 10){
            return "#FF3300"
        }
        else if(10 >= num && num > 5){
            return "#FF1900"
        }
        else if(5 >= num){
            return "#FF0000"
        }
    }

    export default {
        components: {
            BarChart
        },
        data () {
            return {
                datacollection: null,
                options: null
                //         {
                //     scales: {
                //         xAxes: [{
                //             type: "linear",
                //             ticks: {
                //                 callback: function(value) {return ((value % 3600) == 0)? value : '' }
                //             }
                //         }] 
                //     }
                // }
            }
        },
        mounted () {
            this.fillData();
            // interval 60sec -> acutual use
            // interval 0.01sec -> demo
            setInterval(this.updateData, 1)
        },
        methods: {
            fillData() {
                this.datacollection = {
                    labels: time_span,
                    datasets: [{
                        label: '',
                        data: hitoketa_data,
                        backgroundColor: hitoketa_data.map(num2color),
                    }]
                };
                this.options = {
                    legend: {
                        display: false,
                    }
                }
            },
            updateData(){
                
                // if (signal == False) {
                //     update_counta = 0;
                //     hitoketa_data.push(0);
                // }else{
                    update_counta += 1;
                    // you can define f(t) 
                    // t = Interval
                       hitoketa_data.push(50 * (Math.tanh(-update_counta*2/15 + 6) + 0.5) + 10 - update_counta/50);
                    // hitoketa_data = hitoketa_data.slice(1, 101);
                // }
                this.fillData();
            }
        },
    }
</script>
