export function maxMPHForGear(
  gearRatio: number,
  finalDrive: number,
  maxRPM: number,
  tireDiameter: number,
): number {
  return (maxRPM * tireDiameter) / (gearRatio * finalDrive * 336);
}

export function rpmForGearAtMPH(
  gearRatio: number,
  finalDrive: number,
  mph: number,
  tireDiameter: number,
): number {
  return (mph * gearRatio * finalDrive * 336) / tireDiameter;
}
