export interface GradientStop {
  position: number; // 0–100
  color: string;
}

export interface GradientStep {
  label: string;
  value: string;
  stops: GradientStop[];
}

export interface GradientScaleOptions {
  fromColor: string;
  toColor: string;
  steps: number;
  direction?: string;
  midColor?: string;
}

export function roundTo(value: number, decimals = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

export function stepLabel(index: number, total: number): string {
  const value = Math.round((index / (total - 1)) * 900 + 100);
  return String(value);
}

export function buildStopValue(stops: GradientStop[]): string {
  return stops
    .map((s) => `${s.color} ${roundTo(s.position)}%`)
    .join(', ');
}

export function generateGradientScale(
  options: GradientScaleOptions
): GradientStep[] {
  const {
    fromColor,
    toColor,
    steps,
    direction = 'to bottom',
    midColor,
  } = options;

  if (steps < 2) {
    throw new Error('Gradient scale requires at least 2 steps.');
  }

  const scale: GradientStep[] = [];

  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const label = stepLabel(i, steps);

    let stops: GradientStop[];

    if (midColor) {
      stops = [
        { position: 0, color: fromColor },
        { position: roundTo(50 + (t - 0.5) * 50, 1), color: midColor },
        { position: 100, color: toColor },
      ];
    } else {
      stops = [
        { position: 0, color: fromColor },
        { position: 100, color: toColor },
      ];
    }

    const value = `linear-gradient(${direction}, ${buildStopValue(stops)})`;
    scale.push({ label, value, stops });
  }

  return scale;
}
