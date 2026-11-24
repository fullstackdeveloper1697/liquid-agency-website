"use client";

import { useEffect, useRef } from "react";
import { reducedMotion } from "@/lib/motion";

/**
 * Closing scene in one fragment shader, after the reference: a misty magenta
 * valley seen from low above the ground, rolling hills, a far ridge, and
 * glowing roads that wind toward the horizon and drift toward you over time.
 * CSS gradient fallback without WebGL2.
 */
const FRAG = `#version 300 es
precision highp float;
uniform vec2 uRes; uniform float uT; out vec4 o;
float h11(float n){ return fract(sin(n) * 43758.5453); }
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), u.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), u.x), u.y); }
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ v += a * n2(p); p *= 2.03; a *= 0.5; } return v; }
float n1(float x){ float i = floor(x), f = fract(x); return mix(h11(i), h11(i + 1.0), f * f * (3.0 - 2.0 * f)); }
// a road: x offset as a function of depth
float road(float z, float k){ return sin(z * 0.42 + k * 2.1) * 0.9 + sin(z * 0.13 + k * 5.0) * 1.5 + (k - 1.5) * 1.25; }
void main(){
  vec2 uv = gl_FragCoord.xy / uRes; float asp = uRes.x / uRes.y;
  vec2 p = vec2((uv.x - 0.5) * asp, uv.y);
  float hz = 0.5;
  // sky: deep violet to magenta haze at the horizon, soft light source right of centre
  vec3 col = mix(vec3(0.26, 0.02, 0.27), vec3(0.02, 0.0, 0.035), pow(smoothstep(hz, 1.0, uv.y), 0.45));
  vec2 sunp = vec2(0.17 * asp, hz + 0.02);
  float sd = length(p - sunp);
  col += vec3(1.0, 0.8, 1.0) * exp(-sd * 40.0) * 0.9 + vec3(1.0, 0.2, 1.0) * exp(-sd * 6.0) * 0.25;
  // far ridge
  float r1 = hz + 0.012 + (n1(p.x * 3.0 + 4.0) * 0.6 + n1(p.x * 9.0) * 0.25) * 0.05;
  if (uv.y < r1 && uv.y >= hz) col = mix(vec3(0.16, 0.0, 0.18), vec3(0.42, 0.04, 0.45), smoothstep(hz, r1, uv.y) * 0.7);
  if (uv.y < hz){
    float d = hz - uv.y;
    float z = 1.1 / d;                  // depth
    float x = p.x * z;                  // lateral
    float zz = z + uT * 0.9;            // moving forward
    // rolling hills shading
    float hill = fbm(vec2(x * 0.18, zz * 0.18));
    vec3 ground = mix(vec3(0.025, 0.0, 0.03), vec3(0.20, 0.01, 0.21), hill * hill);
    // contour sheen
    float cont = abs(fract(hill * 9.0) - 0.5);
    ground += vec3(0.6, 0.05, 0.6) * smoothstep(0.05, 0.0, cont) * 0.08;
    col = ground;
    // glowing roads
    for (int i = 0; i < 4; i++){
      float k = float(i);
      float rx = road(zz, k);
      float w = abs(x - rx) / z;          // screen-space distance
      float core = smoothstep(0.006, 0.0, w);
      float glow = exp(-w * 90.0);
      // dashed light trails along the road
      float dash = 0.6 + 0.4 * step(0.5, fract(zz * 0.35 - uT * 0.8 + k * 0.3));
      col += vec3(1.0, 0.85, 1.0) * core * dash * 0.9 + vec3(1.0, 0.0, 1.0) * glow * 0.55;
    }
    // haze toward the horizon, mist close to it
    col = mix(col, vec3(0.42, 0.04, 0.44), exp(-d * 14.0) * 0.8);
    col += vec3(1.0, 0.1, 1.0) * exp(-d * 60.0) * 0.35;
  }
  // stars
  vec2 g = floor(gl_FragCoord.xy / 3.0); float s = h11(g.x * 91.7 + g.y * 13.3);
  col += step(0.9982, s) * smoothstep(hz + 0.15, 1.0, uv.y) * 0.6;
  // vignette + veil behind the copy on the left
  col *= 1.0 - 0.5 * pow(length(uv - 0.5), 2.0);
  col = mix(col, col * 0.4, smoothstep(0.6, 0.0, uv.x) * smoothstep(0.15, 0.7, uv.y) * 0.75);
  o = vec4(col, 1.0);
}`;

export function Terrain({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!;
    const gl = c.getContext("webgl2", { antialias: false });
    if (!gl) { c.style.display = "none"; return; }
    const mk = (t: number, s: string) => { const x = gl.createShader(t)!; gl.shaderSource(x, s); gl.compileShader(x); return x; };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, mk(gl.VERTEX_SHADER, `#version 300 es
in vec2 aP; void main(){ gl_Position = vec4(aP, 0.0, 1.0); }`));
    gl.attachShader(pr, mk(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { c.style.display = "none"; return; }
    gl.useProgram(pr);
    const b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "aP"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uRes = gl.getUniformLocation(pr, "uRes"), uT = gl.getUniformLocation(pr, "uT");
    const dpr = Math.min(devicePixelRatio || 1, 1.25);
    let raf = 0, on = false;
    const still = reducedMotion();
    const frame = (now: number) => {
      const W = Math.round(c.clientWidth * dpr), H = Math.round(c.clientHeight * dpr);
      if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
      gl.viewport(0, 0, W, H);
      gl.uniform2f(uRes, W, H);
      gl.uniform1f(uT, still ? 4 : now / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (on && !still) raf = requestAnimationFrame(frame);
    };
    const io = new IntersectionObserver(([e]) => { on = e.isIntersecting; cancelAnimationFrame(raf); if (on) raf = requestAnimationFrame(frame); });
    io.observe(c);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className={`absolute inset-0 bg-[linear-gradient(180deg,#080009,#3a043c_50%,#8a108c_54%,#2a002c_60%,#120014)] ${className}`}>
      <canvas ref={ref} aria-hidden className="block size-full" />
    </div>
  );
}
