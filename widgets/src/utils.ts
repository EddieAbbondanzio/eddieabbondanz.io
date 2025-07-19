import { SlInput, SlSelect } from '@shoelace-style/shoelace';

export function objectKeys<K extends string>(obj: Partial<Record<K, unknown>>): K[] {
  return Object.keys(obj) as K[];
}

export function objectEntries<K extends string, V>(obj: Partial<Record<K, V>>): [K, V][] {
  return Object.entries(obj) as [K, V][];
}

export function inchesToMM(inches: number): number {
  return inches / 25.4;
}

export function isSLInput(el: unknown | null | undefined): el is SlInput {
  return el !== null && el !== undefined && el instanceof SlInput;
}

export function isSLSelect(el: unknown | null | undefined): el is SlInput {
  return el !== null && el !== undefined && el instanceof SlSelect;
}
