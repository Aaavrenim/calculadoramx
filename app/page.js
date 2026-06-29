"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

function useCountUp(target, start, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return val;
}

function useParallax() {
  const [scrollY, setScrollY] = useState(0);
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => { setScrollY(window.scrollY); ticking = false; });
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrollY;
}

const GHOST_CARDS = [
  { ico: "💼", txt: "Renuncié tras 4 años y no sabía cuánto me tocaba.", speed: 0.35, size: "m" },
  { ico: "👧", txt: "Necesitaba saber cuánto pedir para mis dos hijos.", speed: 0.55, size: "s" },
  { ico: "🏛️", txt: "Quería estimar mi pensión antes de los 60.", speed: 0.22, size: "l" },
  { ico: "📋", txt: "Mi papá falleció sin testamento.", speed: 0.48, size: "m" },
  { ico: "💼", txt: "Me despidieron sin causa, no sabía mis derechos.", speed: 0.40, size: "s" },
  { ico: "👧", txt: "El papá de mi hija es extranjero.", speed: 0.60, size: "m" },
  { ico: "🏛️", txt: "No sabía mis semanas cotizadas.", speed: 0.30, size: "s" },
  { ico: "📋", txt: "Éramos 3 hermanos repartiendo la herencia.", speed: 0.50, size: "l" },
  { ico: "💼", txt: "Me pagaban en efectivo, ¿tengo derecho igual?", speed: 0.42, size: "m" },
  { ico: "👧", txt: "Quería un monto justo antes del juzgado.", speed: 0.28, size: "s" },
  { ico: "🏛️", txt: "¿Me conviene el régimen del 73 o del 97?", speed: 0.58, size: "m" },
  { ico: "📋", txt: "¿Hereda mi esposa o también mis papás?", speed: 0.36, size: "s" },
  { ico: "💼", txt: "Llevaba 12 años, ¿cuánto de prima de antigüedad?", speed: 0.46, size: "l" },
  { ico: "👧", txt: "Calculé la pensión sin pagar abogado.", speed: 0.26, size: "m" },
];

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [statsRef, statsVisible] = useReveal(0.4);
  const [pillsRef, pillsVisible] = useReveal();
  const [trustRef, trustVisible] = useReveal();
  const scrollY = useParallax();

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 60);
    return () => clearTimeout(t);
  }, []);

  const c1 = useCountUp(4, statsVisible, 1000);

  return (
    <main className="page">
      <div className="ghost-layer">
        {GHOST_CARDS.map((c, i) => (
          <div key={i} className={`ghostcard gc-${i} size-${c.size}`} style={{ transform: `translateY(${-scrollY * c.speed}px)` }}>
            <div className="gc-head">
              <div className="gc-ava">{c.ico}</div>
              <div className="gc-lines"><div className="gc-l1" /><div className="gc-l2" /></div>
            </div>
            <div className="gc-txt">{c.txt}</div>
          </div>
        ))}
      </div>

      {/* HEADER */}
      <header className="navwrap">
        <nav className="nav">
          <div className="logo">Calculadora<span>MX</span></div>
          <div className="navlinks">
            <a href="#calculadoras">Calculadoras</a>
            <a href="#confianza">Confianza</a>
          </div>
          <div className="navbtns">
            <a href="#calculadoras" className="nav-outline">Ver todas</a>
            <Link href="/blog" className="nav-solid">Artículos</Link>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="bg-gradient" />
        <div className="hero-content">
          <div className={`anim eyebrow-pill ${loaded ? "in" : ""}`} style={{ transitionDelay: "100ms" }}>
            <span className="dot" />
            CALCULADORAS LEGALES GRATIS · MÉXICO
          </div>
          <h1 className="hero-title">
            <span className={`anim title-line ${loaded ? "in" : ""}`} style={{ transitionDelay: "250ms" }}>¿Sabes cuánto</span>
            <span className={`anim title-line grad ${loaded ? "in" : ""}`} style={{ transitionDelay: "400ms" }}>te corresponde?</span>
          </h1>
          <p className={`anim hero-sub ${loaded ? "in" : ""}`} style={{ transitionDelay: "580ms" }}>
            Calcula lo que la ley mexicana dice que te pertenece. Gratis, sin registro y sin tarjeta — en menos de un minuto.
          </p>
          <div className={`anim stats ${loaded ? "in" : ""}`} style={{ transitionDelay: "720ms" }} ref={statsRef}>
            <div className="stat"><div className="stat-num blue">{Math.round(c1)}</div><div className="stat-label">Calculadoras</div></div>
            <div className="stat divider"><div className="stat-num dark">1 min</div><div className="stat-label">Sin esperas</div></div>
            <div className="stat"><div className="stat-num green" style={{ fontSize: "clamp(22px, 6vw, 30px)" }}>🔒</div><div className="stat-label">Privado y anónimo</div></div>
          </div>
          <div className={`anim cta-row ${loaded ? "in" : ""}`} style={{ transitionDelay: "860ms" }}>
            <a href="#calculadoras" className="btn-primary" style={{ background: "#1847f0", color: "#fff", fontSize: 15, fontWeight: 700, padding: "14px 26px", borderRadius: 100, textDecoration: "none", boxShadow: "0 6px 20px rgba(24,71,240,0.25)" }}>
              Ver las calculadoras ↓
            </a>
            <div className="gratis-seal">
              <span className="gs-pct">100%</span>
              <span className="gs-txt">Gratis</span>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULADORAS */}
      <section id="calculadoras" className="section" ref={pillsRef}>
        <div className={`section-head ${pillsVisible ? "in" : ""}`}>
          <div className="eyebrow">LAS CALCULADORAS</div>
          <h2 className="section-title">Cuatro temas. <span className="grad">Una respuesta clara.</span></h2>
          <p className="section-sub">Cada calculadora está basada en una ley distinta. Elige la que necesites — todas son gratis.</p>
        </div>
        <div className="cards">
          <CalcCard delay={0} visible={pillsVisible} href="/finiquito" emoji="💼" title="Finiquito Laboral" desc="¿Renunciaste o te despidieron? Calcula lo que te corresponde." tag="LFT vigente" featured />
          <CalcCard delay={90} visible={pillsVisible} href="/pension-alimenticia" emoji="👧" title="Pensión Alimenticia" desc="Estima cuánto le corresponde a tus hijos por ley." tag="Código Civil" />
          <CalcCard delay={180} visible={pillsVisible} href="/pension-imss" emoji="🏛️" title="Pensión IMSS" desc="Calcula tu jubilación estimada según tus semanas cotizadas." tag="Ley del Seguro Social" />
          <CalcCard delay={270} visible={pillsVisible} href="/herencias" emoji="📋" title="Herencias" desc="¿Quién hereda y cuánto si no hay testamento?" tag="Código Civil" />
        </div>
      </section>

      {/* ARTÍCULOS */}
      <section style={{ background: "#f4f5ff", padding: "56px 20px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#1847f0", letterSpacing: "1.8px", marginBottom: 12 }}>ARTÍCULOS</div>
            <h2 style={{ fontSize: "clamp(24px,6vw,36px)", fontWeight: 800, color: "#0a0f1e", letterSpacing: -1, marginBottom: 10 }}>
              Guías legales <span style={{ background: "linear-gradient(100deg,#1847f0,#6d5cff)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>gratuitas</span>
            </h2>
            <p style={{ fontSize: 15, color: "#6b7280", fontWeight: 500 }}>Todo lo que necesitas saber sobre tus derechos, explicado en términos simples.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { href: "/blog/renuncia-vs-despido", emoji: "💼", titulo: "¿Cuánto me corresponde si renuncio vs si me despiden?", tag: "Finiquito" },
              { href: "/blog/prima-de-antiguedad", emoji: "💼", titulo: "¿Qué es la prima de antigüedad y cuándo te corresponde?", tag: "Finiquito" },
              { href: "/blog/como-se-calcula-pension-alimenticia", emoji: "👧", titulo: "¿Cómo se calcula la pensión alimenticia en México?", tag: "Pensión Alimenticia" },
              { href: "/blog/regimen-73-vs-97", emoji: "🏛️", titulo: "Régimen 73 vs Régimen 97: ¿cuál te aplica?", tag: "Pensión IMSS" },
              { href: "/blog/muerte-sin-testamento", emoji: "📋", titulo: "¿Qué pasa si alguien muere sin testamento en México?", tag: "Herencias" },
            ].map((a) => (
              <Link key={a.href} href={a.href} style={{ textDecoration: "none" }}>
                <div style={{ background: "#fff", border: "1.5px solid #e8eaff", borderRadius: 14, padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{a.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#1847f0", background: "#eef0ff", padding: "2px 8px", borderRadius: 100, marginBottom: 6, display: "inline-block" }}>{a.tag.toUpperCase()}</span>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#0a0f1e" }}>{a.titulo}</p>
                  </div>
                  <span style={{ color: "#1847f0", fontWeight: 700, fontSize: 16 }}>→</span>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <Link href="/blog" style={{ background: "#1847f0", color: "#fff", fontSize: 14, fontWeight: 700, padding: "12px 28px", borderRadius: 100, textDecoration: "none", display: "inline-block" }}>
              Ver todos los artículos →
            </Link>
          </div>
        </div>
      </section>

      <HowItWorks />

      {/* CONFIANZA */}
      <section id="confianza" className="trust-section" ref={trustRef}>
        <div className={`section-head ${trustVisible ? "in" : ""}`}>
          <div className="eyebrow light">POR QUÉ CONFIAR</div>
          <h2 className="section-title light">Gratis de verdad. <span className="grad-light">Sin trucos.</span></h2>
          <p className="section-sub light">No somos un gancho para venderte algo después.</p>
        </div>
        <div className="trust-grid">
          <TrustItem text="No pedimos tarjeta de crédito en ningún momento" visible={trustVisible} delay={0} />
          <TrustItem text="No hay versión de paga ni planes premium" visible={trustVisible} delay={100} />
          <TrustItem text="Cálculos basados en leyes mexicanas vigentes" visible={trustVisible} delay={200} />
          <TrustItem text="Resultado inmediato, sin registro ni correo" visible={trustVisible} delay={300} />
        </div>
        <Link href="/finiquito" className="btn-primary big" style={{ display: "inline-block", background: "#1847f0", color: "#fff", fontSize: 16, fontWeight: 700, padding: "16px 32px", borderRadius: 100, textDecoration: "none", marginTop: 28, boxShadow: "0 6px 20px rgba(24,71,240,0.25)" }}>
          Empezar ahora — es gratis
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">Calculadora<span>MX</span></div>
        <div className="footer-links">
          <Link href="/finiquito">Finiquito</Link>
          <Link href="/pension-alimenticia">Pensión Alimenticia</Link>
          <Link href="/pension-imss">Pensión IMSS</Link>
          <Link href="/herencias">Herencias</Link>
          <Link href="/blog">Artículos</Link>
        </div>
        <div className="footer-links muted">
          <Link href="/privacidad">Política de Privacidad</Link>
          <Link href="/terminos">Términos</Link>
          <Link href="/contacto">Contacto</Link>
        </div>
        <div className="footer-legal">
          Los resultados son estimaciones informativas y no constituyen asesoría legal profesional.<br />© 2026 CalculadoraMX — Siempre gratis.
        </div>
      </footer>

      <style jsx>{`
        .page { min-height: 100vh; background: #fafbff; overflow-x: hidden; }
        .page :global(a) { text-decoration: none; }
        .anim { opacity: 0; transform: translateY(20px); transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .anim.in { opacity: 1; transform: translateY(0); }
        .navwrap { position: sticky; top: 12px; z-index: 50; padding: 0 16px; display: flex; justify-content: center; }
        .nav { width: 100%; max-width: 860px; background: #fff; border: 1px solid #eef2ff; border-radius: 100px; box-shadow: 0 8px 30px rgba(24,71,240,0.10); padding: 9px 9px 9px 20px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .logo { font-size: 16px; font-weight: 800; color: #0a0f1e; letter-spacing: -0.4px; white-space: nowrap; }
        .logo span { color: #1847f0; }
        .navlinks { display: none; gap: 22px; }
        .navlinks a { font-size: 13px; color: #4b5563; font-weight: 500; }
        .navlinks a:hover { color: #1847f0; }
        .navbtns { display: flex; align-items: center; gap: 8px; }
        .nav-outline { display: none; font-size: 13px; font-weight: 700; color: #0a0f1e; padding: 9px 16px; border-radius: 100px; border: 1px solid #e5e7eb; transition: border-color 0.15s; }
        .nav-outline:hover { border-color: #1847f0; }
        .nav-solid { background: #1847f0; color: #fff; font-size: 13px; font-weight: 700; padding: 10px 18px; border-radius: 100px; white-space: nowrap; transition: background 0.15s; }
        .nav-solid:hover { background: #1338d0; }
        .hero { position: relative; padding: 60px 20px 52px; text-align: center; overflow: visible; min-height: 580px; }
        .bg-gradient { position: absolute; inset: 0; z-index: 0; pointer-events: none; background: radial-gradient(ellipse 80% 50% at 50% 0%, rgba(232,234,255,0.7) 0%, transparent 60%), linear-gradient(180deg, rgba(244,245,255,0.5) 0%, transparent 60%); }
        .ghost-layer { position: absolute; top: 0; left: 0; right: 0; height: 1400px; z-index: 1; pointer-events: none; overflow: hidden; }
        .ghostcard { position: absolute; background: rgba(255,255,255,0.55); border: 1px solid rgba(255,255,255,0.7); border-radius: 14px; padding: 12px; filter: blur(2.5px); opacity: 0.6; will-change: transform; box-shadow: 0 8px 24px rgba(24,71,240,0.05); }
        .size-s { width: 145px; } .size-m { width: 175px; } .size-l { width: 205px; }
        .gc-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
        .gc-ava { font-size: 16px; opacity: 0.5; }
        .gc-lines { flex: 1; }
        .gc-l1 { height: 5px; width: 60%; background: rgba(10,15,30,0.18); border-radius: 3px; margin-bottom: 4px; }
        .gc-l2 { height: 5px; width: 40%; background: rgba(10,15,30,0.12); border-radius: 3px; }
        .gc-txt { font-size: 9.5px; color: rgba(10,15,30,0.30); line-height: 1.5; text-align: left; }
        .gc-0 { top: 90px; left: -40px; } .gc-1 { top: 180px; right: -50px; } .gc-2 { top: 380px; left: -45px; }
        .gc-3 { top: 520px; right: -40px; } .gc-4 { top: 60px; left: 30%; opacity: 0.4; } .gc-5 { top: 300px; right: 24%; opacity: 0.4; }
        .gc-6 { top: 680px; left: 8%; opacity: 0.42; } .gc-7 { top: 880px; left: 30%; opacity: 0.4; } .gc-8 { top: 140px; left: 12%; opacity: 0.42; }
        .gc-9 { top: 460px; right: 6%; opacity: 0.4; } .gc-10 { top: 760px; right: 22%; opacity: 0.4; } .gc-11 { top: 1000px; left: 10%; opacity: 0.38; }
        .gc-12 { top: 1080px; right: 12%; opacity: 0.38; } .gc-13 { top: 600px; left: 38%; opacity: 0.36; }
        @media (max-width: 560px) {
          .gc-4, .gc-5, .gc-6, .gc-7, .gc-8, .gc-9, .gc-10, .gc-11, .gc-12, .gc-13 { display: none; }
          .size-s, .size-m, .size-l { width: 140px; }
        }
        .hero-content { position: relative; z-index: 3; max-width: 680px; margin: 0 auto; }
        .hero-title { font-size: clamp(38px, 12vw, 72px); font-weight: 800; line-height: 1.0; letter-spacing: -2px; color: #0a0f1e; margin-bottom: 20px; }
        .title-line { display: block; filter: blur(8px); opacity: 0; transform: translateY(24px); transition: opacity 0.8s cubic-bezier(0.22,1,0.36,1), transform 0.8s cubic-bezier(0.22,1,0.36,1), filter 0.8s cubic-bezier(0.22,1,0.36,1); }
        .title-line.in { filter: blur(0); opacity: 1; transform: translateY(0); }
        .eyebrow-pill { display: inline-flex; align-items: center; gap: 7px; background: rgba(255,255,255,0.92); border: 1px solid #d8dffb; border-radius: 100px; padding: 6px 14px; font-size: 11px; font-weight: 700; color: #1847f0; letter-spacing: 0.4px; margin-bottom: 22px; box-shadow: 0 2px 10px rgba(24,71,240,0.06); }
        .dot { width: 6px; height: 6px; border-radius: 50%; background: #22c55e; }
        .grad { background: linear-gradient(100deg, #1847f0 0%, #6d5cff 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-sub { font-size: clamp(15px, 4vw, 18px); color: #4b5563; font-weight: 500; line-height: 1.55; max-width: 460px; margin: 0 auto 32px; }
        .stats { background: #fff; border: 1px solid #eef2ff; border-radius: 18px; padding: 20px 10px; display: grid; grid-template-columns: 1fr 1fr 1fr; max-width: 440px; margin: 0 auto 28px; box-shadow: 0 12px 40px rgba(24,71,240,0.12); transition: opacity 0.7s, transform 0.7s, box-shadow 0.4s ease; }
        .stats.in:hover { box-shadow: 0 18px 50px rgba(24,71,240,0.18); transform: translateY(-3px); }
        .stat { text-align: center; }
        .stat.divider { border-left: 1px solid #eef2ff; border-right: 1px solid #eef2ff; }
        .stat-num { font-size: clamp(24px, 7vw, 34px); font-weight: 800; letter-spacing: -1px; line-height: 1; }
        .stat-num.blue { color: #1847f0; } .stat-num.dark { color: #0a0f1e; } .stat-num.green { color: #16a34a; }
        .stat-label { font-size: 10.5px; color: #9ca3af; font-weight: 600; margin-top: 5px; }
        .cta-row { display: flex; gap: 12px; justify-content: center; align-items: center; flex-wrap: wrap; }
        .btn-primary { transition: background 0.15s, transform 0.15s; }
        .btn-primary:hover { transform: translateY(-2px); }
        .gratis-seal { display: inline-flex; align-items: baseline; gap: 6px; background: #ecfdf5; border: 1.5px solid #6ee7b7; border-radius: 100px; padding: 11px 20px; }
        .gs-pct { font-size: 20px; font-weight: 800; color: #16a34a; letter-spacing: -0.5px; }
        .gs-txt { font-size: 14px; font-weight: 700; color: #16a34a; }
        .section { position: relative; z-index: 5; padding: 56px 20px 48px; max-width: 760px; margin: 0 auto; }
        .section-head { text-align: center; max-width: 560px; margin: 0 auto 36px; opacity: 0; transform: translateY(22px); transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .section-head.in { opacity: 1; transform: translateY(0); }
        .eyebrow { font-size: 11px; font-weight: 700; color: #1847f0; letter-spacing: 1.8px; margin-bottom: 12px; }
        .eyebrow.light { color: #6d8bff; }
        .section-title { font-size: clamp(26px, 7vw, 40px); font-weight: 800; letter-spacing: -1.2px; color: #0a0f1e; line-height: 1.08; margin-bottom: 12px; }
        .section-title.light { color: #fff; }
        .section-sub { font-size: 15px; color: #6b7280; line-height: 1.55; font-weight: 500; }
        .section-sub.light { color: rgba(255,255,255,0.6); }
        .grad-light { background: linear-gradient(100deg, #6d8bff 0%, #a78bff 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .cards { display: flex; flex-direction: column; gap: 12px; }
        .trust-section { background: #0a0f1e; padding: 56px 20px 56px; text-align: center; }
        .trust-grid { display: flex; flex-direction: column; gap: 14px; max-width: 480px; margin: 0 auto; text-align: left; }
        .footer { padding: 36px 20px 40px; background: #fff; max-width: 760px; margin: 0 auto; }
        .footer-logo { font-size: 15px; font-weight: 800; color: #0a0f1e; margin-bottom: 16px; }
        .footer-logo span { color: #1847f0; }
        .footer-links { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 16px; }
        .footer-links a { font-size: 13px; color: #374151; font-weight: 600; }
        .footer-links.muted a { font-size: 12px; color: #9ca3af; font-weight: 500; }
        .footer-legal { font-size: 10.5px; color: #b0bac9; line-height: 1.7; margin-top: 6px; }
        @media (min-width: 720px) {
          .navlinks { display: flex; }
          .nav-outline { display: inline-block; }
          .hero { padding: 88px 20px 72px; min-height: 640px; }
          .section { padding: 80px 20px; }
          .trust-section { padding: 80px 20px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .anim, .title-line, .section-head { transition: none !important; opacity: 1 !important; transform: none !important; filter: none !important; }
          .ghostcard { transform: none !important; }
        }
      `}</style>
    </main>
  );
}

function HowItWorks() {
  const [ref, visible] = useReveal(0.2);
  const steps = [
    { n: "1", emoji: "👆", title: "Elige tu calculadora", desc: "Finiquito, pensión, IMSS o herencias. La que necesites." },
    { n: "2", emoji: "✍️", title: "Responde unas preguntas", desc: "Datos simples como fechas y montos. Sin registro, sin correo." },
    { n: "3", emoji: "✅", title: "Conoce lo que te corresponde", desc: "Resultado inmediato con el desglose y la ley que lo respalda." },
  ];
  return (
    <section className="hiw" ref={ref}>
      <div className={`hiw-head ${visible ? "in" : ""}`}>
        <div className="hiw-eyebrow">CÓMO FUNCIONA</div>
        <h2 className="hiw-title">De la duda al resultado <span className="grad">en 1 minuto.</span></h2>
        <p className="hiw-sub">Sin abogados, sin citas, sin complicaciones.</p>
      </div>
      <div className="hiw-grid">
        {steps.map((s, i) => (
          <div key={i} className={`step ${visible ? "in" : ""}`} style={{ transitionDelay: `${i * 130}ms` }}>
            <div className="step-watermark">{s.n}</div>
            <div className="step-tag">PASO {s.n}</div>
            <div className="step-emoji">{s.emoji}</div>
            <h3 className="step-title">{s.title}</h3>
            <p className="step-desc">{s.desc}</p>
          </div>
        ))}
      </div>
      <style jsx>{`
        .hiw { position: relative; z-index: 5; background: #f4f5ff; padding: 56px 20px; }
        .hiw-head { text-align: center; max-width: 560px; margin: 0 auto 32px; opacity: 0; transform: translateY(20px); transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1); }
        .hiw-head.in { opacity: 1; transform: translateY(0); }
        .hiw-eyebrow { font-size: 11px; font-weight: 700; color: #1847f0; letter-spacing: 1.8px; margin-bottom: 12px; }
        .hiw-title { font-size: clamp(24px, 6.5vw, 36px); font-weight: 800; letter-spacing: -1px; color: #0a0f1e; line-height: 1.1; margin-bottom: 10px; }
        .grad { background: linear-gradient(100deg, #1847f0 0%, #6d5cff 100%); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .hiw-sub { font-size: 14.5px; color: #6b7280; font-weight: 500; }
        .hiw-grid { display: flex; flex-direction: column; gap: 14px; max-width: 760px; margin: 0 auto; }
        .step { position: relative; background: #fff; border: 1px solid #eef2ff; border-radius: 18px; padding: 24px 22px; overflow: hidden; opacity: 0; transform: translateY(22px); transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease; }
        .step.in { opacity: 1; transform: translateY(0); }
        .step:hover { box-shadow: 0 14px 36px rgba(24,71,240,0.10); }
        .step-watermark { position: absolute; right: 12px; bottom: -18px; font-size: 110px; font-weight: 800; color: #eef2ff; line-height: 1; z-index: 0; pointer-events: none; }
        .step-tag { position: relative; z-index: 1; display: inline-block; font-size: 10px; font-weight: 700; color: #1847f0; background: #eef2ff; padding: 4px 10px; border-radius: 100px; letter-spacing: 0.5px; margin-bottom: 14px; }
        .step-emoji { position: relative; z-index: 1; font-size: 32px; margin-bottom: 10px; }
        .step-title { position: relative; z-index: 1; font-size: 17px; font-weight: 800; color: #0a0f1e; letter-spacing: -0.3px; margin-bottom: 6px; }
        .step-desc { position: relative; z-index: 1; font-size: 13.5px; color: #6b7280; line-height: 1.55; font-weight: 500; max-width: 90%; }
        @media (min-width: 720px) { .hiw { padding: 80px 20px; } .hiw-grid { flex-direction: row; } .step { flex: 1; } }
        @media (prefers-reduced-motion: reduce) { .hiw-head, .step { transition: none !important; opacity: 1 !important; transform: none !important; } }
      `}</style>
    </section>
  );
}

function CalcCard({ href, emoji, title, desc, tag, featured, delay, visible }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div className={`cc ${visible ? "in" : ""}`} style={{ transitionDelay: `${delay}ms` }}>
        <div className="cc-row">
          <div className="cc-emoji">{emoji}</div>
          <div className="cc-body">
            <div className="cc-top">
              <h3 className="cc-title">{title}</h3>
              <span className="cc-badge">GRATIS</span>
              {featured && <span className="cc-pop">MÁS USADA</span>}
            </div>
            <p className="cc-desc">{desc}</p>
            <span className="cc-tag">{tag}</span>
          </div>
        </div>
        <div className="cc-btn">Calcular →</div>
        <style jsx>{`
          .cc { background: #fff; border: 1px solid #eef2ff; border-radius: 18px; padding: 20px; cursor: pointer; opacity: 0; transform: translateY(20px); transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease, border-color 0.2s ease; }
          .cc.in { opacity: 1; transform: translateY(0); }
          .cc:hover { box-shadow: 0 16px 40px rgba(24,71,240,0.14); transform: translateY(-4px); border-color: #c7d2fe; }
          .cc-row { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; }
          .cc-emoji { font-size: 30px; flex-shrink: 0; transition: transform 0.25s ease; }
          .cc:hover .cc-emoji { transform: scale(1.12) rotate(-5deg); }
          .cc-body { flex: 1; min-width: 0; text-align: left; }
          .cc-top { display: flex; align-items: center; gap: 7px; margin-bottom: 5px; flex-wrap: wrap; }
          .cc-title { font-size: 17px; font-weight: 800; color: #0a0f1e; letter-spacing: -0.3px; }
          .cc-badge { font-size: 9px; font-weight: 700; color: #1847f0; background: #eef2ff; padding: 3px 7px; border-radius: 5px; letter-spacing: 0.4px; }
          .cc-pop { font-size: 9px; font-weight: 700; color: #b45309; background: #fef3c7; padding: 3px 7px; border-radius: 5px; letter-spacing: 0.4px; }
          .cc-desc { font-size: 13px; color: #6b7280; line-height: 1.5; margin-bottom: 6px; font-weight: 500; }
          .cc-tag { font-size: 11px; color: #94a3b8; font-weight: 600; }
          .cc-btn { background: #1847f0; color: #fff; font-size: 14px; font-weight: 700; text-align: center; padding: 12px; border-radius: 12px; transition: background 0.15s ease; }
          .cc:hover .cc-btn { background: #1338d0; }
        `}</style>
      </div>
    </Link>
  );
}

function TrustItem({ text, visible, delay }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(14px)", transition: `opacity 0.5s ease ${delay}ms, transform 0.5s ease ${delay}ms` }}>
      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#1847f0", color: "#fff", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✓</div>
      <span style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.4 }}>{text}</span>
    </div>
  );
}