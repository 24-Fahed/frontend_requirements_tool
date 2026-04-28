/**
 * Base stylesheet injected into the simulator iframe document.
 *
 * It contains the editor shell layout, palette dock, canvas styling and
 * simulator node affordances that previously lived in the host document.
 */
export const simulatorDocumentStyles = `
  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #ffffff;
  }

  #simulator-root {
    width: 100%;
    height: 100%;
  }

  .simulator-document {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #ffffff;
    overflow: hidden;
    position: relative;
  }

  .phone-status-bar {
    height: 30px;
    background: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px;
    flex-shrink: 0;
    color: #666666;
    font-size: 12px;
  }

  .phone-status-bar__title {
    font-weight: 600;
  }

  .phone-status-bar__actions {
    margin-left: auto;
    display: flex;
    gap: 6px;
  }

  .phone-status-bar__button {
    border: 1px solid #cccccc;
    background: #ffffff;
    color: #666666;
    border-radius: 3px;
    font-size: 11px;
    line-height: 1;
    padding: 3px 8px;
    cursor: pointer;
  }

  .phone-status-bar__button:hover {
    border-color: #409EFF;
    color: #409EFF;
  }

  .phone-status-bar__button.is-active {
    border-color: #409EFF;
    color: #409EFF;
    background: #ecf5ff;
  }

  .simulator-workspace {
    flex: 1;
    min-height: 0;
    display: block;
    overflow: hidden;
    background: #fafafa;
    position: relative;
  }

  .phone-screen {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: 8px;
    background: #fafafa;
  }

  .phone-home-indicator {
    height: 20px;
    background: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .phone-home-indicator::after {
    content: '';
    width: 100px;
    height: 4px;
    background: #cccccc;
    border-radius: 2px;
  }

  .simulator-document--preview .phone-screen {
    padding: 0;
  }

  .simulator-document--preview .sim-node {
    border: none;
    margin: 0;
    padding: 0;
    min-height: 0;
  }

  .simulator-document--preview .sim-node .node-label,
  .simulator-document--preview .sim-node .delete-btn {
    display: none;
  }

  .simulator-document--preview .sim-node.selected {
    border: none;
    box-shadow: none;
  }

  .simulator-document--preview .drop-zone-active {
    background: transparent;
    border: none;
  }

  .sim-node {
    border: 1px dashed #c0c4cc;
    border-radius: 4px;
    margin: 0;
    padding: 2px;
    position: relative;
    min-height: 32px;
  }

  .sim-node.selected {
    border-color: #409EFF;
    box-shadow: 0 0 4px rgba(64, 158, 255, 0.3);
  }

  .sim-node .node-label {
    font-size: 10px;
    color: #909399;
    position: absolute;
    top: 2px;
    right: 4px;
    z-index: 1;
  }

  .sim-node .delete-btn {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    background: #f56c6c;
    color: white;
    border-radius: 50%;
    font-size: 10px;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s;
    z-index: 1;
  }

  .sim-node:hover .delete-btn {
    opacity: 1;
  }

  .drop-zone-active {
    background: rgba(64, 158, 255, 0.1);
    border-color: #409EFF;
  }

  .phone-empty-state {
    color: #c0c4cc;
    text-align: center;
    padding: 40px 16px;
    font-size: 13px;
  }

  .sim-node-fallback__title {
    font-weight: 600;
  }

  .sim-node-fallback__props {
    margin-top: 4px;
    color: #909399;
    font-size: 11px;
    word-break: break-all;
  }

  .component-panel {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 20px;
    height: 52%;
    min-height: 240px;
    max-height: calc(100% - 40px);
    background: #ffffff;
    border-top: 1px solid #e4e7ed;
    border-radius: 18px 18px 0 0;
    box-shadow: 0 -12px 28px rgba(0, 0, 0, 0.16);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transform: translateY(calc(100% + 20px));
    transition: transform 0.25s ease;
    z-index: 12;
  }

  .component-panel--open {
    transform: translateY(0);
  }

  .component-panel__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 14px;
    border-bottom: 1px solid #e4e7ed;
    flex-shrink: 0;
  }

  .component-panel__title {
    font-size: 14px;
    font-weight: 600;
    color: #303133;
  }

  .component-panel__close {
    font-size: 18px;
    color: #909399;
    cursor: pointer;
    line-height: 1;
  }

  .component-panel__tabs {
    display: flex;
    border-bottom: 1px solid #e4e7ed;
    flex-shrink: 0;
  }

  .component-panel__tab {
    flex: 1;
    padding: 8px 0;
    border: none;
    background: none;
    font-size: 12px;
    color: #606266;
    cursor: pointer;
    border-bottom: 2px solid transparent;
  }

  .component-panel__tab--active {
    color: #409EFF;
    border-bottom-color: #409EFF;
  }

  .component-panel__body {
    flex: 1;
    overflow-y: auto;
    padding: 8px 10px;
  }

  .component-panel__list {
    min-height: 100%;
  }

  .drawer-card {
    padding: 8px;
    margin: 8px 0;
    background: #fff;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    cursor: grab;
    font-size: 12px;
    transition: border-color 0.2s, box-shadow 0.2s, transform 0.2s;
  }

  .drawer-card:hover {
    border-color: #409EFF;
    box-shadow: 0 6px 18px rgba(64, 158, 255, 0.12);
    transform: translateY(-1px);
  }

  .drawer-card:active {
    cursor: grabbing;
  }

  .drawer-card__title {
    margin-top: 8px;
    font-weight: 600;
    color: #303133;
  }

  .drawer-card__meta {
    margin-top: 4px;
    font-size: 11px;
    color: #909399;
    word-break: break-word;
  }

  .panel-preview {
    min-height: 72px;
    padding: 8px;
    border-radius: 6px;
    background: #f8fafc;
    border: 1px dashed #dcdfe6;
    overflow: hidden;
  }

  .panel-preview > * {
    pointer-events: none;
  }

  .panel-preview__placeholder {
    min-height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #909399;
    background: #f8fafc;
    border-radius: 6px;
    border: 1px dashed #dcdfe6;
    text-align: center;
    font-size: 11px;
  }

  .panel-preview__slot {
    min-height: 24px;
    border: 1px dashed #c0c4cc;
    border-radius: 4px;
    background: rgba(64, 158, 255, 0.08);
    color: #606266;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
  }
`
