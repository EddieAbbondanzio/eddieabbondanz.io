
<script setup lang="ts">
// Shoelace must be imported / setBasePathed in every web component since we use 
// them as root files to compile.
import '@shoelace-style/shoelace';
import '@shoelace-style/shoelace/dist/themes/light.css';
import { setBasePath } from '@shoelace-style/shoelace';
setBasePath("../../../shoelace")

const TRANSMISSION_CODE = {
    S80: 's80',
    Y21: 'y21',
    S21: 's21',
    S4C: 's4c',
    Y80: 'y80',
    YS1: 'ys1',
    Y1: 'y1',
    S1: 's1',
    J1: 'j1',
  };

  const CHASSIS = {
    USDM_94_95_DELSOL: "usdm_94_95_delsol",
    USDM_95_97_DELSOL: "usdm_95_97_delsol",
    USDM_99_01_CIVIC_SI: "usdm_99_01_civic_si",
    USDM_92_93_GSR: "usdm_92_93_gsr",
    USDM_94_01_GSR: "usdm_94_01_gsr",
    USDM_90_93_INTEGRA_RS_LS_GS_SE: "usdm_90_93_integra_rs_ls_gs_se",
    USDM_94_01_LS_GS_SE: "usdm_94_01_ls_gs_se",
    USDM_97_01_ITR: "usdm_97_01_itr",
    JDM_89_91_CIVIC_CRX_SIR: "jdm_89_91_civic_crx_sir",
    JDM_90_91_INTEGRA_RSI_XSI: "jdm_90_91_integra_rsi_xsi",
    JDM_92_93_INTEGRA_RSI_XSI: "jdm_92_93_integra_rsi_xsi",
    JDM_93_5_01_SIR_SIG: "jdm_93.5_01_sir_sig",
    JDM_92_00_SIR_CTR: "jdm_92_00_sir_ctr",
    JDM_95_97_ITR: "jdm_95_97_itr",
    JDM_98_01_ITR: "jdm-98-01-itr",
  };

  const CHASSIS_LABEL = {
    [CHASSIS.USDM_94_95_DELSOL]: "US 94-95 Del Sol",
    [CHASSIS.USDM_95_97_DELSOL]: "US 95-97 Del Sol",
    [CHASSIS.USDM_99_01_CIVIC_SI]: "US 99-01 Civic SI",
    [CHASSIS.USDM_92_93_GSR]: "US 92-93 Integra GSR",
    [CHASSIS.USDM_94_01_GSR]: "US 94-01 Integra GSR",
    [CHASSIS.USDM_90_93_INTEGRA_RS_LS_GS_SE]: "US 90-93 Integra RS/LS/GS/SE",
    [CHASSIS.USDM_94_01_LS_GS_SE]: "US 94-01 Integra LS/GS/SE",
    [CHASSIS.USDM_97_01_ITR]: "US 97-01 Integra Type R",
    [CHASSIS.JDM_89_91_CIVIC_CRX_SIR]: "JDM 89-91 Civic SIR / CRX SIR",
    [CHASSIS.JDM_90_91_INTEGRA_RSI_XSI]: "JDM 90-91 Integra RSI/XSI",
    [CHASSIS.JDM_92_93_INTEGRA_RSI_XSI]: "JDM 92-93 Integra RSI/XSI",
    [CHASSIS.JDM_93_5_01_SIR_SIG]: "JDM 93.5-01 Civic SIR/SIG",
    [CHASSIS.JDM_92_00_SIR_CTR]: "JDM 92-00 Civic SIR/Type R",
    [CHASSIS.JDM_95_97_ITR]: "JDM 95-97 Integra Type R",
    [CHASSIS.JDM_98_01_ITR]: "JDM 98-01 Integra Type R",
  }

  const TRANSMISSION_CHASSIS_SPECS = {
    [TRANSMISSION_CODE.S80]: {
      [CHASSIS.JDM_93_5_01_SIR_SIG]: {
        gears: [3.23, 1.9, 1.36, 1.034, 0.787],
        finalDrive: 4.4,
        clutchType: 'hydro'
      },
      [CHASSIS.JDM_95_97_ITR]: {
        gears: [3.23, 2.105, 1.458, 1.107, 0.848],
        finalDrive: 4.4,
        clutchType: 'hydro'
      },
      [CHASSIS.JDM_98_01_ITR]: {
        gears: [3.23, 2.105, 1.458, 1.034, 0.787],
        finalDrive: 4.785,
        clutchType: 'hydro'
      },
      [CHASSIS.USDM_94_01_LS_GS_SE]: {
        gear: [3.23, 1.9, 1.269, 0.966, .787],
        finalDrive: 4.266,
        clutchType: 'hydro'
      },
      [CHASSIS.USDM_94_01_GSR]: {
        gears: [3.23, 1.9, 1.36, 1.034, 0.787],
        finalDrive: 4.4,
        clutchType: 'hydro'
      },
      [CHASSIS.USDM_97_01_ITR]: {
        gears: [3.23, 2.105, 1.458, 1.107, 0.848],
        finalDrive: 4.4,
        clutchType: 'hydro'
      }
    },
    [TRANSMISSION_CODE.Y21]: {
      [CHASSIS.USDM_94_95_DELSOL]: {
        gear: [3.23, 2.105, 1.458, 1.107, 0.848],
        finalDrive: 4.4,
        clutchType: 'hydro'
      },
    },
    [TRANSMISSION_CODE.S21]: {
      [CHASSIS.USDM_95_97_DELSOL]: {
        gear: [3.23, 2.105, 1.458, 1.107, 0.848],
        finalDrive: 4.4,
        clutchType: 'hydro'
      },
    },
    [TRANSMISSION_CODE.S4C]: {
      [CHASSIS.USDM_99_01_CIVIC_SI]: {
        gear: [3.23, 2.105, 1.458, 1.107, 0.875],
        finalDrive: 4.266,
        clutchType: 'hydro'
      }
    },
    [TRANSMISSION_CODE.Y80]: {
      [CHASSIS.JDM_93_5_01_SIR_SIG]: {
        gears: [3.23, 1.9, 1.36, 1.034, 0.787],
        finalDrive: 4.4,
        clutchType: 'hydro'
      },
      [CHASSIS.JDM_95_97_ITR]: {
        gears: [3.23, 2.105, 1.458, 1.107, 0.848],
        finalDrive: 4.4,
        clutchType: 'hydro'
      },
      [CHASSIS.JDM_92_00_SIR_CTR]: {
        gears: [3.23, 2.105, 1.458, 1.107, 0.848],
        finalDrive: 4.4,
        clutchType: 'hydro'
      },
      [CHASSIS.USDM_94_01_GSR]: {
        gears: [3.23, 1.9, 1.36, 1.034, 0.787],
        finalDrive: 4.4,
        clutchType: 'hydro'
      },
      [CHASSIS.USDM_97_01_ITR]: {
        gears: [3.23, 2.105, 1.458, 1.107, 0.848],
        finalDrive: 4.4,
        clutchType: 'hydro'
      }
    },
    [TRANSMISSION_CODE.YS1]: {
      [CHASSIS.JDM_92_93_INTEGRA_RSI_XSI]: {
        gears: [3.307, 2.105, 1.459, 1.107, 0.875],
        finalDrive: 4.4,
        clutchType: 'cable'
      },
      [CHASSIS.USDM_92_93_GSR]: {
        gears: [3.307, 2.105, 1.459, 1.107, 0.875],
        finalDrive: 4.4,
        clutchType: 'cable'
      },
      [CHASSIS.USDM_90_93_INTEGRA_RS_LS_GS_SE]: {
        gears: [3.23, 1.9, 1.269, 0.966, 0.742],
        finalDrive: 4.4,
        clutchType: 'cable'
      },
    },
    [TRANSMISSION_CODE.Y1]: {
      [CHASSIS.JDM_89_91_CIVIC_CRX_SIR]: {
        gears: [3.166, 2.052, 1.416, 1.103, 0.870],
        finalDrive: 4.266,
        clutchType: 'cable'
      }
    },
    [TRANSMISSION_CODE.S1]: {
      [CHASSIS.JDM_90_91_INTEGRA_RSI_XSI]: {
        gears: [3.230, 2.105, 1.458, 1.107, 0.848],
        finalDrive: 4.4,
        clutchType: 'cable'
      },
      [CHASSIS.USDM_90_93_INTEGRA_RS_LS_GS_SE]: {
        gears: [3.230, 1.9, 1.269, 0.966, 0.742],
        finalDrive: 4.266,
        clutchType: 'cable'
      }
    },
    [TRANSMISSION_CODE.J1]: {
      [CHASSIS.JDM_90_91_INTEGRA_RSI_XSI]: {
        gears: [3.230, 2.105, 1.458, 1.107, 0.848],
        finalDrive: 4.4,
        clutchType: 'cable'
      }
    }
  };

