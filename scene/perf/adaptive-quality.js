export const createAdaptiveQualityMonitor = ({
  getRequestedMode,
  getCurrentResolvedMode,
  onLowerQuality,
  onRaiseQuality
}) => {
  let frameCount = 0;
  let lastCheck = performance.now();
  let lowCounter = 0;
  let highCounter = 0;

  const downgradeOrder = ["ultra", "high", "medium", "low"];

  const tryStepDown = () => {
    const current = getCurrentResolvedMode();
    const idx = downgradeOrder.indexOf(current);
    if (idx >= 0 && idx < downgradeOrder.length - 1) {
      onLowerQuality(downgradeOrder[idx + 1]);
    }
  };

  const tryStepUp = () => {
    const current = getCurrentResolvedMode();
    const idx = downgradeOrder.indexOf(current);
    if (idx > 0) {
      onRaiseQuality(downgradeOrder[idx - 1]);
    }
  };

  const tick = () => {
    frameCount += 1;
    const now = performance.now();

    if (now - lastCheck < 1300) return;

    const fps = (frameCount * 1000) / (now - lastCheck);
    frameCount = 0;
    lastCheck = now;

    if (getRequestedMode() !== "auto") {
      lowCounter = 0;
      highCounter = 0;
      return;
    }

    if (fps < 48) {
      lowCounter += 1;
      highCounter = 0;
    } else if (fps > 57) {
      highCounter += 1;
      lowCounter = 0;
    } else {
      lowCounter = 0;
      highCounter = 0;
    }

    if (lowCounter >= 2) {
      tryStepDown();
      lowCounter = 0;
    }

    if (highCounter >= 3) {
      tryStepUp();
      highCounter = 0;
    }
  };

  return { tick };
};
