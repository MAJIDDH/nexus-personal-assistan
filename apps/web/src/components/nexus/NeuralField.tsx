import { useEffect, useRef } from "react";

type Pt = [number, number];
interface Fiber { pts: Pt[]; w: number; hue: number; light: number }

function mulberry32(a: number) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Palette: cyan / turquoise / electric-blue with rare violet-magenta accents
function pickHue(r: () => number) {
  const v = r();
  if (v < 0.07) return 290 + r() * 30;
  if (v < 0.25) return 210 + r() * 15;
  return 178 + r() * 22;
}

function generate(w: number, h: number) {
  const r = mulberry32(11);
  const portrait = h > w;
  const s = Math.min(w, h) * (portrait ? 1.05 : 1);
  // Compact, asymmetric sculpture biased left of centre (clears the right panel)
  const cx = w * (portrait ? 0.55 : 0.42), cy = h * 0.47;
  const sx = portrait ? 1.15 : 1.45, sy = portrait ? 1.65 : 0.95;
  // A few soma-like hubs; main axon trunks radiate unevenly from them
  const hubs = [
    { x: -0.1, y: -0.02, trunks: 7 },
    { x: 0.13, y: 0.05, trunks: 6 },
    { x: -0.02, y: -0.14, trunks: 4 },
    { x: -0.24, y: 0.1, trunks: 4 },
    { x: 0.27, y: -0.08, trunks: 3 },
  ].map((c) => ({ ...c, x: cx + c.x * s * sx, y: cy + c.y * s * sy }));
  const clusters = hubs.map((c) => ({ x: c.x, y: c.y, rx: s * 0.22 * sx, ry: s * 0.2 * sy }));
  const bound = { x: cx, y: cy, rx: s * 0.4 * sx, ry: s * 0.3 * sy };

  const fibers: Fiber[] = [];
  const synapses: { x: number; y: number; r: number; hue: number }[] = [];
  const gauss = () => (r() + r() + r() - 1.5) / 1.5;
  const unit = s / 800;

  const grow = (x: number, y: number, a: number, wd: number, life: number, depth: number, hue: number) => {
    const pts: Pt[] = [[x, y]];
    let curv = (r() - 0.5) * 0.03;
    const step = (3 + r() * 1.5) * Math.max(0.6, unit);
    for (let i = 0; i < life; i++) {
      curv += (r() - 0.5) * 0.014;
      curv *= 0.93;
      a += curv;
      // soft envelope keeps the sculpture compact
      const dx = (x - bound.x) / bound.rx, dy = (y - bound.y) / bound.ry;
      const d = Math.hypot(dx, dy);
      // irregular lobed envelope: fibers taper off at the edge instead of curling back
      const ang = Math.atan2(dy, dx);
      const lim = 0.85 + 0.22 * Math.sin(3 * ang + 1.3) + 0.14 * Math.sin(5 * ang + 0.4);
      if (d > lim) break;
      if (d > lim * 0.8) {
        let diff = Math.atan2(bound.y - y, bound.x - x) - a;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        a += diff * 0.012;
      }
      x += Math.cos(a) * step; y += Math.sin(a) * step;
      pts.push([x, y]);
      const bp = depth === 0 ? 0.08 : depth === 1 ? 0.06 : 0.04;
      if (depth < 3 && i > 6 && r() < bp) {
        const side = r() < 0.5 ? -1 : 1;
        if (r() < 0.35) synapses.push({ x, y, r: (0.7 + r() * 1.1) * (depth === 0 ? 1.3 : 1), hue });
        grow(x, y, a + side * (0.3 + r() * 0.6), wd * (0.45 + r() * 0.15), (life - i) * (0.4 + r() * 0.35), depth + 1, r() < 0.05 ? pickHue(r) : hue);
      }
    }
    synapses.push({ x, y, r: 0.6 + r() * 0.6, hue });
    fibers.push({ pts, w: wd, hue, light: (hue > 280 ? 40 : 50) + r() * 16 + (depth === 0 ? 6 : 0) });
  };

  for (const c of hubs) {
    const base = r() * Math.PI * 2;
    for (let i = 0; i < c.trunks; i++) {
      const a = base + (i / c.trunks) * Math.PI * 2 + (r() - 0.5) * 0.9;
      const hue = r() < 0.06 ? 295 + r() * 20 : 180 + r() * 30;
      grow(c.x + gauss() * 6, c.y + gauss() * 6, a, 1.1 + r() * r() * 1.6, 38 + r() * 55, 0, hue);
    }
    synapses.push({ x: c.x, y: c.y, r: 1.8, hue: 190 });
  }
  // A handful of faint free wisps for depth
  for (let i = 0; i < 16; i++) {
    const c = hubs[Math.floor(r() * hubs.length)]!;
    grow(c.x + gauss() * bound.rx * 0.5, c.y + gauss() * bound.ry * 0.5, r() * Math.PI * 2, 0.35 + r() * 0.3, 40 + r() * 60, 2, pickHue(r));
  }
  const dust = Array.from({ length: 140 }, () => ({
    x: bound.x + gauss() * bound.rx * 1.3, y: bound.y + gauss() * bound.ry * 1.4, r: r() * 0.7 + 0.2, p: r() * Math.PI * 2, hue: pickHue(r),
  }));
  return { fibers, synapses, dust, clusters };
}

