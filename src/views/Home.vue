<template>
  <v-app>
    <v-row class="my-2">
      <v-col cols="12" sm="12" md="4">
        <v-btn
          :color="(addAudiogram) ? 'green' : 'primary'"
          @click="addAudiogramBtn"
        >
          Добавить аудиограмму
        </v-btn>
      </v-col>
      <v-col cols="12" sm="12" md="4">
        <v-btn
          :color="(history) ? 'green' : 'primary'"
          @click="historyBtn"
        >
          История аудиограмм
        </v-btn>
      </v-col>
    </v-row>
    <div v-if="messStoreAudiogram.show">
      <p
        :class="messStoreAudiogram.right.class"
      >
        {{ messStoreAudiogram.right.text }}
      </p>
    </div>
    <div v-if="addAudiogram">
      <v-row>
        <v-col
          cols="12"
          xl="6"
          lg="6"
          md="6"
        >
          <v-row class="justify-center">
            <v-icon
              x-large
              :color="(ear) ? 'green' : 'red'"
            >
              mdi-numeric-1-circle
            </v-icon>
          </v-row>
          <v-select
            v-model="ear"
            :items="ears"
            label="Выберите ухо"
          />
        </v-col>
        <v-col>
          <v-row class="justify-center">
            <v-icon
              x-large
              :color="(ear && date === null) ? 'red' : (date !== null && ear) ? 'green' : 'grey'"
            >
              mdi-numeric-2-circle
            </v-icon>
          </v-row>
          <v-menu
            v-model="menu2"
            :close-on-content-click="false"
            :nudge-right="40"
            :disabled="(ear) ? false : true"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                v-model="date"
                :disabled="(ear) ? false : true"
                label="Выберете дату"
                readonly
                v-on="on"
              />
            </template>
            <v-date-picker
              v-model="date"
              :max="this.$moment().add(1,'days').format('YYYY-MM-DD')"
              @input="menu2 = false"
            >
              <v-spacer />
              <v-btn
                text
                color="primary"
                @click="menu2 = false"
              >
                Закрыть
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-icon
          x-large
          :color="(date !== null && chartData.datasets[0].data.length === 0) ? 'red' : (date !== null && chartData.datasets[0].data.length !== 0) ? 'green' : 'grey'"
        >
          mdi-numeric-3-circle
        </v-icon>
      </v-row>
      <v-row v-if="date !== null" class="my-class-diagram">
        <v-col
          cols="12"
          xl="9"
          lg="9"
          md="9"
        >
          <diagram :chartdata="chartData" :options="chartOptions()" :update="axisUpdate" :height="600" />
        </v-col>
        <v-col
          cols="12"
          xl="3"
          lg="3"
          md="3"
          class="px-6 ml-xl-n6 ml-lg-n6 ml-md-n6"
        >
          <v-switch
            v-model="adPoint"
            :label="(adPoint) ? `Добавить` : `Удалить`"
          />
          <div
            v-for="(val, i) in addPoints" :key="i"
          >
            <v-text-field
              v-show="delPoint(i)"
              ref="reference"
              v-model="addPoints[i].message"
              style="min-width:190px;"
              clear-icon="mdi-delete-empty"
              :label="addPoints[i].label"
              placeholder="Добавить точку"
              outlined
              clearable
              type="text"
              step="5"
              :max="120"
              :min="-10"
              dense
              :readonly="(!adPoint) ? true : false"
              :rules="[rules.onlyNum]"
              @click:clear="clearMessage(i)"
              @click:append="toggleMarker"
              @input="onInput($event, i)"
            >
              <template
                v-if="adPoint"
                slot="prepend"
              >
                <v-icon
                  :disabled="(addPoints[i].message === '' || addPoints[i].message == -10 || addPoints[i].message === null) ? true : false"
                  @click="decrement(i)"
                >
                  remove
                </v-icon>
              </template>
              <template
                v-if="adPoint"
                slot="append-outer"
              >
                <v-icon
                  :disabled="(addPoints[i].message == 120) ? true : false"
                  @click="increment(i)"
                >
                  add
                </v-icon>
              </template>
            </v-text-field>
          </div>
          <v-btn
            depressed
            color="primary"
            :disabled="(chartData.datasets[0].data.length !==0) ? false : true"
            @click="send"
          >
            Сохранить
          </v-btn>
        </v-col>
      </v-row>
    </div>
    <div v-if="history"><ShowAudiogram :user_uid="user_uid"/></div>
  </v-app>
</template>

<script>
// import { storeAudiogram } from '@/api/medical_instruments/otolaryngology/audiogram.js'
import Diagram from '@/components/Diagram'
import ShowAudiogram from './ShowAudiogram.vue'

