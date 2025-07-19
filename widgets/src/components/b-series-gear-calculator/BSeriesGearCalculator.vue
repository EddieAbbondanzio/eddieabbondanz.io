<script setup lang="ts">
  // Shoelace must be imported / setBasePathed in every root web component since we use
  // them as the entry points to compile from.
  import '@shoelace-style/shoelace';
  import '@shoelace-style/shoelace/dist/themes/light.css';
  import { setBasePath, SlInput, type SlBlurEvent, type SlInputEvent } from '@shoelace-style/shoelace';
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
  } from '@/components/b-series-gear-calculator/hondaTransmissions';
  import { inchesToMM, isSLInput, isSLSelect, objectEntries, objectKeys } from '@/utils';

  const availableTireWidths = [175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275];
  const availableTireRatios = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
  const availableTireDiameters = [13, 14, 15, 16, 17, 18];
  const tireWidth = ref(205);
  const tireRatio = ref(50);
  const tireDiameter = ref(15);
  const updateTireWidth = (ev: SlInputEvent) => {
    if (!isSLSelect(ev.target)) {
      throw new Error("No target for updateTireWidth");
    }
    tireWidth.value = Number(ev.target.value)
  }
  const updateTireRatio = (ev: SlInputEvent) => {
    if (!isSLSelect(ev.target)) {
      throw new Error("No target for updateTireRatio");
    }
    tireRatio.value = Number(ev.target.value)
  }
  const updateTireDiameter = (ev: SlInputEvent) => {
    if (!isSLSelect(ev.target)) {
      throw new Error("No target for updateTireDiameter");
    }
    tireDiameter.value = Number(ev.target.value)
  }

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

  const overallTireDiameter = computed(() => {
    const tireWidthInInches = inchesToMM(tireWidth.value);
    const sidewallHeight = tireWidthInInches * tireRatio.value / 100;
    const rimDiameter = tireDiameter.value;

    const overallDiameter = 2 * sidewallHeight + rimDiameter;
    return overallDiameter;
  });

  const transmissionCode = ref(Transmission.S80);
  const chassisCode = ref(objectKeys(TRANSMISSION_CHASSIS_SPECS[transmissionCode.value])[0]);

  const availableTransmissionCodes = computed(() => {
    const transmissions = objectEntries(Transmission);

    const transWithLabels: { transmission: Transmission; label: string }[] = [];
    for (const [label, transmission] of transmissions) {
      transWithLabels.push({ transmission, label });
    }
    return transWithLabels;
  });

  const onTransmissionCodeChange = (v: any) => {
    transmissionCode.value = v.target.value as Transmission;

    if (!availableChassisCodes.value.some(cc => cc.code === chassisCode.value)) {
      chassisCode.value = availableChassisCodes.value[0].code
    }
  };

  const availableChassisCodes = computed(() => {
    const chassisCodes = objectKeys(TRANSMISSION_CHASSIS_SPECS[transmissionCode.value]);

    const codesWithLabels: { code: Chassis; label: string }[] = [];
    for (const code of chassisCodes) {
      codesWithLabels.push({ code, label: CHASSIS_LABEL[code] });
    }

    return codesWithLabels;
  });

  const onChassisCodeChange = (v: any) => (chassisCode.value = v.target.value);


  const getGearRatio = (gear: number) => {
    return TRANSMISSION_CHASSIS_SPECS[transmissionCode.value][chassisCode.value]?.gears[gear]
  }
  const getFinalDrive = () => {
    return TRANSMISSION_CHASSIS_SPECS[transmissionCode.value][chassisCode.value]?.finalDrive
  }
  const getMaxMPH = (gear: number) => {
    const gearRatio = getGearRatio(gear);
    const finalRatio = getFinalDrive();
    const tireDiameter = overallTireDiameter.value
    const rpm = maxRPM.value

    if (gearRatio === undefined || finalRatio === undefined) return 0

    return (rpm * tireDiameter) / (gearRatio * finalRatio * 336)
  }
</script>

<template>
  <!-- On large displays inputs will be on left, graph on right. -->
  <!-- On small displays inputs will be on top, graph on bottom -->
  <div id="foo" class="fr red-and-blue">
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
      <sl-select :value="transmissionCode" @sl-change="onTransmissionCodeChange">
        <sl-option v-for="{ transmission, label } in availableTransmissionCodes"
          :value="transmission">[[label]]</sl-option>
      </sl-select>

      <strong class="fr aic">
        <span class="pr1">Chassis</span>
        <sl-tooltip class="tooltip" hoist content="The chassis that the transmission came from"><sl-icon
            name="question-circle-fill"></sl-icon></sl-tooltip></strong>
      <sl-select :value="chassisCode" @sl-change="onChassisCodeChange">
        <sl-option v-for="{ code, label } in availableChassisCodes" :value="code">[[label]]</sl-option>
      </sl-select>

      <div>
        <div class="fr jcsb">
          <strong class="fg1">Gears</strong>
          <strong class="ratio-input">Ratio</strong>
          <strong class="max-mph">Max MPH</strong>
        </div>

        <div class="fr">
          <span class="fg1">1st</span>
          <sl-input class="ratio-input" :value="getGearRatio(0)"></sl-input>
          <sl-input class="max-mph" :value="getMaxMPH(0).toFixed(2)" readonly></sl-input>
        </div>

        <div class="fr jcsb">
          <span class="fg1">2nd</span>
          <sl-input class="ratio-input" :value="getGearRatio(1)"></sl-input>
          <sl-input class="max-mph" :value="getMaxMPH(1).toFixed(2)" readonly></sl-input>
        </div>

        <div class="fr jcsb">
          <span class="fg1">3rd</span>
          <sl-input class="ratio-input" :value="getGearRatio(2)"></sl-input>
          <sl-input class="max-mph" :value="getMaxMPH(2).toFixed(2)" readonly></sl-input>
        </div>

        <div class="fr jcsb">
          <span class="fg1">4th</span>
          <sl-input class="ratio-input" :value="getGearRatio(3)"></sl-input>
          <sl-input class="max-mph" :value="getMaxMPH(3).toFixed(2)" readonly></sl-input>
        </div>

        <div class="fr jcsb">
          <span class="fg1">5th</span>
          <sl-input class="ratio-input" :value="getGearRatio(4)"></sl-input>
          <sl-input class="max-mph" :value="getMaxMPH(4).toFixed(2)" readonly></sl-input>
        </div>

        <div class="fr jcsb">
          <span class="fg1">Final drive</span>
          <sl-input class="ratio-input" :value="getFinalDrive()"></sl-input>
          <div class="spacer"></div>
        </div>
        <sl-divider></sl-divider>
      </div>
    </div>
  </div>
</template>

<style lang="sass" scoped>
  .ratio-input, .max-mph, .spacer
    width: 120px
</style>
