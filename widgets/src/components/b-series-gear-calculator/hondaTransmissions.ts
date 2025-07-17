export enum Transmission {
  S80 = 's80',
  Y21 = 'y21',
  S21 = 's21',
  S4C = 's4c',
  Y80 = 'y80',
  YS1 = 'ys1',
  Y1 = 'y1',
  S1 = 's1',
  J1 = 'j1',
}

export enum Chassis {
  USDM_94_95_DELSOL = 'usdm_94_95_delsol',
  USDM_95_97_DELSOL = 'usdm_95_97_delsol',
  USDM_99_01_CIVIC_SI = 'usdm_99_01_civic_si',
  USDM_92_93_GSR = 'usdm_92_93_gsr',
  USDM_94_01_GSR = 'usdm_94_01_gsr',
  USDM_90_93_INTEGRA_RS_LS_GS_SE = 'usdm_90_93_integra_rs_ls_gs_se',
  USDM_94_01_LS_GS_SE = 'usdm_94_01_ls_gs_se',
  USDM_97_01_ITR = 'usdm_97_01_itr',
  JDM_89_91_CIVIC_CRX_SIR = 'jdm_89_91_civic_crx_sir',
  JDM_90_91_INTEGRA_RSI_XSI = 'jdm_90_91_integra_rsi_xsi',
  JDM_92_93_INTEGRA_RSI_XSI = 'jdm_92_93_integra_rsi_xsi',
  JDM_93_5_01_SIR_SIG = 'jdm_93.5_01_sir_sig',
  JDM_92_00_SIR_CTR = 'jdm_92_00_sir_ctr',
  JDM_95_97_ITR = 'jdm_95_97_itr',
  JDM_98_01_ITR = 'jdm-98-01-itr',
}

export const CHASSIS_LABEL: Record<Chassis, string> = {
  [Chassis.USDM_94_95_DELSOL]: 'US 94-95 Del Sol',
  [Chassis.USDM_95_97_DELSOL]: 'US 95-97 Del Sol',
  [Chassis.USDM_99_01_CIVIC_SI]: 'US 99-01 Civic SI',
  [Chassis.USDM_92_93_GSR]: 'US 92-93 Integra GSR',
  [Chassis.USDM_94_01_GSR]: 'US 94-01 Integra GSR',
  [Chassis.USDM_90_93_INTEGRA_RS_LS_GS_SE]: 'US 90-93 Integra RS/LS/GS/SE',
  [Chassis.USDM_94_01_LS_GS_SE]: 'US 94-01 Integra LS/GS/SE',
  [Chassis.USDM_97_01_ITR]: 'US 97-01 Integra Type R',
  [Chassis.JDM_89_91_CIVIC_CRX_SIR]: 'JDM 89-91 Civic SIR / CRX SIR',
  [Chassis.JDM_90_91_INTEGRA_RSI_XSI]: 'JDM 90-91 Integra RSI/XSI',
  [Chassis.JDM_92_93_INTEGRA_RSI_XSI]: 'JDM 92-93 Integra RSI/XSI',
  [Chassis.JDM_93_5_01_SIR_SIG]: 'JDM 93.5-01 Civic SIR/SIG',
  [Chassis.JDM_92_00_SIR_CTR]: 'JDM 92-00 Civic SIR/Type R',
  [Chassis.JDM_95_97_ITR]: 'JDM 95-97 Integra Type R',
  [Chassis.JDM_98_01_ITR]: 'JDM 98-01 Integra Type R',
}

type ClutchType = 'hydro' | 'cable'

interface TransmissionConfig {
  gears: [number, number, number, number, number]
  finalDrive: number
  clutchType: ClutchType
}

export const TRANSMISSION_CHASSIS_SPECS: Record<
  Transmission,
  Partial<Record<Chassis, TransmissionConfig>>
