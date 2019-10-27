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
    var chart_data = [];
    // for (let j = 0; j <= 120; ++j){
    //     chart_data.push(50 *(Math.tanh(-j*2/15 + 6) + 0.5) + 10 - j/50);
    // }

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
            }
        },
        mounted () {
            this.fillData();
            // interval 60sec -> actual use
            // interval 0.01sec -> demo
            setInterval(this.updateData, 1000 * 5);
        },
        methods: {
            fillData() {
                this.datacollection = {
                    labels: time_span,
                    datasets: [{
                        label: '',
                        data: chart_data,
                        backgroundColor: chart_data.map(num2color),
                    }]
                };
                this.options = {
                    legend: {
                        display: false,
                    }
                }
            },
            updateData(){
                var url = 'https://us-central1-jphacks2019-lifeleaf.cloudfunctions.net/getIsSitting';
                fetch(url, {
                    mode: 'cors',
                    method: 'GET',
                    headers: new Headers({
                        'content-type': 'application/json',
                    })
                }).then(function (response) {
                    return response.json();
                }).then(function (data) {
                    if (data.isSitting) {
                        update_counta += 1;
                        chart_data.push(50 * (Math.tanh(-update_counta*2/15 + 6) + 0.5) + 10 - update_counta/50);
                    }
                    else {
                        update_counta = 0;
                        chart_data.push(0);
                    }
                    console.log(data.isSitting);
                }).catch(function (error) {
                    console.error(error);
                });

                this.fillData();
            },
        },
    }
</script>