const dotPoint = () => {
  const points = []
  const axisY = [-10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120]
  for (let i = 0; i < 7; i++) {
    for (let q = 0; q < axisY.length; q++) {
      points.push({
        x: i,
        y: axisY[q]
      })
    }
  }
  return points
}
export default {
  props: {
    user_uid: {
      type: String,
      default: ''
    }
  },
  components: { Diagram, ShowAudiogram },
  data: () => ({
    axisY: [-10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120],
    addPoints: [
      {
        label: '125 Гц',
        message: ''
      },
      {
        label: '250 Гц',
        message: ''
      },
      {
        label: '500 Гц',
        message: ''
      },
      {
        label: '1k Гц',
        message: ''
      },
      {
        label: '2k Гц',
        message: ''
      },
      {
        label: '4k Гц',
        message: ''
      },
      {
        label: '8k Гц',
        message: ''
      }
    ],
    rules: {
      numberRule: val => val <= 120 && val >= -10 || 'Please enter number',
      onlyNum: value => {
        const axisY = [-10, -5, 0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120]
        let result = false
        for (const key in axisY) {
          if (axisY[key] == value) {
            result = true
            break
          }
        }
        if (value === null) {
          result = true
        }
        return result || 'Нет пересечений'
      }
    },
    // message: '',
    pointTest: [],
    marker: true,
    ear: '',
    ears: [
      {
        text: 'Левое (воздух)',
        value: 'left-air'
      },
      {
        text: 'Левое (кость)',
        value: 'left-bone'
      },
      {
        text: 'Правое (воздух)',
        value: 'right-air'
      },
      {
        text: 'Правое (кость)',
        value: 'right-bone'
      }
    ],
    // date: new Date().toISOString().substr(0, 10),
    date: null,
    menu2: false,
    // test: '2020-04-12',
    adPoint: true,
    chartData: {
      datasets: [
        {
          dragData: true,
          label: '2020-04-12',
          type: 'line',
          backgroundColor: 'transparent',
          borderColor: 'rgba(1, 116, 188, 0.50)',
          pointBackgroundColor: 'rgba(171, 71, 188, 1)',
          borderWidth: 1,
          pointRadius: 10,
          pointHoverRadius: 10,
          data: [],
          fill: false,
          lineTension: 0
        },
        {
          dragData: false,
          type: 'bubble',
          label: 'point',
          backgroundColor: 'transparent',
          borderColor: 'rgb(201, 203, 207)',
          // pointBackgroundColor: 'rgba(171, 71, 188, 1)',
          borderWidth: 1,
          pointRadius: 8,
          pointHoverRadius: 9,
          data: dotPoint(),
          fill: false
        }
      ]
    },
    axisUpdate: false,
    history: false,
    addAudiogram: false,
    messStoreAudiogram: {
      show: false,
      text: '',
      class:'',
      error: {
        class: 'text-center red--text display-1',
        text: 'Аудиограмма не сохранена'
      },
      right: {
        class: 'text-center green--text display-1',
        text: 'Аудиограмма сохранена'
      }
    }
  }),
  watch: {
    adPoint(data) {
      this.chartData.datasets[0].dragData = data
    }
  },
  mounted() {
  },
  methods: {
    addAudiogramBtn() {
      this.addAudiogram = !this.addAudiogram
      this.history = false
    },
    historyBtn() {
      this.history = !this.history
      this.addAudiogram = false
    },
    chartOptions() {
      const vm = this
      const chartOptions = {
        dragData: true,
        dragX: false,
        // dragDataRound: 0,
        dragOptions: {
          showTooltip: false,
          magnet: {
            to: function(value) {
              return {
                x: value.x,
                y: Math.round(value.y / 5) * 5
              }
            }
          }
        },
        onDragStart: function(e) {
        },
        onDrag: function(e, datasetIndex, index, value) {
          e.target.style.cursor = 'grabbing'
        },
        onDragEnd: function(e, datasetIndex, index, value) {
          e.target.style.cursor = 'default'
          const pointTest = vm.pointTest
          vm.pointTest = []
          // const onDragEndPoint = {
          //   x: value.x,
          //   y: value.y
          // }
          // pointTest[index] = onDragEndPoint
          vm.addPoints[value.x].message = value.y

          vm.pointTest = pointTest
        },
        hover: {
          onHover: function(e) {
            const point = this.getElementAtEvent(e)
            if (point.length) e.target.style.cursor = 'grab'
            else e.target.style.cursor = 'default'
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        // hoverMode: 'index',
        stacked: false,
        title: {
          display: true,
          text: 'Создать диаграмму'
        },
        scales: {
          yAxes: [{
            ticks: {
              reverse: true,
              stepSize: 5,
              max : 120,
              min : -10
            }
          }],
          xAxes: [{
            display: true,
            ticks: {
              userCallback: function(label, index, labels) {
                return vm.addPoints[index].label
              }
            }
          }]
        },
        legend: {
          display: false
        },
        tooltips: {
          enabled: false
        },
        onClick: function(evt, legendItem) {
          const activePoints = this.getElementsAtEvent(evt)

          const chartData = activePoints[0]['_chart'].config.data
          const idx = activePoints[0]['_index']
          const value = chartData.datasets[1].data[idx]
          const dataX = value.x
          const dataXarray = this.data.datasets[0].data
          if (vm.adPoint) {
            if (legendItem[0]['_datasetIndex'] === 1) {

              let newXarray = []

              // newXarray.length = 7

              if (dataXarray.length > 0) {
                for (let i = 0; i < dataXarray.length; i++) {
                  newXarray[dataXarray[i].x] = dataXarray[i]
                }
              }

              // newXarray = dataXarray.sort((prev, next) => prev.x - next.x)

              newXarray[dataX] = {
                x: value.x,
                y: value.y
              }

              vm.addPoints[value.x].message = value.y

              this.data.datasets[0].data = newXarray.filter(Boolean)

              this.update()
              vm.pointTest = vm.chartData.datasets[0]['data']
            }
          } else {
            const idxDell = legendItem[0]['_index']
            const pointDell = legendItem[0]['_chart'].data.datasets[0].data[idxDell].x

            vm.clearMessage(pointDell)
          }
        }
      }
      // this.onDragEndPoint = chartOptions.onDragEndPoint
      return chartOptions
    },
    clearMessage(index) {
      if (this.chartData.datasets[0].data.length === 1) {
        this.chartData.datasets[0].data.length = []
        if (this.axisUpdate) {
          this.axisUpdate = false
        } else {
          this.axisUpdate = true
        }
        this.pointTest = []
      } else {
        const dataXarray = this.chartData.datasets[0].data

        const newXarray = []

        for (let i = 0; i < dataXarray.length; i++) {
          newXarray[dataXarray[i].x] = dataXarray[i]
        }

        newXarray.splice(index, 1)

        this.chartData.datasets[0].data = newXarray.filter(Boolean)

        if (this.axisUpdate) {
          this.axisUpdate = false
        } else {
          this.axisUpdate = true
        }

        this.pointTest = this.chartData.datasets[0]['data']
      }
      this.addPoints[index].message = ''
    },
    clearPoint(index) {
      if (this.chartData.datasets[0].data.length === 0) {
        this.chartData.datasets[0].data.length = []
        if (this.axisUpdate) {
          this.axisUpdate = false
        } else {
          this.axisUpdate = true
        }
        this.pointTest = this.chartData.datasets[0]['data']
      } else {
        const dataXarray = this.chartData.datasets[0].data

        const newXarray = []

        for (let i = 0; i < dataXarray.length; i++) {
          newXarray[dataXarray[i].x] = dataXarray[i]
        }

        newXarray.splice(index, 1)

        this.chartData.datasets[0].data = newXarray.filter(Boolean)

        if (this.axisUpdate) {
          this.axisUpdate = false
        } else {
          this.axisUpdate = true
        }

        this.pointTest = this.chartData.datasets[0]['data']
      }
    },
    toggleMarker() {
      this.marker = !this.marker
    },
    increment(data) {
      // console.log(this.pointTest.length)
      if (this.addPoints[data].message === '' || this.addPoints[data].message === null || this.addPoints[data].message < -10) {
        this.addPoints[data].message = -10

        this.renderPoint(data, -10)
      } else {
        let result = true
        for (let i = 0; i < this.axisY.length; i++) {
          if (this.addPoints[data].message == this.axisY[i] && this.addPoints[data].message != 120) {
            this.addPoints[data].message = this.axisY[i + 1]
            this.renderPoint(data, this.axisY[i + 1])
            result = false
            break
          } else if (this.addPoints[data].message > 120) {
            this.addPoints[data].message = 120
            this.renderPoint(data, 120)
            result = false
          }
        }
        if (result) {
          const axisY = Math.ceil(Number(this.addPoints[data].message) / 5) * 5
          this.addPoints[data].message = axisY
          this.renderPoint(data, axisY)
        }
      }
    },
    decrement(data) {
      if (this.addPoints[data].message === '' || this.addPoints[data].message === null || this.addPoints[data].message < -10) {
        this.addPoints[data].message = -10
        this.renderPoint(data, -10)
      } else if (this.addPoints[data].message > 120) {
        this.addPoints[data].message = 120
        this.renderPoint(data, 120)
      } else {
        let result = true
        for (let i = 0; i < this.axisY.length; i++) {
          if (this.addPoints[data].message == this.axisY[i] && this.addPoints[data].message != -10) {
            this.addPoints[data].message = this.axisY[i - 1]
            this.renderPoint(data, this.axisY[i - 1])
            result = false
            break
          }
        }
        if (result) {
          const axisY = Math.floor(Number(this.addPoints[data].message) / 5) * 5
          this.addPoints[data].message = axisY
          this.renderPoint(data, axisY)
        }
      }
    },
    renderPoint(x, y) {
      const dataXarray = this.chartData.datasets[0].data
      if (dataXarray.length === 0) {
        this.chartData.datasets[0].data = [
          { x, y }
        ]
        if (this.axisUpdate) {
          this.axisUpdate = false
        } else {
          this.axisUpdate = true
        }
        this.pointTest = [{ x, y }]
      } else {
        const newXarray = []

        for (let i = 0; i < dataXarray.length; i++) {
          newXarray[dataXarray[i].x] = dataXarray[i]
        }

        newXarray[x] = {
          x,
          y
        }

        this.chartData.datasets[0].data = newXarray.filter(Boolean)

        if (this.axisUpdate) {
          this.axisUpdate = false
        } else {
          this.axisUpdate = true
        }

        this.pointTest = this.chartData.datasets[0]['data']
      }
    },
    delPoint(index) {
      if (this.adPoint) {
        return true
      } else if (!this.adPoint && Number.isInteger(this.addPoints[index].message)) {
        return true
      } else {
        return false
      }
    },
    onInput(value, index) {
      const valueInput = value.replace(/\D/g, '').slice(0, 3)
      const axisY = this.axisY.indexOf(Number(this.addPoints[index].message.slice(0, 3)))

      if (value[0] === '-' && valueInput.length <= 3) {
        this.addPoints[index].message = '-' + valueInput
        this.$refs.reference[index]['$refs'].input['value'] = '-' + valueInput
        this.$refs.reference[index]['_data'].lazyValue = '-' + valueInput
        if (axisY !== -1) {
          this.renderPoint(index, this.axisY[axisY])
          this.addPoints[index].message = Number(this.addPoints[index].message)
        } else {
          this.clearPoint(index)
        }
      } else if (value[0] !== '-' && value.length <= 3) {
        this.addPoints[index].message = valueInput
        this.$refs.reference[index]['$refs'].input['value'] = valueInput
        this.$refs.reference[index]['_data'].lazyValue = valueInput
        if (axisY !== -1 && value !== '') {
          this.renderPoint(index, this.axisY[axisY])
          this.addPoints[index].message = Number(this.addPoints[index].message)
        } else {
          this.clearPoint(index)
        }
      } else if (value[0] === '-' && valueInput.length > 3) {
        this.addPoints[index].message = '-' + valueInput[0] + valueInput[1] + valueInput[2]
        this.$refs.reference[index]['$refs'].input['value'] = '-' + valueInput[0] + valueInput[1] + valueInput[2]
        this.$refs.reference[index]['_data'].lazyValue = '-' + valueInput[0] + valueInput[1] + valueInput[2]
        if (axisY !== -1) {
          this.renderPoint(index, this.axisY[axisY])
          this.addPoints[index].message = Number(this.addPoints[index].message)
        } else {
          this.clearPoint(index)
        }
      } else {
        this.addPoints[index].message = valueInput
        this.$refs.reference[index]['$refs'].input['value'] = valueInput
        this.$refs.reference[index]['_data'].lazyValue = valueInput
        if (axisY !== -1) {
          this.renderPoint(index, this.axisY[axisY])
          this.addPoints[index].message = Number(this.addPoints[index].message)
        } else {
          this.clearPoint(index)
        }
      }
    },
    send() {
      const date = []
      const pointTest = this.pointTest.slice()
      pointTest.forEach((element, index) => {
        element.x = this.addPoints[element.x].label
        date.push({x: element.x, y: element.y})
      })
      const data = {
        user_uid: this.user_uid,
        data: date,
        ear_direction: this.ear,
        time: this.$moment(this.date).format('X')
        // patientUid:
      }

      storeAudiogram(data)
        .then(response => {
          if (response.data.status) {
            this.date = null
            this.ear = false

            this.addAudiogram = false
            this.messStoreAudiogram.text = this.messStoreAudiogram.right.text
            this.messStoreAudiogram.class = this.messStoreAudiogram.right.class
            this.messStoreAudiogram.show = true

            setTimeout(() => {
              this.messStoreAudiogram.show = false
              this.historyBtn()
            }, 2000)
          } else {
            this.addAudiogram = false
            this.messStoreAudiogram.text = this.messStoreAudiogram.error.text
            this.messStoreAudiogram.class = this.messStoreAudiogram.error.class
            setTimeout(() => {
              this.messStoreAudiogram.show = false
            }, 2000)
          }
        })
    }

  }
}
</script>

<style scoped>
.theme--light.v-application {
    background: none;
  }
</style>

<style>
.my-class-diagram .v-text-field.v-text-field--enclosed .v-text-field__details {
  padding: 0;
}

</style>