function strokeFiber(ctx: CanvasRenderingContext2D, pts: Pt[]) {
  ctx.beginPath();
  ctx.moveTo(pts[0]![0], pts[0]![1]);
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i]![0] + pts[i + 1]![0]) / 2, my = (pts[i]![1] + pts[i + 1]![1]) / 2;
    ctx.quadraticCurveTo(pts[i]![0], pts[i]![1], mx, my);
  }
  ctx.stroke();
}

export function NeuralField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0, data: ReturnType<typeof generate>, stat: HTMLCanvasElement, W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let pulses: { f: number; t: number; v: number }[] = [];

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      data = generate(W, H);
      stat = document.createElement("canvas");
      stat.width = W * dpr; stat.height = H * dpr;
      const s = stat.getContext("2d")!;
      s.scale(dpr, dpr);
      // faint asymmetric haze
      for (const c of data.clusters) {
        const g = s.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.rx * 1.3);
        g.addColorStop(0, "hsla(195,90%,40%,0.035)");
        g.addColorStop(1, "hsla(220,80%,20%,0)");
        s.fillStyle = g;
        s.fillRect(0, 0, W, H);
      }
      s.globalCompositeOperation = "lighter";
      s.lineCap = "round";
      for (const f of data.fibers) {
        s.strokeStyle = `hsla(${f.hue},95%,${f.light}%,0.05)`;
        s.lineWidth = f.w * 3.2;
        strokeFiber(s, f.pts);
      }
      for (const f of data.fibers) {
        s.strokeStyle = `hsla(${f.hue},95%,${f.light}%,${0.32 + Math.min(f.w, 2.5) * 0.18})`;
        s.lineWidth = f.w * 0.75;
        strokeFiber(s, f.pts);
      }
      for (const n of data.synapses) {
        const g = s.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.r * 3);
        g.addColorStop(0, `hsla(${n.hue},100%,82%,0.6)`);
        g.addColorStop(1, `hsla(${n.hue},100%,60%,0)`);
        s.fillStyle = g;
        s.fillRect(n.x - n.r * 3, n.y - n.r * 3, n.r * 6, n.r * 8);
      }
      const long = data.fibers.map((f, i) => ({ i, l: f.pts.length })).filter((x) => x.l > 30);
      pulses = Array.from({ length: reduce ? 0 : 18 }, () => {
        const f = long[Math.floor(Math.random() * long.length)]!.i;
        return { f, t: Math.random() * data.fibers[f]!.pts.length, v: 0.4 + Math.random() * 0.9 };
      });
      draw(0);
    };

    const draw = (time: number) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(stat, 0, 0);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalCompositeOperation = "lighter";
      for (const d of data.dust) {
        const a = reduce ? 0.5 : 0.08 + 0.18 * Math.sin(time * 0.0012 + d.p);
        ctx.fillStyle = `hsla(${d.hue},100%,80%,${a})`;
        ctx.fillRect(d.x, d.y, d.r, d.r);
      }
      ctx.lineCap = "round";
      for (const p of pulses) {
        const pts = data.fibers[p.f]!.pts;
        p.t += p.v * 0.6;
        if (p.t >= pts.length) {
          p.f = Math.floor(Math.random() * data.fibers.length);
          p.t = 0;
          continue;
        }
        const i = Math.floor(p.t), tail = Math.max(0, i - 14);
        const hue = data.fibers[p.f]!.hue;
        ctx.beginPath();
        ctx.moveTo(pts[tail]![0], pts[tail]![1]);
        for (let k = tail + 1; k <= i; k++) ctx.lineTo(pts[k]![0], pts[k]![1]);
        const g = ctx.createLinearGradient(pts[tail]![0], pts[tail]![1], pts[i]![0], pts[i]![1]);
        g.addColorStop(0, `hsla(${hue},100%,70%,0)`);
        g.addColorStop(1, `hsla(${hue},100%,85%,0.55)`);
        ctx.strokeStyle = g;
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.fillStyle = `hsla(${hue},100%,90%,0.6)`;
        ctx.fillRect(pts[i]![0] - 1, pts[i]![1] - 1, 2, 2);
      }
      ctx.globalCompositeOperation = "source-over";
      if (!reduce) raf = requestAnimationFrame(draw);
    };

    build();
    let to: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(to);
      to = setTimeout(() => { cancelAnimationFrame(raf); build(); }, 150);
    });
    ro.observe(canvas);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); clearTimeout(to); };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}