> = {
  [Transmission.S80]: {
    [Chassis.JDM_93_5_01_SIR_SIG]: {
      gears: [3.23, 1.9, 1.36, 1.034, 0.787],
      finalDrive: 4.4,
      clutchType: 'hydro',
    },
    [Chassis.JDM_95_97_ITR]: {
      gears: [3.23, 2.105, 1.458, 1.107, 0.848],
      finalDrive: 4.4,
      clutchType: 'hydro',
    },
    [Chassis.JDM_98_01_ITR]: {
      gears: [3.23, 2.105, 1.458, 1.034, 0.787],
      finalDrive: 4.785,
      clutchType: 'hydro',
    },
    [Chassis.USDM_94_01_LS_GS_SE]: {
      gears: [3.23, 1.9, 1.269, 0.966, 0.787],
      finalDrive: 4.266,
      clutchType: 'hydro',
    },
    [Chassis.USDM_94_01_GSR]: {
      gears: [3.23, 1.9, 1.36, 1.034, 0.787],
      finalDrive: 4.4,
      clutchType: 'hydro',
    },
    [Chassis.USDM_97_01_ITR]: {
      gears: [3.23, 2.105, 1.458, 1.107, 0.848],
      finalDrive: 4.4,
      clutchType: 'hydro',
    },
  },
  [Transmission.Y21]: {
    [Chassis.USDM_94_95_DELSOL]: {
      gears: [3.23, 2.105, 1.458, 1.107, 0.848],
      finalDrive: 4.4,
      clutchType: 'hydro',
    },
  },
  [Transmission.S21]: {
    [Chassis.USDM_95_97_DELSOL]: {
      gears: [3.23, 2.105, 1.458, 1.107, 0.848],
      finalDrive: 4.4,
      clutchType: 'hydro',
    },
  },
  [Transmission.S4C]: {
    [Chassis.USDM_99_01_CIVIC_SI]: {
      gears: [3.23, 2.105, 1.458, 1.107, 0.875],
      finalDrive: 4.266,
      clutchType: 'hydro',
    },
  },
  [Transmission.Y80]: {
    [Chassis.JDM_93_5_01_SIR_SIG]: {
      gears: [3.23, 1.9, 1.36, 1.034, 0.787],
      finalDrive: 4.4,
      clutchType: 'hydro',
    },
    [Chassis.JDM_95_97_ITR]: {
      gears: [3.23, 2.105, 1.458, 1.107, 0.848],
      finalDrive: 4.4,
      clutchType: 'hydro',
    },
    [Chassis.JDM_92_00_SIR_CTR]: {
      gears: [3.23, 2.105, 1.458, 1.107, 0.848],
      finalDrive: 4.4,
      clutchType: 'hydro',
    },
    [Chassis.USDM_94_01_GSR]: {
      gears: [3.23, 1.9, 1.36, 1.034, 0.787],
      finalDrive: 4.4,
      clutchType: 'hydro',
    },
    [Chassis.USDM_97_01_ITR]: {
      gears: [3.23, 2.105, 1.458, 1.107, 0.848],
      finalDrive: 4.4,
      clutchType: 'hydro',
    },
  },
  [Transmission.YS1]: {
    [Chassis.JDM_92_93_INTEGRA_RSI_XSI]: {
      gears: [3.307, 2.105, 1.459, 1.107, 0.875],
      finalDrive: 4.4,
      clutchType: 'cable',
    },
    [Chassis.USDM_92_93_GSR]: {
      gears: [3.307, 2.105, 1.459, 1.107, 0.875],
      finalDrive: 4.4,
      clutchType: 'cable',
    },
    [Chassis.USDM_90_93_INTEGRA_RS_LS_GS_SE]: {
      gears: [3.23, 1.9, 1.269, 0.966, 0.742],
      finalDrive: 4.4,
      clutchType: 'cable',
    },
  },
  [Transmission.Y1]: {
    [Chassis.JDM_89_91_CIVIC_CRX_SIR]: {
      gears: [3.166, 2.052, 1.416, 1.103, 0.87],
      finalDrive: 4.266,
      clutchType: 'cable',
    },
  },
  [Transmission.S1]: {
    [Chassis.JDM_90_91_INTEGRA_RSI_XSI]: {
      gears: [3.23, 2.105, 1.458, 1.107, 0.848],
      finalDrive: 4.4,
      clutchType: 'cable',
    },
    [Chassis.USDM_90_93_INTEGRA_RS_LS_GS_SE]: {
      gears: [3.23, 1.9, 1.269, 0.966, 0.742],
      finalDrive: 4.266,
      clutchType: 'cable',
    },
  },
  [Transmission.J1]: {
    [Chassis.JDM_90_91_INTEGRA_RSI_XSI]: {
      gears: [3.23, 2.105, 1.458, 1.107, 0.848],
      finalDrive: 4.4,
      clutchType: 'cable',
    },
  },
}
