<script setup lang="ts">
  // Shoelace must be imported / setBasePathed in every root web component since we use
  // them as the entry points to compile from.
  import '@shoelace-style/shoelace';
  import '@shoelace-style/shoelace/dist/themes/light.css';
  import { setBasePath, SlInput, type SlBlurEvent, type SlChangeEvent, type SlInputEvent, type SlSelectEvent } from '@shoelace-style/shoelace';
  if (import.meta.env.MODE === 'production') {
    // Hugo auto resolve's the /static sub-dir so we omit it in the path
    setBasePath('../../../shoelace');
  }

  import { computed, ref } from 'vue';
  import {
    Chassis,
    CHASSIS_LABEL,
    Transmission,
    TRANSMISSION_CHASSIS_SPECS,
    type Gears,
  } from '@/components/b-series-gear-calculator/hondaTransmissions';
  import { inchesToMM, isSLInput, isSLSelect, objectEntries, objectKeys } from '@/utils';
  import { Chart } from 'chart.js';
  import GearChart, { GearLine } from './GearChart.vue';
  import { maxMPHForGear, rpmForGearAtMPH } from './utils';

  // Tire Size
  const availableTireWidths = [175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275];
  const availableTireRatios = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
  const availableTireDiameters = [13, 14, 15, 16, 17, 18];
  const tireWidth = ref(205);
  const tireRatio = ref(50);
  const tireDiameter = ref(15);
  const updateTireWidth = (ev: SlChangeEvent) => {
    if (!isSLSelect(ev.target)) {
      throw new Error("No target for updateTireWidth");
    }
    tireWidth.value = Number(ev.target.value)
  }
  const updateTireRatio = (ev: SlChangeEvent) => {
    if (!isSLSelect(ev.target)) {
      throw new Error("No target for updateTireRatio");
    }
    tireRatio.value = Number(ev.target.value)
  }
  const updateTireDiameter = (ev: SlChangeEvent) => {
    if (!isSLSelect(ev.target)) {
      throw new Error("No target for updateTireDiameter");
    }
    tireDiameter.value = Number(ev.target.value)
  }
  const overallTireDiameter = computed(() => {
    const tireWidthInches = inchesToMM(tireWidth.value);
    const sidewallHeightInches = tireWidthInches * tireRatio.value / 100;
    const rimDiameterInches = tireDiameter.value;

    return 2 * sidewallHeightInches + rimDiameterInches;
  });

  // Engine
  const maxRPM = ref(7000);
  const updateMaxRPM = (ev: SlInputEvent) => {
    if (!isSLInput(ev.target)) {
      throw new Error("No target for updateMaxRPM");
    }

    maxRPM.value = ev.target.valueAsNumber;
  }
  const validateMaxRPM = (ev: SlBlurEvent) => {
    if (!isSLInput(ev.target)) {
      throw new Error("No target for validateMaxRPM");
    }

    if (!Number.isInteger(maxRPM.value)) {
      const rounded = Math.round(maxRPM.value)
      maxRPM.value = rounded;
      ev.target.value = rounded.toString();
    }
    if (maxRPM.value < 0) {
      maxRPM.value = 0;
      ev.target.value = '0';
    }
    if (maxRPM.value > 10_000) {
      maxRPM.value = 10_000;
      ev.target.value = '10000';
    }
  }

  interface SelectOption<V> {
    label: string,
    value: V,
  }

  // Transmission
  const GEAR_LABELS = ["1st", "2nd", "3rd", "4th", "5th"]
  const transmission = ref(Transmission.S80);
  const chassis = ref(objectKeys(TRANSMISSION_CHASSIS_SPECS[transmission.value])[0]);

  const availableTransmissions = computed<SelectOption<Transmission>[]>(() => {
    return objectEntries(Transmission).map(([label, value]) => ({ label, value }));
  });
  const availableChassis = computed<SelectOption<Chassis>[]>(() => {
    return objectKeys(TRANSMISSION_CHASSIS_SPECS[transmission.value]).map((value) => ({
      label: CHASSIS_LABEL[value],
      value
    }))
  });

  const updateChassis = (ev: SlChangeEvent) => {
    if (!isSLSelect(ev.target)) {
      throw new Error("No target for updateChassisCode")
    }
    chassis.value = ev.target.value as Chassis
  };

  const updateTransmission = (ev: SlChangeEvent) => {
    if (!isSLSelect(ev.target)) {
      throw new Error("No target for updateTransmission")
    }
    transmission.value = ev.target.value as Transmission

    // It's possible for the current chassis to no longer be a valid option
    // when the transmission changed since not every chassis came with every
    // transmission.
    if (TRANSMISSION_CHASSIS_SPECS[transmission.value][chassis.value] === undefined) {
      chassis.value = objectKeys(TRANSMISSION_CHASSIS_SPECS[transmission.value])[0]
    }
  }

  const gears = ref<Gears>(TRANSMISSION_CHASSIS_SPECS[transmission.value][chassis.value]?.gears ?? [0, 0, 0, 0, 0])
  const finalDrive = ref(TRANSMISSION_CHASSIS_SPECS[transmission.value][chassis.value]?.finalDrive ?? 0)

  const updateGear = (gearIndex: number, ev: SlInputEvent) => {
    if (!isSLInput(ev.target)) {
      throw new Error(`No target for updateGear(gearIndex: ${gearIndex})`);
    }
    gears.value[gearIndex] = ev.target.valueAsNumber
  }
  const validateGear = (gearIndex: number, ev: SlBlurEvent) => {
    if (!isSLInput(ev.target)) {
      throw new Error(`No target for validateGear(gearIndex: ${gearIndex})`);
    }

    const currGearValue = gears.value[gearIndex]
    if (currGearValue < 0) {
      gears.value[gearIndex] = 0
      ev.target.value = "0"
    }
    if (currGearValue > 10) {
      gears.value[gearIndex] = 10
      ev.target.value = "10"
    }
  }

  const updateFinalDrive = (ev: SlInputEvent) => {
    if (!isSLInput(ev.target)) {
      throw new Error(`No target for updateFinalDrive`);
    }
    finalDrive.value = ev.target.valueAsNumber
  }
  const validateFinalDrive = (ev: SlBlurEvent) => {
    if (!isSLInput(ev.target)) {
      throw new Error(`No target for validateFinalDrive`);
    }

    const currFinalDrive = finalDrive.value
    if (Number.isNaN(currFinalDrive)) {
      finalDrive.value = TRANSMISSION_CHASSIS_SPECS[transmission.value][chassis.value]?.finalDrive ?? 0
      ev.target.value = finalDrive.value.toString();
    }
    if (currFinalDrive < 0) {
      finalDrive.value = 0;
      ev.target.value = "0"
    }
    if (currFinalDrive > 10) {
      finalDrive.value = 10
      ev.target.value = "10"
    }
  }

  // Display
  const getMaxMPH = (gear: number) => {
    const gearRatio = gears.value[gear];
    const tireDiameter = overallTireDiameter.value
    const redline = maxRPM.value

    return (redline * tireDiameter) / (gearRatio * finalDrive.value * 336)
  }


  const gearLines = computed<GearLine[]>(() => {
    const redline = maxRPM.value
    const fd = finalDrive.value
    const td = tireDiameter.value

    const lines: GearLine[] = gears.value.map((g, i) => {
      const startMPH = i > 0 ? maxMPHForGear(gears.value[i - 1], fd, redline, td) : 0;
      const startRPM = i > 0 ? rpmForGearAtMPH(gears.value[i], fd, startMPH, td) : 0;
      const endMPH = maxMPHForGear(g, fd, redline, td)
      const endRPM = redline

      return [
        { x: startMPH, y: startRPM },
        { x: endMPH, y: endRPM }
      ]
    })

    return lines
  })

