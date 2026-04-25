import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/postprocessing/UnrealBloomPass.js";
import { SSAOPass } from "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/postprocessing/SSAOPass.js";
import { OutputPass } from "https://cdn.jsdelivr.net/npm/three@0.172.0/examples/jsm/postprocessing/OutputPass.js";

const QUALITY_PIPELINE = {
  ultra: { bloomStrength: 1.15, bloomRadius: 0.62, bloomThreshold: 0.78, useComposer: true, useSsao: true, ssaoKernel: 24, ssaoMinDist: 0.0009, ssaoMaxDist: 0.09 },
  high: { bloomStrength: 0.96, bloomRadius: 0.54, bloomThreshold: 0.8, useComposer: true, useSsao: true, ssaoKernel: 18, ssaoMinDist: 0.0012, ssaoMaxDist: 0.08 },
  medium: { bloomStrength: 0.72, bloomRadius: 0.42, bloomThreshold: 0.84, useComposer: true, useSsao: false, ssaoKernel: 12, ssaoMinDist: 0.0015, ssaoMaxDist: 0.07 },
  low: { bloomStrength: 0.0, bloomRadius: 0.0, bloomThreshold: 1.0, useComposer: false, useSsao: false, ssaoKernel: 8, ssaoMinDist: 0.0018, ssaoMaxDist: 0.06 }
};

export const createRenderPipeline = ({ THREE, renderer, scene, camera, quality }) => {
  const composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const ssaoPass = new SSAOPass(scene, camera, window.innerWidth, window.innerHeight);
  ssaoPass.enabled = false;
  ssaoPass.kernelRadius = 16;
  ssaoPass.minDistance = 0.0012;
  ssaoPass.maxDistance = 0.08;
  composer.addPass(ssaoPass);

  const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 0.9, 0.5, 0.82);
  composer.addPass(bloomPass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  let useComposer = true;

  const applyQualityToPipeline = (mode) => {
    const q = QUALITY_PIPELINE[mode] || QUALITY_PIPELINE.medium;
    bloomPass.strength = q.bloomStrength;
    bloomPass.radius = q.bloomRadius;
    bloomPass.threshold = q.bloomThreshold;
    ssaoPass.enabled = q.useSsao;
    ssaoPass.kernelRadius = q.ssaoKernel;
    ssaoPass.minDistance = q.ssaoMinDist;
    ssaoPass.maxDistance = q.ssaoMaxDist;
    useComposer = q.useComposer;
  };

  const resize = (width, height, pixelRatio) => {
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
    composer.setSize(width, height);
    composer.setPixelRatio(pixelRatio);
    ssaoPass.setSize(width, height);
  };

  const render = () => {
    if (useComposer) {
      composer.render();
      return;
    }
    renderer.render(scene, camera);
  };

  applyQualityToPipeline(quality);

  return {
    render,
    resize,
    applyQualityToPipeline
  };
};
