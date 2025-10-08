import { signal } from '@preact/signals';

/**
 * adReloadSignal - Global signal to trigger ad reloads
 * @type {import('@preact/signals').Signal<number>}
 */
export const adReloadSignal = signal(0);

/**
 * triggerAdReload - Function to trigger ad reload by updating signal with timestamp
 */
export function triggerAdReload() {
    adReloadSignal.value = Date.now();
}