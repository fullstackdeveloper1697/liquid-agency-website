"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { reducedMotion } from "@/lib/motion";

/**
 * Fixed star field behind every dark page, drawn on the GPU (WebGL2, instanced
 * streaks) with a 2D-canvas fallback.
 *
 * Behaviour, tuned to the reference:
 *  - ~1,200–2,200 streaks depending on screen size (900 on phones)
 *  - each page has a flight path: the home page uses "highway" (streaks drift
 *    sideways in depth layers), other pages fly out from the centre ("radial")
 *  - idle drift, a speed-up while scrolling that decays smoothly, a warp on
 *    page change and while hovering elements marked [data-boost]
 *  - near streaks are longer, wider and brighter; ~14% are magenta, and fast
 *    streaks blush magenta
 *  - the vanishing point leans slightly away from the pointer
 *  - dims over text sections ([data-calm]) so content stays readable
 */

type Mode = "radial" | "highway" | "diagonal" | "rise";
const MODES: Record<Mode, [number, number, number]> = {
  radial: [0, 0, 0],
  highway: [1, -1, 0],
  diagonal: [1, -0.866, 0.5],
  rise: [1, 0, -1],
};
const modeFor = (path: string): Mode => (path === "/" ? "highway" : "radial");

const TUNE = { idle: 0.0016, active: 0.011, max: 0.046, decay: 0.93, scrollPower: 6e-5, trail: 5.2 };

const VERT = `#version 300 es
precision highp float;
layout(location=0) in vec2 aC; layout(location=1) in vec3 aS;
uniform float uTravel, uSpeed, uTrail, uDpr, uMode;
uniform vec2 uRes, uVP, uDir;
out float vA; out float vX; out float vL; out float vT; out float vM;
float h(float n){ return fract(sin(n) * 43758.5453123); }
void main(){
  float id = float(gl_InstanceID);
  vec2 head, tail; float depth;
  if (uMode > 0.5){
    // highway: streaks drift along uDir in parallax layers
    float k = mix(0.1, 1.0, aS.z);
    float L = length(uRes) * 1.08;
    float u = fract(h(id * 1.713 + aS.x) + uTravel * 0.3 / k);
    float v = h(id * 3.371 + aS.y);
    vec2 nrm = vec2(-uDir.y, uDir.x);
    vec2 c = uRes * 0.5 + uVP * uDpr * (0.3 / k);
    head = c + uDir * (u - 0.5) * L + nrm * (v - 0.5) * L;
    tail = head - uDir * (uSpeed * uTrail * 0.3 / k * L);
    depth = 1.0 - k;
  } else {
    // radial: stars fly out from the vanishing point
    float raw = aS.z - uTravel; float cyc = floor(raw); float z = mix(0.02, 1.0, fract(raw));
    vec2 xy = vec2(h(id * 1.713 + cyc * 13.17 + aS.x), h(id * 3.371 + cyc * 7.73 + aS.y)) * 2.0 - 1.0;
    xy *= uRes * 0.6;
    vec2 c = uRes * 0.5 + uVP * uDpr;
    float zt = min(z + uSpeed * uTrail, 1.0);
    head = c + xy / z; tail = c + xy / zt; depth = 1.0 - z;
  }
  vec2 dv = head - tail; float len = length(dv);
  float cap = 340.0 * uDpr;
  if (len > cap){ tail = head - dv / len * cap; dv = head - tail; len = cap; }
  float w = max(depth * 2.1, 0.5) * uDpr;
  vec2 n = len > 0.0001 ? dv / len : vec2(1.0, 0.0); vec2 pp = vec2(-n.y, n.x);
  vec2 p = mix(tail - n * w, head + n * w, aC.x) + pp * aC.y * w;
  vA = depth * depth * 0.95 + 0.1; vX = aC.y; vL = aC.x; vT = clamp(len / (80.0 * uDpr), 0.0, 1.0);
  vM = step(0.86, h(id * 7.31 + 3.7));
  vec2 cl = p / uRes * 2.0 - 1.0; gl_Position = vec4(cl.x, -cl.y, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision mediump float;
in float vA; in float vX; in float vL; in float vT; in float vM;
uniform float uFade, uMag; out vec4 o;
void main(){
  float e = 1.0 - smoothstep(0.25, 1.0, abs(vX));
  float a = vA * e * uFade * mix(0.15, 1.0, vL);
  float m = max(vM * 0.9, uMag * vT * (1.0 - vL * 0.5));
  vec3 col = mix(vec3(1.0), vec3(1.0, 0.0, 1.0), m);
  o = vec4(col * a, a);
}`;