//   const { createApp, ref, computed } = Vue;
//   const app = createApp({
//     delimiters: ["[[", "]]"],
//     setup() {
//       const availableTireWidths = [175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275];
//       const availableTireRatios = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80];
//       const availableTireDiameters = [13, 14, 15, 16, 17, 18];

//       const tireWidth = ref(205);
//       const tireRatio = ref(50);
//       const tireDiameter = ref(15);

//       const onTireWidthChange = (v) => tireWidth.value = Number(v.target.value);
//       const onRatioChange = (v) => tireRatio.value = Number(v.target.value);
//       const onDiameterChange = (v) => tireDiameter.value = Number(v.target.value);

//       const overallTireDiameter = computed(() => {
//         const raw = (2 * (tireWidth.value * tireRatio.value / 100) / 25.4) + tireDiameter.value;
//         return `${raw.toFixed(2)}"`;
//       });

//       const transmissionCode = ref(TRANSMISSION_CODE.S80)
//       const chassisCode = ref(Object.keys(TRANSMISSION_CHASSIS_SPECS[transmissionCode.value])[0])

//       const availableChassisCodes = computed(() => {
//         const values = Object.keys(TRANSMISSION_CHASSIS_SPECS[transmissionCode.value])
//         let available = {}
//         values.forEach(value => {
//           available[value] = CHASSIS_LABEL[value];
//         })

