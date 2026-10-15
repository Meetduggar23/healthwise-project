/**
 * Pure health-calculator functions (educational estimates, not diagnoses).
 * No DOM/React dependencies so they can be unit-tested.
 */

export interface BmiResult {
  bmi: number;
  category: string;
}

export function calcBmi(weightKg: number, heightCm: number): BmiResult {
  if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm) || weightKg <= 0 || heightCm <= 0) {
    throw new Error("Please enter a valid weight and height.");
  }
  if (weightKg > 500 || heightCm < 50 || heightCm > 250) {
    throw new Error("Those values look out of range. Please check and try again.");
  }
  const bmi = weightKg / Math.pow(heightCm / 100, 2);
  const rounded = Math.round(bmi * 10) / 10;
  const category =
    rounded < 18.5 ? "Underweight" : rounded < 25 ? "Healthy range" : rounded < 30 ? "Overweight" : "Obese range";
  return { bmi: rounded, category };
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
}

export function calcAge(dobIso: string, todayIso?: string): AgeResult {
  const dob = new Date(`${dobIso}T00:00:00`);
  const today = todayIso ? new Date(`${todayIso}T00:00:00`) : new Date();
  if (Number.isNaN(dob.getTime()) || Number.isNaN(today.getTime())) {
    throw new Error("Please choose a valid date of birth.");
  }
  if (dob > today) throw new Error("Date of birth cannot be in the future.");
  let years = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth() - dob.getMonth();
  let days = today.getDate() - dob.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export interface HydrationResult {
  litresMin: number;
  litresMax: number;
  glasses: string;
}

/** Rough daily fluid guidance: ~35 ml/kg plus ~350 ml per 30 min of exercise. */
export function hydrationGuide(weightKg: number, exerciseMinPerDay: number): HydrationResult {
  if (!Number.isFinite(weightKg) || weightKg <= 0 || weightKg > 300) {
    throw new Error("Please enter a valid weight.");
  }
  if (!Number.isFinite(exerciseMinPerDay) || exerciseMinPerDay < 0 || exerciseMinPerDay > 600) {
    throw new Error("Please enter valid daily exercise minutes (0–600).");
  }
  const base = (weightKg * 35) / 1000;
  const extra = (exerciseMinPerDay / 30) * 0.35;
  const round = (n: number) => Math.round(n * 10) / 10;
  const litresMin = round(base + extra);
  const litresMax = round(base + extra + 0.5);
  const glasses = `${Math.round(litresMin * 4)}–${Math.round(litresMax * 4)} glasses (250 ml)`;
  return { litresMin, litresMax, glasses };
}
