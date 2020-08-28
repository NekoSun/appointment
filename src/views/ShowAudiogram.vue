<template>
  <v-app>
    <v-autocomplete
      v-model="valueL"
      :items="itemsL"
      dense
      multiple
      filled
      label="Левое ухо"
      @change="valueLeftEar"
    />
    <v-autocomplete
      v-model="valueR"
      :items="itemsR"
      dense
      multiple
      filled
      label="Правое ухо"
      @change="valueRightEar"
    />
    <diagram :chartdata="chartData" :options="chartOptions()" :update="axisUpdate" :height="600" />
  </v-app>
</template>

<script>
import Diagram from '@/components/Diagram'
// import { getAudiogram } from '@/api/medical_instruments/otolaryngology/audiogram.js'
import ColorHash from 'color-hash'
const colorHash = new ColorHash()

export default {
  props: {
    user_uid: {
      type: String,
      default: ''
    }
  },
  components: { Diagram },
  data: () => ({
    itemsL: [],
    itemsR: [],
    valueL: null,
    valueR: null,
    chartData: {
      datasets: []
    },
    axisY: [-10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120],
    axisX: ['125 Гц', '250 Гц', '500 Гц', '1k Гц', '2k Гц', '4k Гц', '8k Гц'],
    axisUpdate: false
  }),
  mounted() {
    this.getEars()
  },
  methods: {
    chartOptions() {
      const vm = this
      const chartOptions = {
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              reverse: true,
              stepSize: 5,
              max: 120,
              min: -10
            }
          }],
          xAxes: [{
            display: true,
            ticks: {
              max: 6,
              min: 0,
              userCallback: function(label, index, labels) {
                return vm.axisX[index]
              }
            }
          }]
        },
        maintainAspectRatio: false,
        // hoverMode: 'index',
        stacked: false,
        title: {
          display: true,
          text: 'Аудиограмма'
        },
        legend: {
          display: true
        },
        tooltips: {
          enabled: false
        },
        onClick: function(evt, legendItem) {
          const activePoints = this.getElementsAtEvent(evt)
          // log('onClick:' + legendItem.text)
          console.log(activePoints)
          console.log(legendItem.text)


        }
      }
      // this.onDragEndPoint = chartOptions.onDragEndPoint
      return chartOptions
    },
    getEars() {
      getAudiogram({ user_uid: this.user_uid })
        .then(response => {
          console.log(response.data.data)
          const data = response.data.data
          for (const key in data) {
            if (data[key]['ear_direction'].split('-')[0] === 'left') {
              const parentEar = (data[key]['ear_direction'].split('-')[1] === 'air') ? 'воздух' : 'кость'
              console.log('pushL')
              this.itemsL.push({
                text: `${this.$moment.unix(data[key]['time']).format('YYYY-MM-DD')} (${parentEar})`,
                value: {
                  points: data[key].data,
                  label: `${this.$moment.unix(data[key]['time']).format('YYYY-MM-DD')} (${parentEar[0]})`
                }
              })
              console.log(this.itemsL)
            }
            if (data[key]['ear_direction'].split('-')[0] === 'right') {
              const parentEar = (data[key]['ear_direction'].split('-')[1] === 'air') ? 'воздух' : 'кость'
              this.itemsR.push({
                text: `${this.$moment.unix(data[key]['time']).format('YYYY-MM-DD')} (${parentEar})`,
                value: {
                  points: data[key].data,
                  label: `${this.$moment.unix(data[key]['time']).format('YYYY-MM-DD')} (${parentEar[0]})`
                }
              })
            }
          }
        })
      // console.log(this.itemsL)
    },
    valueLeftEar() {
      this.chartData.datasets = []

      this.valueR = null

      const valueL = this.valueL.slice()

      const vm = this
      valueL.forEach((element, index) => {
        const data = []

        for (let i = 0; i < element.points.length; i++) {
          // data.push(JSON.parse(element.points[i]))
          data.push(element.points[i])
        }

        data.forEach(element => {
          for (let i = 0; i < vm.axisX.length; i++) {
            if (vm.axisX[i] === element.x) {
              element.x = i
            }
          }
        })

        vm.chartData.datasets.push({
          type: 'line',
          label: element.label,
          backgroundColor: 'transparent',
          borderColor: colorHash.hex(index),
          pointBackgroundColor: colorHash.hex(index),
          borderWidth: 2,
          pointRadius: 10,
          pointHoverRadius: 10,
          data,
          fill: false,
          lineTension: 0
        })
      })
      // this.chartData.datasets
      if (this.axisUpdate) {
        this.axisUpdate = false
      } else {
        this.axisUpdate = true
      }
    },
    valueRightEar() {
      this.chartData.datasets = []

      this.valueL = null

      const valueR = this.valueR.slice()

      const vm = this
      valueR.forEach((element, index) => {
        const data = []

        for (let i = 0; i < element.points.length; i++) {
          // data.push(JSON.parse(element.points[i]))
          data.push(element.points[i])
        }

        data.forEach(element => {
          for (let i = 0; i < vm.axisX.length; i++) {
            if (vm.axisX[i] === element.x) {
              element.x = i
            }
          }
        })

        vm.chartData.datasets.push({
          type: 'line',
          label: element.label,
          backgroundColor: 'transparent',
          borderColor: colorHash.hex(index * 6),
          pointBackgroundColor: colorHash.hex(index * 6),
          borderWidth: 2,
          pointRadius: 10,
          pointHoverRadius: 10,
          data,
          fill: false,
          lineTension: 0
        })
      })
      // this.chartData.datasets
      if (this.axisUpdate) {
        this.axisUpdate = false
      } else {
        this.axisUpdate = true
      }
    }
  }
}
</script>