//         return available
//       })

//       const onTransmissionCodeChange = (v) => {
//         transmissionCode.value = v.target.value

//         // Default chassis code to first option
//         chassisCode.value = Object.keys(TRANSMISSION_CHASSIS_SPECS[transmissionCode.value])[0]
//       }
//       const onChassisCodeChange = (v) => chassisCode.value = v.target.value;

//       const gearRatios = computed(() => {
//         return structuredClone(TRANSMISSION_CHASSIS_SPECS[transmissionCode.value][chassisCode.value])
//       })

//       return {
//         availableTireWidths,
//         availableTireRatios,
//         availableTireDiameters,
//         tireWidth,
//         tireRatio,
//         tireDiameter,
//         overallTireDiameter,
//         onTireWidthChange,
//         onRatioChange,
//         onDiameterChange,
//         availableTransmissionCodes: TRANSMISSION_CODE,
//         transmissionCode,
//         availableChassisCodes,
//         chassisCode,
//         onTransmissionCodeChange,
//         onChassisCodeChange,
//         gearRatios
//       };
//     },
//     template: `
//       <!-- On large displays inputs will be on left, graph on right. -->
//       <!-- On small displays inputs will be on top, graph on bottom -->
//       <div class="fr">
//         <div class="fc">
//           <strong>Tire size <small>([[overallTireDiameter]])</small></strong>
//           <div class="fr">
//             <sl-select placeholder="Width" class="pr2" :value="tireWidth.toString()" @sl-change="onTireWidthChange">
//               <sl-option v-for="w in availableTireWidths" :value="w">[[w]]</sl-option>
//             </sl-select>

//             <sl-select placeholder="Ratio" class="pr2" :value="tireRatio.toString()" @sl-change="onRatioChange">
//               <sl-option v-for="r in availableTireRatios" :value="r">[[r]]</sl-option>
//             </sl-select>

//             <sl-select placeholder="Diameter" :value="tireDiameter.toString()" @sl-change="onDiameterChange">
//               <sl-option v-for="d in availableTireDiameters" :value="d">[[d]]</sl-option>
//             </sl-select>
//           </div>

//           <strong>Redline</strong>
//           <sl-input value="7000"></sl-input>
//           <sl-divider></sl-divider>

//           <strong>Transmission code</strong>
//           <sl-select :value="transmissionCode" @sl-change="onTransmissionCodeChange">
//             <sl-option v-for="(value, label) in availableTransmissionCodes" :value="value">[[label]]</sl-option>
//           </sl-select>

//           <strong class="fr aic">
//             <span class="pr1">Chassis</span>
//             <sl-tooltip class="tooltip" hoist content="The chassis that the transmission came from"><sl-icon name="question-circle-fill"></sl-icon></sl-tooltip></strong>
//           <sl-select :value="chassisCode" @sl-change="onChassisCodeChange">
//             <sl-option v-for="(humanReadableChassisCode, chassisCode) in availableChassisCodes" :value="chassisCode">[[humanReadableChassisCode]]</sl-option>  
//           </sl-select>

//           <strong>Gears</strong>
//           <div class="fr jcsb">
//             <span>1st</span>
//             <sl-input :value="gearRatios.gears[0]"></sl-input>
//           </div>

//           <div class="fr jcsb">
//             <span>2nd</span>
//             <sl-input :value="gearRatios.gears[1]"></sl-input>
//           </div>

//           <div class="fr jcsb">
//             <span>3rd</span>
//             <sl-input :value="gearRatios.gears[2]"></sl-input>
//           </div>

//           <div class="fr jcsb">
//             <span>4th</span>
//             <sl-input :value="gearRatios.gears[3]"></sl-input>
//           </div>

//           <div class="fr jcsb">
//             <span>5th</span>
//             <sl-input :value="gearRatios.gears[4]"></sl-input>
//           </div>

//           <div class="fr jcsb">
//             <span>Final drive</span>
//             <sl-input  :value="gearRatios.finalDrive"></sl-input>
//           </div>
//           <sl-divider></sl-divider>
//         </div>
//       </div>
//     `
//   });

  // Tell Vue about Shoelace web comps.
  // app.config.compilerOptions.isCustomElement = (tag) => tag.startsWith("sl-");
  // app.mount('#b-series-gear-calculator');
</script>

<template>
<h1>B-Series Gear Calculator Thingy</h1>

SL!
<div style="color: #4a90e2;">
  <sl-icon name="exclamation-triangle"></sl-icon>
  <sl-icon name="archive"></sl-icon>
  <sl-icon name="battery-charging"></sl-icon>
  <sl-icon name="bell"></sl-icon>

  dropdown!
  <sl-select>
  <sl-option value="option-1">Option 1</sl-option>
  <sl-option value="option-2">Option 2</sl-option>
  <sl-option value="option-3">Option 3</sl-option>
  <sl-option value="option-4">Option 4</sl-option>
  <sl-option value="option-5">Option 5</sl-option>
  <sl-option value="option-6">Option 6</sl-option>
</sl-select>
</div>

</template>

