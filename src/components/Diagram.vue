<script>
import { Scatter } from 'vue-chartjs'
import 'chartjs-plugin-dragdata'

export default {
  extends: Scatter,
  props: {
    chartdata: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    },
    update: {
      type: Boolean,
      default: null
    }
  },
  watch: {
    update() {
      this.$data._chart.update()
    }
  },
  mounted() {
    this.renderChart(this.chartdata, this.options)
  },
  methods: {
    // calculateRadius(ctx) {
    //   console.log(ctx)
    // }
  }
}

</script>
