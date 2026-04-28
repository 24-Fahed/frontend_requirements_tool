<script setup>
import { createApp } from 'vue'
import { onBeforeUnmount, ref } from 'vue'
import { pinia } from '../../../stores/pinia'
import SimulatorDocumentApp from './SimulatorDocumentApp.vue'
import { createRuntimeContext } from '../services/componentLoader'
import { simulatorDocumentStyles } from '../services/simulatorDocumentStyles'

const frameRef = ref(null)
let runtimeApp = null

/**
 * Creates a fresh HTML shell inside the simulator iframe document.
 *
 * @param {Document} targetDocument
 * @returns {void}
 */
function initializeFrameDocument(targetDocument) {
  targetDocument.open()
  targetDocument.write(`<!DOCTYPE html>
    <html lang="zh-CN">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Simulator Runtime</title>
      </head>
      <body>
        <div id="simulator-root"></div>
      </body>
    </html>`)
  targetDocument.close()

  const style = targetDocument.createElement('style')
  style.dataset.simulatorDocumentStyles = 'true'
  style.textContent = simulatorDocumentStyles
  targetDocument.head.appendChild(style)
}

/**
 * Unmounts the currently mounted simulator runtime application if it exists.
 *
 * @returns {void}
 */
function unmountRuntimeApp() {
  if (!runtimeApp) return
  runtimeApp.unmount()
  runtimeApp = null
}

/**
 * Mounts the simulator runtime Vue application into the iframe document.
 *
 * @returns {void}
 */
function mountRuntimeApp() {
  const frame = frameRef.value
  if (!frame?.contentWindow || !frame.contentDocument) return

  unmountRuntimeApp()
  initializeFrameDocument(frame.contentDocument)

  const runtimeContext = createRuntimeContext(
    frame.contentWindow,
    frame.contentDocument,
    'simulator-frame',
  )

  runtimeApp = createApp(SimulatorDocumentApp, { runtimeContext })
  runtimeApp.use(pinia)
  runtimeApp.mount(frame.contentDocument.getElementById('simulator-root'))
}

/**
 * Handles iframe load events and remounts the simulator runtime document.
 *
 * @returns {void}
 */
function handleFrameLoad() {
  mountRuntimeApp()
}

onBeforeUnmount(() => {
  unmountRuntimeApp()
})
</script>

<template>
  <div class="phone-frame-host">
    <iframe
      ref="frameRef"
      class="phone-frame-host__iframe"
      src="about:blank"
      title="Phone simulator"
      @load="handleFrameLoad"
    ></iframe>
  </div>
</template>

<style scoped>
.phone-frame-host {
  width: 375px;
  height: 667px;
  background: #ffffff;
  border-radius: 24px;
  border: 3px solid #333333;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.phone-frame-host__iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
  background: #ffffff;
}
</style>
