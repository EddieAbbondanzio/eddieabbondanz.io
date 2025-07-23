<script setup lang="ts">
  // Shoelace must be imported / setBasePathed in every root web component since we use
  // them as the entry points to compile from.
  import '@shoelace-style/shoelace';
  import '@shoelace-style/shoelace/dist/themes/light.css';
  import { setBasePath, SlInput, type SlBlurEvent, type SlChangeEvent, type SlClearEvent, type SlInputEvent } from '@shoelace-style/shoelace';
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
  import { inchesToMM, isSLCheckbox, isSLInput, isSLSelect, objectEntries, objectKeys } from '@/utils';
  import GearChart, { type GearLine } from './GearChart.vue';
  import { maxMPHForGear, rpmForGearAtMPH } from './utils';
  import Reset from './Reset.vue';

  const DEFAULT_TIRE_WIDTH = 205;
  const DEFAULT_TIRE_RATIO = 50;
  const DEFAULT_TIRE_DIAMETER = 15;
  const DEFAULT_REDLINE = 8200;
  const DEFAULT_VTEC_CROSSOVER = 4400;
  const DEFAULT_TRANSMISSION = Transmission.S80;
  const DEFAULT_CHASSIS = Chassis.USDM_94_01_GSR;

  // Tire Size
  const availableTireWidths = [175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275];
  const availableTireRatios = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
  const availableTireDiameters = [13, 14, 15, 16, 17, 18];
  const tireWidth = ref(DEFAULT_TIRE_WIDTH);
  const tireRatio = ref(DEFAULT_TIRE_RATIO);
  const tireDiameter = ref(DEFAULT_TIRE_DIAMETER);
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
  const maxRPM = ref(DEFAULT_REDLINE);
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

  const vtecEnabled = ref(true);
  const updateVtecEnabled = (ev: SlChangeEvent) => {
    if (!isSLCheckbox(ev.target)) {
      throw new Error("No target for updateVtecEnabled");
    }
    vtecEnabled.value = ev.target.checked;
  }
  const vtecCrossover = ref(DEFAULT_VTEC_CROSSOVER)
  const updateVTECCrossover = (ev: SlInputEvent) => {
    if (!isSLInput(ev.target)) {
      throw new Error("No target for updateVTECCrossover");
    }
    vtecCrossover.value = ev.target.valueAsNumber;
  }
  const validateVTECCrossover = (ev: SlBlurEvent) => {
    if (!isSLInput(ev.target)) {
      throw new Error("No target for validateVTECCrossover");
    }

    if (!Number.isInteger(vtecCrossover.value)) {
      const rounded = Math.round(vtecCrossover.value)
      vtecCrossover.value = rounded;
      ev.target.value = rounded.toString();
    }
    if (vtecCrossover.value < 0) {
      vtecCrossover.value = 0;
      ev.target.value = '0';
    }
    if (vtecCrossover.value > maxRPM.value) {
      vtecCrossover.value = maxRPM.value;
      ev.target.value = maxRPM.value.toString();
    }
  }

  interface SelectOption<V> {
    label: string,
    value: V,
  }

  // Transmission
  const GEAR_LABELS = ["1st", "2nd", "3rd", "4th", "5th"]
  const transmission = ref(DEFAULT_TRANSMISSION);
  const chassis = ref(DEFAULT_CHASSIS);

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

    const specs = TRANSMISSION_CHASSIS_SPECS[transmission.value][chassis.value]
    if (specs !== undefined) {
      gears.value = [...specs.gears.map(newGearConfig)]
      finalDrive.value = specs.finalDrive
    }
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
      const specs = TRANSMISSION_CHASSIS_SPECS[transmission.value][chassis.value]!

      gears.value = [...specs.gears.map(newGearConfig)]
      finalDrive.value = specs.finalDrive
    }
  }

  interface GearConfig {
    stockRatio: number;
    ratio: number
    modified: boolean
  }

  function newGearConfig(ratio: number): GearConfig {
    return {
      stockRatio: ratio,
      ratio,
      modified: false
    }
  }


  const gears = ref<GearConfig[]>((TRANSMISSION_CHASSIS_SPECS[transmission.value][chassis.value]?.gears ?? [0, 0, 0, 0, 0]).map(newGearConfig))
  const finalDrive = ref(TRANSMISSION_CHASSIS_SPECS[transmission.value][chassis.value]?.finalDrive ?? 0)

  const updateGear = (gearIndex: number, ev: SlInputEvent) => {
    if (!isSLInput(ev.target)) {
      throw new Error(`No target for updateGear(gearIndex: ${gearIndex})`);
    }
    const gear = gears.value[gearIndex]
    gear.ratio = ev.target.valueAsNumber
    gear.modified ||= true
  }
  const validateGear = (gearIndex: number, ev: SlBlurEvent) => {
    if (!isSLInput(ev.target)) {
      throw new Error(`No target for validateGear(gearIndex: ${gearIndex})`);
    }

    const gear = gears.value[gearIndex]
    if (gear.ratio < 0) {
      gear.ratio = 0
      ev.target.value = "0"
    }
    if (gear.ratio > 10) {
      gear.ratio = 10
      ev.target.value = "10"
    }
  }
  const resetGear = (gearIndex: number) => {
    const gear = gears.value[gearIndex];
    gear.ratio = gear.stockRatio;
    gear.modified = false;
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

  const gearLines = computed<GearLine[]>(() => {
    const redline = maxRPM.value
    const fd = finalDrive.value
    const td = overallTireDiameter.value

    const lines: GearLine[] = gears.value.map((g, i) => {
      const startMPH = i > 0
        ? maxMPHForGear({ gearRatio: gears.value[i - 1].ratio, finalDrive: fd, maxRPM: redline, tireDiameter: td })
        : 0;
      const startRPM = i > 0
        ? rpmForGearAtMPH({ gearRatio: g.ratio, finalDrive: fd, mph: startMPH, tireDiameter: td })
        : 0;
      const endMPH = maxMPHForGear({ gearRatio: g.ratio, finalDrive: fd, maxRPM: redline, tireDiameter: td })
      const endRPM = redline

      return [
        { x: startMPH, y: Math.round(startRPM) },
        { x: endMPH, y: Math.round(endRPM) }
      ]
    })

    return lines
  })
</script>

<template>
  <!-- On large displays inputs will be on left, graph on right. -->
  <!-- On small displays inputs will be on top, graph on bottom -->
  <div id="foo" class="fr">
    <div id="calculator-form" class="fc">
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
      <sl-input type="number" inputmode="numeric" :step="100" :value="maxRPM" @sl-input="updateMaxRPM"
        @sl-blur="validateMaxRPM"></sl-input>

      <strong title="When VTEC kicks in yo">VTEC Crossover</strong>
      <div class="fr">
        <sl-checkbox class="mr10px" :checked="vtecEnabled" @sl-change="updateVtecEnabled">VTEC enabled</sl-checkbox>
        <sl-input class="fg1" type="number" inputmode="numeric" :step="100" :value="vtecCrossover"
          @sl-input="updateVTECCrossover" @sl-blur="validateVTECCrossover" :disabled="!vtecEnabled"></sl-input>
      </div>
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
        <div class="fr">
          <div class="fr fg1">
            <strong class="gear-column">Gear</strong>
            <strong class="gear-column">Ratio</strong>
          </div>

          <strong class="gear-column">Max MPH</strong>
        </div>

        <div class="fr mb1" v-for="(gear, index) in gears">
          <div class="fr fg1">
            <div class="gear-column">
              <span>[[ GEAR_LABELS[index] ]]</span>
              <span v-if="gear.modified" :title="`Gear was changed. Stock ratio is ${gear.stockRatio}`">*</span>
            </div>
            <sl-input class="gear-column" type="number" step="0.001" inputmode="numeric" :value="gears[index].ratio"
              @sl-input="(ev: SlInputEvent) => updateGear(index, ev)"
              @sl-blur="(ev: SlBlurEvent) => validateGear(index, ev)"></sl-input>
            <Reset v-if="gear.modified" @click="() => resetGear(index)"></Reset>
          </div>

          <sl-input class="gear-column"
            :value="maxMPHForGear({ gearRatio: gear.ratio, finalDrive, maxRPM, tireDiameter: overallTireDiameter }).toFixed(2)"
            readonly></sl-input>
        </div>

        <div class="fr">
          <div class="fr fg1">
            <span class="gear-column">Final drive</span>
            <sl-input class="gear-column" type="number" step="0.01" inputmode="numeric" :value="finalDrive"
              @sl-input="updateFinalDrive" @sl-blur="validateFinalDrive"></sl-input>
            <Reset @click="() => { console.log('ffff') }"></Reset>
          </div>

          <div class=" gear-column">&nbsp;
          </div>
        </div>
        <sl-divider></sl-divider>
      </div>
    </div>

    <div class="fg1">
      <GearChart :gears="gearLines" :maxRPM="maxRPM" :vtecCrossover="vtecCrossover" :vtec-enabled="vtecEnabled" />
    </div>
  </div>
</template>

<style lang="sass" scoped>
  #calculator-form
    min-width: 320px

  .gear-column
    width: 80px

  .mr10px
    margin-right: 10px 

</style>