const approach = (a: number, b: number, k: number) => a + (b - a) * k;

export function Starfield() {
  const ref = useRef<HTMLCanvasElement>(null);
  const pathname = usePathname();
  const modeRef = useRef<Mode>(modeFor(pathname));
  const warpRef = useRef<() => void>(() => {});

  // new page: switch flight path and warp briefly
  useEffect(() => {
    modeRef.current = modeFor(pathname);
    warpRef.current();
  }, [pathname]);

  useEffect(() => {
    const cv = ref.current!;
    const still = reducedMotion();
    const phone = innerWidth < 768;
    const count = Math.round(phone ? 900 : Math.min(2200, Math.max(1200, (innerWidth * innerHeight) / 760)));
    let dpr = Math.min(devicePixelRatio || 1, phone ? 1.25 : 1.75);

    const S = { speed: TUNE.idle, travel: Math.random() * 10, boost: 0, hold: 0, holdT: 0, calm: 0, calmT: 0, fade: 1, mag: 0, vpx: 0, vpy: 0, rad: 0 };
    let mx = innerWidth / 2, my = innerHeight / 2, pointer = false;

    /* ---------- renderer: WebGL2, or 2D fallback ---------- */
    let draw: () => void = () => {};
    let resize: () => void = () => {};
    const gl = cv.getContext("webgl2", { alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: "high-performance" });

    if (gl) {
      const sh = (t: number, s: string) => {
        const x = gl.createShader(t)!;
        gl.shaderSource(x, s);
        gl.compileShader(x);
        if (!gl.getShaderParameter(x, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(x) || "shader");
        return x;
      };
      const prog = gl.createProgram()!;
      gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
      gl.linkProgram(prog);
      gl.useProgram(prog);
      const vao = gl.createVertexArray();
      gl.bindVertexArray(vao);
      const quad = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, -1, 1, -1, 0, 1, 1, 1]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      const seeds = new Float32Array(count * 3);
      for (let i = 0; i < count; i++) {
        seeds[i * 3] = Math.random() * 10;
        seeds[i * 3 + 1] = Math.random() * 10;
        seeds[i * 3 + 2] = Math.random();
      }
      const sb = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, sb);
      gl.bufferData(gl.ARRAY_BUFFER, seeds, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(1);
      gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);
      gl.vertexAttribDivisor(1, 1);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.clearColor(0, 0, 0, 0);
      const u = (n: string) => gl.getUniformLocation(prog, n);
      const U = { travel: u("uTravel"), speed: u("uSpeed"), trail: u("uTrail"), dpr: u("uDpr"), res: u("uRes"), vp: u("uVP"), fade: u("uFade"), mag: u("uMag"), mode: u("uMode"), dir: u("uDir") };
      resize = () => {
        cv.width = Math.round(innerWidth * dpr);
        cv.height = Math.round(innerHeight * dpr);
        gl.viewport(0, 0, cv.width, cv.height);
      };
      const pass = (mode: Mode, fade: number) => {
        const d = MODES[mode];
        const n = Math.hypot(d[1], d[2]) || 1;
        gl.uniform1f(U.mode, d[0]);
        gl.uniform2f(U.dir, d[1] / n, d[2] / n);
        gl.uniform1f(U.fade, fade);
        gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, count);
      };
      draw = () => {
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.uniform1f(U.travel, S.travel);
        gl.uniform1f(U.speed, S.speed);
        gl.uniform1f(U.trail, TUNE.trail);
        gl.uniform1f(U.dpr, dpr);
        gl.uniform2f(U.res, cv.width, cv.height);
        gl.uniform2f(U.vp, S.vpx, S.vpy);
        gl.uniform1f(U.mag, S.mag);
        const mode = modeRef.current;
        if (mode === "radial") return pass("radial", S.fade);
        // a sideways path blends into radial flight while warping
        if (S.rad < 0.995) pass(mode, S.fade * (1 - S.rad));
        if (S.rad > 0.005) pass("radial", S.fade * S.rad);
      };
    } else {
      const ctx = cv.getContext("2d")!;
      const n = Math.min(count, 520);
      type P = { u: number; v: number; k: number; x: number; y: number; z: number; m: boolean };
      const ps: P[] = [];
      const seed = (p: Partial<P>, fresh: boolean): P =>
        Object.assign(p, { u: Math.random(), v: Math.random(), k: 0.1 + Math.random() * 0.9, x: (Math.random() * 2 - 1) * innerWidth * 0.6, y: (Math.random() * 2 - 1) * innerHeight * 0.6, z: fresh ? Math.random() : 1, m: Math.random() > 0.86 }) as P;
      let last: number | null = null;
      resize = () => {
        cv.width = Math.round(innerWidth * dpr);
        cv.height = Math.round(innerHeight * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ps.length = 0;
        for (let i = 0; i < n; i++) ps.push(seed({}, true));
      };
      const alpha = [0.22, 0.5, 0.92], width = [0.6, 1, 1.6];
      draw = () => {
        const dt = last === null ? 0 : S.travel - last;
        last = S.travel;
        const W = innerWidth, H = innerHeight;
        ctx.clearRect(0, 0, W, H);
        ctx.lineCap = "round";
        const cx = W / 2 + S.vpx, cy = H / 2 + S.vpy;
        const buckets: number[][] = [[], [], [], [], [], []];
        const mode = modeRef.current;
        if (mode !== "radial") {
          const d = MODES[mode], len = Math.hypot(d[1], d[2]) || 1, dx = d[1] / len, dy = d[2] / len, L = Math.hypot(W, H) * 1.08;
          for (const p of ps) {
            p.u = (p.u + (dt * 0.3) / p.k) % 1;
            const x = cx + dx * (p.u - 0.5) * L - dy * (p.v - 0.5) * L;
            const y = cy + dy * (p.u - 0.5) * L + dx * (p.v - 0.5) * L;
            const t = Math.min(340, ((S.speed * TUNE.trail * 0.3) / p.k) * L);
            const depth = 1 - p.k;
            buckets[(depth < 0.4 ? 0 : depth < 0.75 ? 1 : 2) + (p.m ? 3 : 0)].push(x - dx * t, y - dy * t, x, y);
          }
        } else {
          for (const p of ps) {
            p.z -= dt;
            if (p.z <= 0.02) seed(p, false);
            const x = cx + p.x / p.z, y = cy + p.y / p.z;
            if (x < -60 || x > W + 60 || y < -60 || y > H + 60) { seed(p, false); continue; }
            const zt = Math.min(1, p.z + S.speed * TUNE.trail), depth = 1 - p.z;
            buckets[(depth < 0.4 ? 0 : depth < 0.75 ? 1 : 2) + (p.m ? 3 : 0)].push(cx + p.x / zt, cy + p.y / zt, x, y);
          }
        }
        buckets.forEach((b, i) => {
          ctx.strokeStyle = i > 2 ? "#ff00ff" : "#fff";
          ctx.globalAlpha = alpha[i % 3] * S.fade;
          ctx.lineWidth = width[i % 3];
          ctx.beginPath();
          for (let j = 0; j < b.length; j += 4) { ctx.moveTo(b[j], b[j + 1]); ctx.lineTo(b[j + 2] + 0.01, b[j + 3]); }
          ctx.stroke();
        });
        ctx.globalAlpha = 1;
      };
    }
    resize();
    addEventListener("resize", resize);

    /* ---------- inputs ---------- */
    let lastY = scrollY;
    const onScroll = () => {
      const y = scrollY;
      S.boost += Math.abs(y - lastY) * TUNE.scrollPower * (1 - S.calm * 0.82);
      lastY = y;
      // dim over text sections
      let calm = 0;
      const mid = innerHeight * 0.5;
      for (const el of document.querySelectorAll<HTMLElement>("[data-calm]")) {
        const r = el.getBoundingClientRect();
        if (r.top < mid && r.bottom > mid) { calm = Number(el.dataset.calm) || 1; break; }
      }
      S.calmT = calm;
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    const onMove = (e: PointerEvent) => { if (e.pointerType === "mouse") { pointer = true; mx = e.clientX; my = e.clientY; } };
    addEventListener("pointermove", onMove, { passive: true });
    const onOver = (e: PointerEvent) => { if ((e.target as HTMLElement).closest?.("[data-boost]")) S.holdT = 0.012; };
    const onOut = (e: PointerEvent) => { if ((e.target as HTMLElement).closest?.("[data-boost]")) S.holdT = 0; };
    document.addEventListener("pointerover", onOver);
    document.addEventListener("pointerout", onOut);
    let warpTimer = 0;
    warpRef.current = () => {
      S.holdT = TUNE.active;
      clearTimeout(warpTimer);
      warpTimer = window.setTimeout(() => (S.holdT = 0), 420);
    };

    /* ---------- loop ---------- */
    let raf = 0, prev = 0, running = false;
    const frame = (now: number) => {
      const f = prev ? Math.min(3, (now - prev) / 16.667) : 1;
      prev = now;
      S.boost *= Math.pow(TUNE.decay, f);
      if (S.boost < 1e-5) S.boost = 0;
      S.hold = approach(S.hold, S.holdT, 0.06);
      S.calm = approach(S.calm, S.calmT, 0.04 * f);
      S.rad = approach(S.rad, S.holdT >= TUNE.active ? 1 : 0, 0.03 * f);
      S.fade = 1 - S.calm * 0.62;
      S.speed = Math.min(TUNE.max, Math.min(TUNE.max * (1 - S.calm * 0.5), TUNE.idle + S.boost) + S.hold);
      S.mag = Math.min(1, Math.max(0, (S.speed - TUNE.idle) / (TUNE.max * 0.45)));
      S.travel += S.speed * f;
      const tx = pointer ? Math.max(-48, Math.min(48, (mx - innerWidth / 2) * -0.06)) : 0;
      const ty = pointer ? Math.max(-40, Math.min(40, (my - innerHeight / 2) * -0.06)) : 0;
      S.vpx = approach(S.vpx, tx, 0.04);
      S.vpy = approach(S.vpy, ty, 0.04);
      draw();
      if (running) raf = requestAnimationFrame(frame);
    };
    const setRunning = (on: boolean) => {
      if (on === running) return;
      running = on;
      cancelAnimationFrame(raf);
      prev = 0;
      if (on) raf = requestAnimationFrame(frame);
    };
    if (still) {
      S.speed = 0.0022;
      draw();
    } else setRunning(!document.hidden);
    const onVis = () => !still && setRunning(!document.hidden);
    document.addEventListener("visibilitychange", onVis);

    // keep frame rate healthy: drop resolution once if frames are slow
    let slow = 0;
    const perf = window.setInterval(() => {
      if (!running) return;
      const t0 = performance.now();
      requestAnimationFrame(() => {
        if (performance.now() - t0 > 30 && ++slow > 3 && dpr > 1) { dpr = 1; resize(); }
      });
    }, 2000);

    return () => {
      setRunning(false);
      clearInterval(perf);
      clearTimeout(warpTimer);
      removeEventListener("resize", resize);
      removeEventListener("scroll", onScroll);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="starfield pointer-events-none fixed inset-0 -z-10 size-full" />;
}
