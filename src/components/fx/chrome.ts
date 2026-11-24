/**
 * Ray-marched chrome shapes in WebGL2 — written for this project.
 * Five signed-distance shapes (one per service) lit by a coded "studio":
 * dark floor, grey horizon, bright sky, a softbox top left, a strip light
 * on the right and a magenta bounce from below. Shapes can blend into one another.
 */

export const SHAPES = ["cube", "ring", "cone", "capsule", "gem"] as const;

const VERT = `#version 300 es
in vec2 aP; void main(){ gl_Position = vec4(aP, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uT, uK, uWob, uFlick, uZoom;
uniform int uA, uB;
uniform mat3 uR;
out vec4 o;

float sdBox(vec3 p, vec3 b, float r){ vec3 q = abs(p) - b; return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r; }
float sdTorus(vec3 p, vec2 t){ vec2 q = vec2(length(p.xy) - t.x, p.z); return length(q) - t.y; }
float sdCapsule(vec3 p, float h, float r){ p.x -= clamp(p.x, -h, h); return length(p) - r; }
float sdOcta(vec3 p, float s){ p = abs(p); return (p.x + p.y + p.z - s) * 0.57735027; }
float sdRoundCone(vec3 p, float r1, float r2, float h){
  vec2 q = vec2(length(p.xz), p.y);
  float b = (r1 - r2) / h, a = sqrt(1.0 - b * b), k = dot(q, vec2(-b, a));
  if (k < 0.0) return length(q) - r1;
  if (k > a * h) return length(q - vec2(0.0, h)) - r2;
  return dot(q, vec2(a, b)) - r1;
}
float shape(int i, vec3 p){
  if (i == 0) return sdBox(p, vec3(0.46), 0.14);
  if (i == 1) return sdTorus(p, vec2(0.56, 0.22));
  if (i == 2) return sdRoundCone(p + vec3(0.0, 0.42, 0.0), 0.52, 0.06, 0.95);
  if (i == 3) return sdCapsule(p, 0.42, 0.36);
  return sdOcta(p, 0.86) - 0.05;
}
float map(vec3 p){
  p = uR * p;
  float d = mix(shape(uA, p), shape(uB, p), smoothstep(0.0, 1.0, uK));
  d += sin(p.x * 5.0 + uT * 1.7) * sin(p.y * 4.0 + uT * 1.3) * sin(p.z * 4.5 + uT) * 0.035 * uWob;
  return d;
}
vec3 nrm(vec3 p){
  const vec2 e = vec2(1.0, -1.0) * 0.0015;
  return normalize(e.xyy * map(p + e.xyy) + e.yyx * map(p + e.yyx) + e.yxy * map(p + e.yxy) + e.xxx * map(p + e.xxx));
}
vec3 env(vec3 r){
  float y = r.y;
  vec3 c = mix(vec3(0.016, 0.012, 0.022), vec3(0.13, 0.13, 0.15), smoothstep(-0.7, 0.02, y));
  c += vec3(0.5, 0.52, 0.58) * smoothstep(-0.04, 0.1, y) * (1.0 - smoothstep(0.1, 0.42, y)) * 0.55;
  c += vec3(0.85, 0.88, 1.0) * smoothstep(0.25, 0.95, y) * 0.4;
  c += vec3(1.0) * smoothstep(0.86, 0.97, dot(r, normalize(vec3(-0.65, 0.65, 0.4)))) * 2.2;
  c += vec3(1.0) * exp(-pow((r.x - 0.78) * 9.0, 2.0)) * smoothstep(-0.3, 0.5, y) * 1.3;
  c += vec3(1.0, 0.0, 1.0) * smoothstep(-0.05, -0.75, y) * 1.25;
  return c;
}
void main(){
  vec2 uv = (gl_FragCoord.xy * 2.0 - uRes) / min(uRes.x, uRes.y);
  vec3 ro = vec3(0.0, 0.0, 3.2 * uZoom), rd = normalize(vec3(uv, -2.0));
  float t = 0.0, d = 1.0; bool hit = false;
  for (int i = 0; i < 90; i++){
    d = map(ro + rd * t);
    if (d < 0.001){ hit = true; break; }
    t += d * 0.9;
    if (t > 7.0) break;
  }
  if (!hit){ o = vec4(0.0); return; }
  vec3 p = ro + rd * t, n = nrm(p), r = reflect(rd, n);
  float fr = pow(1.0 - max(dot(n, -rd), 0.0), 3.0);
  vec3 col = env(r) * vec3(0.95, 0.95, 1.0);
  col = mix(col * 0.82, col * 1.25, fr);
  col += vec3(1.0, 0.0, 1.0) * fr * 0.35;
  col += vec3(1.0, 0.25, 1.0) * uFlick * (0.4 + 0.6 * fr);
  col = col / (1.0 + col * 0.35);
  o = vec4(pow(col, vec3(0.92)), 1.0);
}`;

