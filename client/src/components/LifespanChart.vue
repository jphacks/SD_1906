<script>
    import { Bar } from 'vue-chartjs';

    var hitoketa_data = [];
    var x_axis = [];
    for (var i = 120; i >= 0; i--){
        x_axis.push(i);
        hitoketa_data.push(i);
    }

    export default {
        extends: Bar,
        name: 'lifespan-chart',
        data () {
            return {
                data: {
                    labels: x_axis,
                    datasets: [
                        {
                            fillColor: 'rgba(0, 0, 255, 0.5)',
                            label: '獲得寿命',
                            data: hitoketa_data,
                            // backgroundColor: x_axis.map(function(num){
                            //     var r = 2.55 * (100 - num);
                            //     var g = 2.55 * num;
                            //     return 'rgba(' + r.toString() + ', ' + g.toString() + ', 0)';
                            // }),
                            backgroundColor: 'rgba(94, 255, 45, 0.5)',
                            fill: true,
                            type: 'line',
                            lineTension: 0.1,

                        }
                    ]
                },
                options: {
                    scales: {
                        xAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: '分前',
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                // beginAtZero: Ture,
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
