<script setup lang="ts">
  import { Scatter } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, PointElement, LineElement, CategoryScale, LinearScale } from 'chart.js'
  import { computed } from 'vue'

  ChartJS.register(Title, Tooltip, Legend, BarElement, PointElement, LineElement, CategoryScale, LinearScale)


  export type Coord = { x: number, y: number }
  export type GearLine = [Coord, Coord]

  const props = defineProps<{
    gears: GearLine[],
    maxRPM: number
  }>()

  const data = computed(() => ({
    type: 'line',
    datasets: [
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
        data: [{ x: 0, y: props.maxRPM }, { x: 180, y: props.maxRPM }],
        borderColor: "red",
        borderDash: [4, 12],
        pointRadius: 0,
      }
    ]
  }));

  const options = computed(() => ({
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
        max: 180,
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
        max: props.maxRPM + 500,
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

<!-- Make one 'dataset' per gear (5 total) -->
<!-- X axis: mph -->
<!-- Y axis: RPMs -->
<!-- 
const labels = Utils.months({count: 7});
const data = {
  labels: labels,
  datasets: [
  {
    label: 'My First Dataset',
    data: 
      [65, 59, 80, 81, 56, 55, 40],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  },
    {
    label: 'My First Dataset',
    data: 
      [20, 40],
    fill: false,
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  },
  ]
}; -->