<script setup lang="ts">
// Shoelace must be imported / setBasePathed in every web component since we use 
// them as root files to compile.
import '@shoelace-style/shoelace';
import '@shoelace-style/shoelace/dist/themes/light.css';
import { setBasePath } from '@shoelace-style/shoelace';
// Hugo auto resolve's the /static sub-dir so we omit it in the path
if (import.meta.env.MODE === "production") {
  setBasePath("../../../shoelace")
}

import { computed, ref } from 'vue';
import { Chassis, CHASSIS_LABEL, Transmission, TRANSMISSION_CHASSIS_SPECS } from '@/components/b-series-gear-calculator/hondaTransmissions';
import { objectKeys } from '@/utils';


const availableTireWidths = [175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275];
const availableTireRatios = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
const availableTireDiameters = [13, 14, 15, 16, 17, 18];

const tireWidth = ref(205);
const tireRatio = ref(50);
const tireDiameter = ref(15);

const onTireWidthChange = (v: any) => tireWidth.value = Number(v.target.value);
const onRatioChange = (v: any) => tireRatio.value = Number(v.target.value);
const onDiameterChange = (v: any) => tireDiameter.value = Number(v.target.value);

const overallTireDiameter = computed(() => {
  const raw = (2 * (tireWidth.value * tireRatio.value / 100) / 25.4) + tireDiameter.value;
  return `${raw.toFixed(2)}"`;
});

const transmissionCode = ref(Transmission.S80)
const chassisCode = ref(objectKeys(TRANSMISSION_CHASSIS_SPECS[transmissionCode.value])[0])

const availableTransmissionCodes = objectKeys(Transmission)
const availableChassisCodes = computed(() => {
  const chassisCodes = objectKeys(TRANSMISSION_CHASSIS_SPECS[transmissionCode.value])
  let available: Partial<Record<Chassis, string>> = {}
  chassisCodes.forEach(value => {
    available[value] = CHASSIS_LABEL[value];
  })

  return available
})

const onTransmissionCodeChange = (v: any) => {
  transmissionCode.value = v.target.value

  // Default chassis code to first option
  chassisCode.value = objectKeys(TRANSMISSION_CHASSIS_SPECS[transmissionCode.value])[0]
}
const onChassisCodeChange = (v: any) => chassisCode.value = v.target.value;

const gearRatios = computed(() => {
  return structuredClone(TRANSMISSION_CHASSIS_SPECS[transmissionCode.value][chassisCode.value])
})


const bar = "value-from-the-script!"
</script>

<template>
  <!-- On large displays inputs will be on left, graph on right. -->
  <!-- On small displays inputs will be on top, graph on bottom -->
  <div id="foo" class="fr red-and-blue">
    <div class="fc">
      <strong>Tire size <small>([[overallTireDiameter]])</small></strong>
      <div class="fr">
        <sl-select placeholder="Width" class="pr2" :value="tireWidth.toString()" @sl-change="onTireWidthChange">
          <sl-option v-for="w in availableTireWidths" :value="w">[[w]]</sl-option>
        </sl-select>

        <sl-select placeholder="Ratio" class="pr2" :value="tireRatio.toString()" @sl-change="onRatioChange">
          <sl-option v-for="r in availableTireRatios" :value="r">[[r]]</sl-option>
        </sl-select>

        <sl-select placeholder="Diameter" :value="tireDiameter.toString()" @sl-change="onDiameterChange">
          <sl-option v-for="d in availableTireDiameters" :value="d">[[d]]</sl-option>
        </sl-select>
      </div>

      <strong>Redline</strong>
      <sl-input value="7000"></sl-input>
      <sl-divider></sl-divider>

      <strong>Transmission code</strong>
      <sl-select :value="transmissionCode" @sl-change="onTransmissionCodeChange">
        <sl-option v-for="(value, label) in availableTransmissionCodes" :value="value">[[label]]</sl-option>
      </sl-select>

      <strong class="fr aic">
        <span class="pr1">Chassis</span>
        <sl-tooltip class="tooltip" hoist content="The chassis that the transmission came from"><sl-icon
            name="question-circle-fill"></sl-icon></sl-tooltip></strong>
      <sl-select :value="chassisCode" @sl-change="onChassisCodeChange">
        <sl-option v-for="(humanReadableChassisCode, chassisCode) in availableChassisCodes"
          :value="chassisCode">[[humanReadableChassisCode]]</sl-option>
      </sl-select>

      <strong>Gears</strong>
      <div class="fr jcsb">
        <span>1st</span>
        <sl-input :value="gearRatios?.gears[0]"></sl-input>
      </div>

      <div class="fr jcsb">
        <span>2nd</span>
        <sl-input :value="gearRatios?.gears[1]"></sl-input>
      </div>

      <div class="fr jcsb">
        <span>3rd</span>
        <sl-input :value="gearRatios?.gears[2]"></sl-input>
      </div>

      <div class="fr jcsb">
        <span>4th</span>
        <sl-input :value="gearRatios?.gears[3]"></sl-input>
      </div>

      <div class="fr jcsb">
        <span>5th</span>
        <sl-input :value="gearRatios?.gears[4]"></sl-input>
      </div>

      <div class="fr jcsb">
        <span>Final drive</span>
        <sl-input :value="gearRatios?.finalDrive"></sl-input>
      </div>
      <sl-divider></sl-divider>
    </div>
  </div>
</template>

<style lang="sass" scoped>
</style>
