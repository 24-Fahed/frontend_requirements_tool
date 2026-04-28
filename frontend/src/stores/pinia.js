import { createPinia } from 'pinia'

/**
 * Shared Pinia instance used by both the host application document and the
 * simulator iframe document so they can operate on the same reactive stores.
 *
 * @type {import('pinia').Pinia}
 */
export const pinia = createPinia()