export type ChromeGL = {
  gl: WebGL2RenderingContext;
  canvas: HTMLCanvasElement;
  draw: (s: { a: number; b: number; k: number; t: number; rot: Float32Array; wob?: number; flick?: number; zoom?: number }) => void;
};

export function createChrome(canvas: HTMLCanvasElement): ChromeGL | null {
  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: false, antialias: false, depth: false });
  if (!gl) return null;
  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || "shader");
    return s;
  };
  const prog = gl.createProgram()!;
  try {
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  } catch {
    return null;
  }
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "aP");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = (n: string) => gl.getUniformLocation(prog, n);
  const U = { res: u("uRes"), t: u("uT"), k: u("uK"), a: u("uA"), b: u("uB"), r: u("uR"), wob: u("uWob"), fl: u("uFlick"), z: u("uZoom") };

  return {
    gl,
    canvas,
    draw: ({ a, b, k, t, rot, wob = 1, flick = 0, zoom = 1 }) => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(U.res, canvas.width, canvas.height);
      gl.uniform1f(U.t, t);
      gl.uniform1f(U.k, k);
      gl.uniform1i(U.a, a);
      gl.uniform1i(U.b, b);
      gl.uniform1f(U.wob, wob);
      gl.uniform1f(U.fl, flick);
      gl.uniform1f(U.z, zoom);
      gl.uniformMatrix3fv(U.r, false, rot);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },
  };
}

/** Rotation matrix from yaw (y) and pitch (x), column-major for GLSL. */
export function rotation(yaw: number, pitch: number, out = new Float32Array(9)) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cx = Math.cos(pitch), sx = Math.sin(pitch);
  // R = Rx * Ry
  out[0] = cy; out[1] = sx * sy; out[2] = -cx * sy;
  out[3] = 0; out[4] = cx; out[5] = sx;
  out[6] = sy; out[7] = -sx * cy; out[8] = cx * cy;
  return out;
}

/* ---------- one shared context for every small shape on the page ---------- */

type Sprite = { canvas: HTMLCanvasElement; shape: number; speed: number; phase: number; visible: boolean; drag: { x: number; y: number } };
const sprites = new Set<Sprite>();
let shared: ChromeGL | null | undefined;
let raf = 0;
const rot = new Float32Array(9);
const SIZE = 448;

function loop(now: number) {
  const t = now / 1000;
  if (shared) {
    for (const s of sprites) {
      if (!s.visible) continue;
      const ctx = s.canvas.getContext("2d");
      if (!ctx) continue;
      rotation(t * s.speed + s.phase + s.drag.x, Math.sin(t * 0.6 + s.phase) * 0.45 + s.drag.y, rot);
      shared.draw({ a: s.shape, b: s.shape, k: 0, t: t + s.phase, rot, wob: 0.6, zoom: 0.64 });
      ctx.clearRect(0, 0, s.canvas.width, s.canvas.height);
      ctx.drawImage(shared.canvas, 0, 0, s.canvas.width, s.canvas.height);
    }
  }
  raf = sprites.size ? requestAnimationFrame(loop) : 0;
}

export function registerSprite(s: Sprite) {
  if (shared === undefined) {
    const c = document.createElement("canvas");
    c.width = c.height = SIZE;
    shared = createChrome(c);
  }
  if (!shared) return () => {};
  sprites.add(s);
  if (!raf) raf = requestAnimationFrame(loop);
  return () => {
    sprites.delete(s);
  };
}
export const chromeSupported = () => shared !== null;
