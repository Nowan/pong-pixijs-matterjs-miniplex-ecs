export function clamp(value: number, lowerThreshold: number, upperThreshold: number) {
    return Math.min(Math.max(value, lowerThreshold), upperThreshold);
}
