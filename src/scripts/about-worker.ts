import { PerspectiveCamera } from "three/src/cameras/PerspectiveCamera.js";
import {
  AddEquation,
  AdditiveBlending,
  CustomBlending,
  LinearSRGBColorSpace,
  OneFactor,
  ReverseSubtractEquation,
  SrcAlphaFactor,
} from "three/src/constants.js";
import { Float32BufferAttribute } from "three/src/core/BufferAttribute.js";
import { BufferGeometry } from "three/src/core/BufferGeometry.js";
import { ShaderMaterial } from "three/src/materials/ShaderMaterial.js";
import { Vector2 } from "three/src/math/Vector2.js";
import { Vector3 } from "three/src/math/Vector3.js";
import { Points } from "three/src/objects/Points.js";
import { WebGLRenderer } from "three/src/renderers/WebGLRenderer.js";
import { Scene } from "three/src/scenes/Scene.js";
import { cameraDistance, MOTION } from "./about-framing";

const vertex = /* glsl */ `
  precision mediump float;

  uniform float uTime;
  uniform float uFocus;
  uniform float uRange;
  uniform float uPixelRatio;
  uniform float uSpan;
  uniform vec2 uCell;

  varying float vAlpha;
  varying float vSoft;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 cell = uCell;
    vec2 jitter = vec2(hash(position.xy), hash(position.xy + 19.2)) - 0.5;
    vec2 uv = clamp(position.xy + jitter * cell * 0.9, 0.0, 1.0);

    float ang = uTime * ${MOTION};
    vec3 flow = vec3(sin(ang), cos(ang), sin(ang + 1.7));

    float s0 = uv.x * 2.0 - 1.0;
    float w = uv.y * 2.0 - 1.0;
    float n = snoise(vec3(s0 * 0.9, w * 0.7, 0.15) + flow);
    float n2 = snoise(vec3(s0 * 0.75 + 1.8, w * 0.6, 2.2) + flow.yxz);
    float s = s0 + n * 0.26;
    w += n2 * 0.14;

    float breathe = 0.94 + 0.06 * sin(ang);
    float curve = sin(s * 1.05 + 0.35);
    vec3 p;
    // The warp stays at the original sheet's width. Only the base stretches.
    p.x = s0 * uSpan + n * 0.351;
    p.y = w * 1.62 + 0.42;
    p.z = curve * 0.95 - s * s * 0.28;
    p *= breathe;

    vec3 normal = normalize(vec3(-cos(s * 1.05 + 0.35), 0.12, 1.0));
    p += normal * n * 0.5;
    p.x += n2 * 0.14;
    p.y += n2 * 0.1;

    float sway = sin(ang) * 0.22;
    float cs = cos(sway);
    float sn = sin(sway);
    float x = p.x;
    float z = p.z;
    p.x = cs * x + sn * z;
    p.z = -sn * x + cs * z;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    float depth = -mv.z;
    float dof = clamp(abs(depth - uFocus) / uRange, 0.0, 1.0);
    dof = dof * dof;

    vSoft = dof;
    vAlpha = mix(0.78, 0.045, dof);
    float edge = smoothstep(0.0, 0.14, uv.x) * smoothstep(1.0, 0.86, uv.x);
    edge *= smoothstep(0.0, 0.2, uv.y) * smoothstep(1.0, 0.8, uv.y);
    vAlpha *= edge;

    gl_PointSize = mix(1.45, 7.2, dof) * uPixelRatio;
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  precision mediump float;

  uniform vec3 uColor;

  varying float vAlpha;
  varying float vSoft;

  void main() {
    vec2 pc = gl_PointCoord - vec2(0.5);
    float d = length(pc);
    if (d > 0.5) discard;
    float inner = mix(0.08, 0.46, vSoft);
    float falloff = smoothstep(0.5, inner, d);
    float alpha = falloff * vAlpha;
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

interface FieldMessage {
  type: "init" | "resize" | "theme" | "visible" | "motion";
  canvas?: OffscreenCanvas;
  width?: number;
  height?: number;
  pixelRatio?: number;
  light?: number;
  reduced?: boolean;
  visible?: boolean;
  cols?: number;
  rows?: number;
  span?: number;
}

function buildSheet(cols: number, rows: number): Float32Array {
  const positions = new Float32Array(cols * rows * 3);
  let offset = 0;
  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < cols; x += 1) {
      positions[offset] = x / (cols - 1);
      positions[offset + 1] = y / (rows - 1);
      positions[offset + 2] = 0;
      offset += 3;
    }
  }
  return positions;
}

let renderer: WebGLRenderer | null = null;
let material: ShaderMaterial | null = null;
let color: Vector3 | null = null;
let camera: PerspectiveCamera | null = null;
let scene: Scene | null = null;
let width = 2;
let height = 2;
let pixelRatio = 1;
let span = 1.35;
let theme = -1;
let reduced = false;
let visible = true;
let seconds = 0;
let frame = 0;
let running = false;

function applyTheme(light: number): void {
  if (!renderer || !material || !color || light === theme) return;
  theme = light;
  if (theme === 1) {
    color.set(0.42, 0.42, 0.42);
    material.blending = CustomBlending;
    material.blendEquation = ReverseSubtractEquation;
    material.blendSrc = SrcAlphaFactor;
    material.blendDst = OneFactor;
    renderer.setClearColor(0xfbfbfb, 1);
  } else {
    color.set(0.93, 0.93, 0.93);
    material.blending = AdditiveBlending;
    material.blendEquation = AddEquation;
    material.blendSrc = SrcAlphaFactor;
    material.blendDst = OneFactor;
    renderer.setClearColor(0x070707, 1);
  }
  material.needsUpdate = true;
}

function resize(): void {
  if (!renderer || !material || !camera) return;
  renderer.setPixelRatio(pixelRatio);
  renderer.setSize(width, height, false);
  camera.aspect = width / Math.max(height, 1);
  camera.updateProjectionMatrix();
  material.uniforms.uPixelRatio.value = pixelRatio;
}

function placeCamera(time: number): void {
  if (!camera || !material) return;
  const ang = time * MOTION;
  const dist = cameraDistance(width, height);
  camera.position.set(Math.sin(ang) * 0.38, Math.cos(ang) * 0.16, dist);
  camera.lookAt(0, -0.22, 0);
  material.uniforms.uSpan.value = span;
  material.uniforms.uFocus.value = camera.position.length();
}

function draw(time: number): void {
  if (!renderer || !material || !scene || !camera) return;
  seconds = time;
  material.uniforms.uTime.value = time;
  placeCamera(reduced ? 0 : time);
  renderer.render(scene, camera);
}

function stop(): void {
  running = false;
  cancelAnimationFrame(frame);
}

function start(): void {
  if (running || reduced || !visible || !renderer) return;
  running = true;
  let last = 0;
  const tick = (now: number): void => {
    frame = requestAnimationFrame(tick);
    if (now - last < 32) return;
    last = now;
    draw(now * 0.001);
  };
  frame = requestAnimationFrame(tick);
}

function boot(message: FieldMessage): void {
  const canvas = message.canvas;
  const cols = message.cols ?? 80;
  const rows = message.rows ?? 50;
  if (!canvas) return;
  width = message.width ?? 2;
  height = message.height ?? 2;
  pixelRatio = message.pixelRatio ?? 1;
  span = message.span ?? 1.35;
  reduced = message.reduced === true;

  try {
    renderer = new WebGLRenderer({
      canvas,
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
    });
  } catch {
    self.postMessage({ type: "failed" });
    return;
  }

  renderer.outputColorSpace = LinearSRGBColorSpace;
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(buildSheet(cols, rows), 3));
  color = new Vector3(0.93, 0.93, 0.93);
  material = new ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: color },
      uFocus: { value: 6.2 },
      uRange: { value: 1.45 },
      uPixelRatio: { value: pixelRatio },
      uSpan: { value: span },
      uCell: { value: new Vector2(1 / cols, 1 / rows) },
    },
  });
  const points = new Points(geometry, material);
  points.frustumCulled = false;
  scene = new Scene();
  scene.add(points);
  camera = new PerspectiveCamera(32, 1, 0.1, 40);
  applyTheme(message.light === 1 ? 1 : 0);
  resize();
  draw(0);
  start();
}

self.onmessage = (event: MessageEvent<FieldMessage>): void => {
  const message = event.data;
  if (message.type === "init") {
    boot(message);
    return;
  }
  if (message.type === "resize") {
    width = message.width ?? width;
    height = message.height ?? height;
    pixelRatio = message.pixelRatio ?? pixelRatio;
    span = message.span ?? span;
    resize();
    if (!running) draw(seconds);
    return;
  }
  if (message.type === "theme") {
    theme = -1;
    applyTheme(message.light === 1 ? 1 : 0);
    if (!running) draw(seconds);
    return;
  }
  if (message.type === "visible") {
    visible = message.visible !== false;
    if (visible) start();
    else stop();
    return;
  }
  if (message.type === "motion") {
    reduced = message.reduced === true;
    if (reduced) {
      stop();
      draw(0);
    } else {
      start();
    }
  }
};

