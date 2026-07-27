import type { UnitSystem } from "./types";

/** Keep metric internally for BMR math; convert only at the edges of the UI. */

export const KG_PER_LB = 0.45359237;
export const CM_PER_IN = 2.54;

export function kgToLb(kg: number) {
  return kg / KG_PER_LB;
}
export function lbToKg(lb: number) {
  return lb * KG_PER_LB;
}
export function cmToIn(cm: number) {
  return cm / CM_PER_IN;
}
export function inToCm(inches: number) {
  return inches * CM_PER_IN;
}

export function cmToFeetInches(cm: number): { feet: number; inches: number } {
  const total = Math.round(cmToIn(cm));
  const feet = Math.floor(total / 12);
  const inches = total % 12;
  return { feet, inches };
}

export function feetInchesToCm(feet: number, inches: number) {
  return inToCm(feet * 12 + inches);
}

export function formatWeight(kg: number, units: UnitSystem, digits = 0): string {
  if (units === "imperial") {
    return `${kgToLb(kg).toFixed(digits)} lb`;
  }
  return `${kg.toFixed(digits)} kg`;
}

export function formatHeight(cm: number, units: UnitSystem): string {
  if (units === "imperial") {
    const { feet, inches } = cmToFeetInches(cm);
    return `${feet}'${inches}"`;
  }
  return `${Math.round(cm)} cm`;
}

/** Pace label for onboarding — ~0.5 lb/wk or ~0.25 kg/wk style. */
export function pacePerWeekLabel(units: UnitSystem): Record<"gentle" | "steady" | "focused", string> {
  if (units === "imperial") {
    return {
      gentle: "~0.5 lb / week",
      steady: "~1 lb / week",
      focused: "~1.5 lb / week",
    };
  }
  return {
    gentle: "~0.25 kg / week",
    steady: "~0.5 kg / week",
    focused: "~0.75 kg / week",
  };
}

export function roundWeightForDisplay(kg: number, units: UnitSystem) {
  if (units === "imperial") return Math.round(kgToLb(kg));
  return Math.round(kg);
}

export function roundHeightForDisplay(cm: number, units: UnitSystem) {
  if (units === "imperial") return Math.round(cmToIn(cm)); // total inches
  return Math.round(cm);
}
