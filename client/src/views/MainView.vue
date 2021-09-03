<template>
    <div class="data_container">
        <ModelCanvas ref="model_canvas"/>        
    </div>

    <div class="rightbar">
        <div class="datepicker_container">
            <DatePicker v-model="range" mode="dateTime" is-dark is-range show-weeknumbers @dayclick="onDateRangeChanged" :minute-increment="15" is24hr :popover="{ visibility: 'click' }">
            <template v-slot="{ inputValue, togglePopover }"> <div class="date-picker-wrap"><button :value="inputValue" v-on:click="togglePopover" class="datepicker-input" placeholder="RangeSelect" readonly> Set timespan</button></div> </template>
            </DatePicker>
            <!-- {{ range.start }} - {{ range.end }} -->
        </div>
        
        <div class="sensor_list">
            <vue-collapsible-panel-group style="">
                <vue-collapsible-panel v-for="sensor in sensors" :ref="(r) => newSensorPanelRef(r, sensor.hwid)" :key="sensor.hwid" :expanded="false" @click="onPanelClick(sensor.hwid)">
                    <template #title> {{ sensor.friendly_name }} </template>
                    <template #content> <div class="sensor_content"><Sensor ref="sensors" :hwid="sensor.hwid" :range="range"/></div> </template>
                </vue-collapsible-panel>
            </vue-collapsible-panel-group>
            
        </div>
    </div>
</template>

<script>

    import { DatePicker } from 'v-calendar';
    import '@dafcoe/vue-collapsible-panel/dist/vue-collapsible-panel.css';
    //import draggable from 'vuedraggable';
    import Sensor from '@/components/Sensor.vue'
    import ModelCanvas from '@/components/ModelCanvas.vue'
    
    const axios = require('axios').default;
    
    export default {
        data () {
            return {
                sensors: [],
                range: {start: new Date(Date.now() - 1 * 24*60*60*1000), end: Date.now()},
                locale: null
            }
        },
        async created () {
            //this.locale = api.getUserLocale()
            try {
                const response = await axios.get(this.SENSOR_API_URL + 'sensors')
                this.sensors = response.data
            } catch(error) {
                console.log(error);
            }
        },
        methods: {
            newSensorPanelRef(el, hwid){
                this.sensor_panels.push({id: hwid, element: el})
            },
            onDateRangeChanged() {
            
            },
            onPanelClick(hwid) {
                //console.log(this.$refs.sensor_panels[hwid])
                this.$refs.model_canvas.onWindowResize()
                let t = this.sensor_panels.find((p) => p.id == hwid)
                //this.$refs.sensors.refreshPlot()
                this.$refs.model_canvas.selectSensor(hwid, t.element)
            },
            inputChanged(val) {
                this.activeNames = val;
            }
        },
        mounted(){
            this.sensor_panels = []
            this.$refs.model_canvas.loadModel("models/botania_outside_large.glb")
        },
        components: {
            Sensor,
            ModelCanvas,
            DatePicker,
            //draggable
        }
    }
    
</script>

<style scoped>
    div.vcpg {
        --base-color: #000 !important;
        --border-color: #888 !important;
        --bg-color-header: #333 !important;
        --bg-color-header-hover: #000 !important;
        --bg-color-header-active: #000 !important;
        --bg-color-body: #222 !important;
    }
</style>

<style>

.data_container {
    background-position: center, center;
	background-repeat: no-repeat, repeat-x;
	width: 100%;
	z-index: 1;
	background-color: #000;
	border-color: #BBB;
	border-style: solid;
	border-width: .25em .0em .25em 0em;
}

.datepicker_container {
    position: absolute;
    right: 1em;
	z-index: 1;
}

.sensor_list {
	background-color: #111;
	border-color: #BBB;
	border-style: solid;
	border-width: .25em 0em .25em 0em;
	height: 1000px;
	overflow-y: scroll;
	overflow-x: hidden;
	margin: 0;
}

</style>
