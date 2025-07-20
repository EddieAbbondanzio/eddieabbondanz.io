export function maxMPHForGear(values: {
  gearRatio: number;
  finalDrive: number;
  maxRPM: number;
  tireDiameter: number;
}): number {
  const { maxRPM, gearRatio, finalDrive, tireDiameter } = values;
  return (maxRPM * tireDiameter) / (gearRatio * finalDrive * 336);
}

export function rpmForGearAtMPH(values: {
  gearRatio: number;
  finalDrive: number;
  mph: number;
  tireDiameter: number;
}): number {
  const { mph, gearRatio, finalDrive, tireDiameter } = values;
  return (mph * gearRatio * finalDrive * 336) / tireDiameter;
}
