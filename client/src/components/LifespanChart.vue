<script>
    import { Bar } from 'vue-chartjs';

    var hitoketa_data = [];
    for (var i = 100; i >= 0; i--){
        x_axis.push(100 - i);
        hitoketa_data.push(Math.floor(Math.random() * 11));
    }

    export default {
        extends: Bar,
        name: 'lifespan-chart',
        data () {
            return {
                data: {
                    labels: hitoketa_data,
                    datasets: [
                        {
                            data: hitoketa_data,
                            backgroundColor: hitoketa_data.map(function(num){
                                var r = 2.55 * (100 - num);
                                var g = 2.55 * num;
                                return 'rgba(' + r.toString() + ', ' + g.toString() + ', 0)';
                            }),

                        }
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
                    }
                }
            }
        },
        mounted () {
            this.renderChart(this.data, this.options)
        },
    }
</script>
