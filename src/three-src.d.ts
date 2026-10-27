declare module "three/src/cameras/PerspectiveCamera.js" {
  export class PerspectiveCamera {
    constructor(fov: number, aspect: number, near: number, far: number);
    aspect: number;
    position: {
      x: number;
      y: number;
      z: number;
      set: (x: number, y: number, z: number) => void;
      length: () => number;
    };
    updateProjectionMatrix: () => void;
    lookAt: (x: number, y: number, z: number) => void;
  }
}

declare module "three/src/constants.js" {
  export const AddEquation: number;
  export const AdditiveBlending: number;
  export const CustomBlending: number;
  export const LinearSRGBColorSpace: string;
  export const OneFactor: number;
  export const ReverseSubtractEquation: number;
  export const SrcAlphaFactor: number;
}

declare module "three/src/core/BufferAttribute.js" {
  export class Float32BufferAttribute {
    constructor(array: Float32Array, itemSize: number);
  }
}

declare module "three/src/core/BufferGeometry.js" {
  export class BufferGeometry {
    setAttribute(name: string, attribute: object): void;
  }
}

declare module "three/src/materials/ShaderMaterial.js" {
  export class ShaderMaterial {
    constructor(parameters?: {
      vertexShader?: string;
      fragmentShader?: string;
      transparent?: boolean;
      depthTest?: boolean;
      depthWrite?: boolean;
      blending?: number;
      uniforms?: Record<string, { value: unknown }>;
    });
    blending: number;
    blendEquation: number;
    blendSrc: number;
    blendDst: number;
    needsUpdate: boolean;
    uniforms: Record<string, { value: unknown }>;
  }
}

declare module "three/src/math/Vector2.js" {
  export class Vector2 {
    constructor(x?: number, y?: number);
    set: (x: number, y: number) => this;
  }
}

declare module "three/src/math/Vector3.js" {
  export class Vector3 {
    constructor(x?: number, y?: number, z?: number);
    set: (x: number, y: number, z: number) => this;
  }
}

declare module "three/src/objects/Points.js" {
  export class Points {
    constructor(geometry: object, material: object);
    frustumCulled: boolean;
  }
}

declare module "three/src/renderers/WebGLRenderer.js" {
  export class WebGLRenderer {
    constructor(parameters?: {
      canvas?: HTMLCanvasElement | OffscreenCanvas;
      alpha?: boolean;
      antialias?: boolean;
      depth?: boolean;
      stencil?: boolean;
      premultipliedAlpha?: boolean;
      powerPreference?: string;
    });
    outputColorSpace: string;
    setClearColor: (color: number, alpha?: number) => void;
    setPixelRatio: (value: number) => void;
    setSize: (width: number, height: number, updateStyle?: boolean) => void;
    render: (scene: object, camera: object) => void;
  }
}

declare module "three/src/scenes/Scene.js" {
  export class Scene {
    add: (object: object) => void;
  }
}
