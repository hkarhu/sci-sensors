<template>
 <UplotVue
    ref="uplot"
    :data=dataset
    :options=options />
</template>

<style>
.sensor_chart {
}
</style>

<script>

    import UplotVue from 'uplot-vue';
    import 'uplot/dist/uPlot.min.css';
    
    const axios = require('axios').default;
    
    //function getSize(){ return { width: this.$refs.uplot.$el.offsetWidth, height:100 }}
    
    export default {
    
        data () {
            return {
                dataset: [],
                options: {
                            class: "sensor-chart",
                            width: 640,
                            height: 280,
                            cursor: {
                                focus: { prox: 1 },
                                drag: { x: false, y: false }
                            },
                            scales: {
                                "T": {
                                    time: true,
                                    //range: (self, min, max) => [min, max],
                                    auto: true,
                                },
                                "C": { auto: true },
                                "%": { auto: true },
                                "kPa": { auto: true }
                            },
                            series: [
                                {
                                    label: "Time",
                                    scale: "T",
                                    value: (self, v) => v == null ? "-" : new Date(v*1e3),
                                    key: 'date'
                                },{
                                    show: true,
                                    spanGaps: true,
                                    label: "Temperature",
                                    scale: "C",
                                    value: (self, v) => v == null ? "-" : v.toFixed(1) + " C",
                                    stroke: "rgba(255, 0, 0, 1)",

                                },{
                                    show: true,
                                    spanGaps: true,
                                    label: "Humidity",
                                    scale: "rel%",
                                    value: (self, v) => v == null ? "-" : v.toFixed(1) + " rel%",
                                    stroke: "rgba(128, 255, 128, 1)",

                                },{
                                    show: true,
                                    spanGaps: true,
                                    label: "Pressure",
                                    scale: "kPa",
                                    value: (self, v) => v == null ? "-" : v.toFixed(1)/1000 + " kPa",
                                    stroke: "rgba(0, 255, 255, 1)",
                                },
                            ],
                            axes: [
                                { 
                                    scale: "T",
                                    grid: {show: true, stroke: "rgba(0, 0, 0, 0.25)", width: 1},
                                    space: 40,
                                    stroke: "rgba(255, 255, 255, 1)",
                                    font: "10px Monospace",
                                    ticks: {
                                        show: true,
                                        stroke: "#000",
                                        width: 3,
                                        dash: [],
                                        size: 4,
                                    },
                                    values: [
                                        [3600 * 24 * 365,    "{YYYY}",            7,   "{YYYY}"                 ],
                                        [3600 * 24 * 28,     "{MMM}",             7,   "{MMM}\n{YYYY}"          ],
                                        [3600 * 24,          "{D}.{M}",           7,   "{D}.{M}\n{YYYY}"        ],
                                        [3600,               "{HH}",              4,   "{HH}\n{D}.{M}"          ],
                                        [60,                 "{HH}:{mm}",         4,   "{HH}:{mm}\n{D}.{M}"     ],
                                        [1,                  "{HH}:{mm}:{ss}",    4,   "{HH}:{mm}:{ss}\n{D}.{M}"],
                                    ],
                                },{
                                    scale: "C",
                                    size: 42,
                                    values: (self, vals) => vals.map(v => +v.toFixed(1) + "°C"),
                                    stroke: "rgba(255, 0, 0, 0.5)",
                                    font: "10px Monospace",
                                    grid: {show: false, stroke: "rgba(0, 0, 0, 0.1)"},
                                },{                            
                                    scale: "rel%",
                                    side: 3,
                                    size: 42,
                                    values: (self, vals) => vals.map(v => +v.toFixed(1) + " %"),
                                    stroke: "rgba(128, 255, 128, 0.5)",
                                    font: "10px Monospace",
                                    grid: {show: false, stroke: "rgba(128, 255, 128, 0.1)"},
                                },{
                                    scale: "kPa",
                                    side: 1,
                                    size: 70,
                                    values: (self, vals) => vals.map(v => +v.toFixed(1)/1000 + " kPa"),
                                    stroke: "rgba(0, 255, 255, 0.5)",
                                    font: "10px Monospace",
                                    grid: {show: true, stroke: "rgba(0, 255, 255, 0.1)"},
                                },
                            ]
                }
            }
        },
        props: {
            hwid: String,
            range: Object
        },
        mounted() {
                
                /*
                function groupBy(objectArray, property) {
                    return objectArray.reduce(function (acc, obj) {
                        let key = obj[property]
                        if (!acc[key]) {
                        acc[key] = []
                    }
                    acc[key].push(obj)
                    return acc
                }, {})
                */
                
                const req_opts = {
                    method: "GET",
                    params: {"filter": {
                                "order": "timestamp DESC",
                                "where": {
                                    "timestamp": { "gt": this.range.start, "lt": this.range.end }
                                }
                            }},
                }
                
                axios.get(this.SENSOR_API_URL + "sensors/" + this.hwid + "/datasamples", req_opts)
                .then(response => {
                    let d = response.data.map(item => { return {
                                                            datatype: item.datatype,
                                                            timestamp: item.timestamp,
                                                            value: item.value }})
                    
                    //var a = groupBy(response.data, 'datatype');
                    
                    /*
                    let dt1 = response.data.filter(item => item.datatype == 1)
                    let dt2 = response.data.filter(item => item.datatype == 2)
                    let dt3 = response.data.filter(item => item.datatype == 3)
                    */
                    
                    //console.log(a)
                    
                    this.dataset = [
                         (d.map(el => new Date(el.timestamp).getTime()*1e-3)).reduce(function (accumulator, currentValue) {
                            if (accumulator.indexOf(currentValue) === -1) {
                                accumulator.push(currentValue)
                            }
                            return accumulator
                        }, []),
                        d.filter(item => item.datatype == 1).map(el => el.value),
                        d.filter(item => item.datatype == 2).map(el => el.value),
                        d.filter(item => item.datatype == 3).map(el => el.value)
                    ]
                
                    console.log(this.dataset)
                
                })
                .catch(function (error) {
                    console.log(error);
                })
                
                
        },
        methods: {
            refreshPlot(){
                console.log(this.$refs.uplot.$el.offsetWidth)
            }
        },
        components: {
            UplotVue
        },
    }
</script>