</script>

<template>
  <!-- On large displays inputs will be on left, graph on right. -->
  <!-- On small displays inputs will be on top, graph on bottom -->
  <div id="foo" class="fr">
    <div class="fc">
      <strong>Tire size <small>([[overallTireDiameter.toFixed(2)]]" diameter)</small></strong>
      <div class="fr">
        <sl-select placeholder="Width" class="pr2" :value="tireWidth.toString()" @sl-change="updateTireWidth">
          <sl-option v-for="w in availableTireWidths" :value="w">[[w]]</sl-option>
        </sl-select>

        <sl-select placeholder="Ratio" class="pr2" :value="tireRatio.toString()" @sl-change="updateTireRatio">
          <sl-option v-for="r in availableTireRatios" :value="r">[[r]]</sl-option>
        </sl-select>

        <sl-select placeholder="Diameter" :value="tireDiameter.toString()" @sl-change="updateTireDiameter">
          <sl-option v-for="d in availableTireDiameters" :value="d">[[d]]</sl-option>
        </sl-select>
      </div>

      <strong>Redline</strong>
      <sl-input type="number" inputmode="numeric" :step="100" :value="maxRPM" @input="updateMaxRPM"
        @blur="validateMaxRPM"></sl-input>
      <sl-divider></sl-divider>

      <strong>Transmission code</strong>
      <sl-select :value="transmission" @sl-change="updateTransmission">
        <sl-option v-for="{ value, label } in availableTransmissions" :value="value">[[label]]</sl-option>
      </sl-select>

      <strong class="fr aic">
        <span class="pr1">Chassis</span>
        <sl-tooltip class="tooltip" hoist content="The chassis that the transmission came from"><sl-icon
            name="question-circle-fill"></sl-icon></sl-tooltip></strong>
      <sl-select :value="chassis" @sl-change="updateChassis">
        <sl-option v-for="{ value, label } in availableChassis" :value="value">[[label]]</sl-option>
      </sl-select>

      <div>
        <div class="fr jcsb">
          <strong class="fg1">Gears</strong>
          <strong class="gear-column mr10px">Ratio</strong>
          <strong class="gear-column">Max MPH</strong>
        </div>

        <div class="fr mb1" v-for="(gear, index) in gears">
          <span class="fg1">[[ GEAR_LABELS[index] ]]</span>
          <sl-input type="number" step="0.001" inputmode="numeric" class="gear-column mr10px" :value="gears[index]"
            @sl-input="(ev: SlInputEvent) => updateGear(index, ev)"
            @sl-blur="(ev: SlBlurEvent) => validateGear(index, ev)"></sl-input>
          <sl-input class="gear-column" :value="getMaxMPH(index).toFixed(2)" readonly></sl-input>
        </div>

        <div class="fr jcsb">
          <span class="fg1">Final drive</span>
          <sl-input type="number" step="0.01" inputmode="numeric" class="gear-column mr10px" :value="finalDrive"
            @sl-input="updateFinalDrive" @sl-blur="validateFinalDrive"></sl-input>
          <div class="gear-column"></div>
        </div>
        <sl-divider></sl-divider>
      </div>
    </div>

    <div class="fg1">
      <GearChart :gears="gearLines" :maxRPM="maxRPM" />
    </div>
  </div>
</template>

<style lang="sass" scoped>
  .gear-column
    width: 120px

  .mr10px
    margin-right: 10px 
</style>
