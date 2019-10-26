<script>
    import { Bar } from 'vue-chartjs';

    var hitoketa_data = [];
    for (var i = 100; i >= 0; i--){
        hitoketa_data.push(i);
    }

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
        else if(5 >= num && num >= 0){
            return "#FF0000"
        }
    }

    export default {
        extends: Bar,
        name: 'daily-chart',
        data () {
            return {
                data: {
                    labels: hitoketa_data,
                    datasets: [
                        {
                            data: hitoketa_data,
                            backgroundColor: hitoketa_data.map(num2color),
                        },
                    ]
                },
                options: {
                    scales: {
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                stepSize: 10,
                            }
                        }]
                    },
                    animation: {
                        duration: 500,
                        easing: 'easeOutQuart'
                    }
                }
            }
        },
        mounted () {
            this.renderChart(this.data, this.options)
        },
    }
</script>
