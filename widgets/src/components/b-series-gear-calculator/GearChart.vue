<script setup lang="ts">
  import { Scatter } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, PointElement, LineElement, CategoryScale, LinearScale } from 'chart.js'
  import { computed } from 'vue'

  ChartJS.register(Title, Tooltip, Legend, BarElement, PointElement, LineElement, CategoryScale, LinearScale)

  const CHART_MAX_MPH = 180
  const CHART_MAX_RPM_BUFFER = 500

  export type Coord = { x: number, y: number }
  export type GearLine = [Coord, Coord]

  const props = defineProps<{
    gears: GearLine[],
    maxRPM: number,
    vtecCrossover: number | undefined
  }>()

  const data = computed(() => {
    const datasets = [
      // Gears  
      ...props.gears.map(g => ({
        showLine: true,
        data: g,
        backgroundColor: "black",
        borderColor: "black"
      })),
      // Redline
      {
        showLine: true,
        data: [{ x: 0, y: props.maxRPM }, { x: CHART_MAX_MPH, y: props.maxRPM }],
        borderColor: "red",
        borderDash: [4, 12],
        pointRadius: 0,
      }
    ]

    if (props.vtecCrossover !== undefined) {
      datasets.push({
        showLine: true,
        data: [{ x: 0, y: props.vtecCrossover }, { x: CHART_MAX_MPH, y: props.vtecCrossover }],
        borderColor: "green",
        borderDash: [4, 12],
        pointRadius: 0,
      })
    }

    return {
      type: 'line',
      datasets,
    }
  });

  const options = computed(() => ({
    animation: {
      duration: 0,
    },
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "MPH"
        },
        min: 0,
        max: CHART_MAX_MPH,
        ticks: {
          stepSize: 10
        }
      },
      y: {
        title: {
          display: true,
          text: "RPM"
        },
        min: 0,
        max: props.maxRPM + CHART_MAX_RPM_BUFFER,
        ticks: {
          stepSize: 100
        }
      }
    }
  }));

</script>

<template>
  <Scatter :data="data" :options="options" />
</template>
