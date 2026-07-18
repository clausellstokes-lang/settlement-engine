/* THE SURVEY OF ONE SETTLEMENT — travel-and-stop scroll architecture.
   The film runs ONLY inside travel legs (chapters); at every stop it freezes on
   the landing frame and crossfades to the crisp stop still (the approved plate).
   Content height never desyncs the film: stops cost no film time at all.
   No ScrollTrigger pins anywhere; reduced-motion and touch get stills only. */

import Lenis from "lenis";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const touchMode = matchMedia("(hover: none), (max-width: 768px)").matches;
const bgVideo = document.getElementById("bgv");
const stills = [...document.querySelectorAll(".bg-still")];
const filmLive = bgVideo && !reducedMotion && !touchMode;

if (!filmLive && bgVideo) bgVideo.style.display = "none";

/* ── Smooth scroll ───────────────────────────────────────────────────── */

let lenis = null;
if (!reducedMotion) {
  lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ── The journey map: measure legs and stops ─────────────────────────── */

const LEGS = 6; /* film chapters, in document order */
let ranges = [];

function measure() {
  ranges = [...document.querySelectorAll(".leg")].map((el, i) => {
    const r = el.getBoundingClientRect();
    const top = r.top + window.scrollY;
    return { i, top, bottom: top + r.height };
  });
}

measure();
addEventListener("resize", () => { measure(); apply(); });

/* ── The conductor: film time + active still from scroll position ────── */

let lastVideoT = -1;
let videoReady = false;
let activeStill = 0;

function setStill(n, showFilm) {
  if (n !== activeStill) {
    stills.forEach((el) => { el.style.opacity = el.dataset.still === String(n) ? "1" : "0"; });
    activeStill = n;
  } else if (stills.length && stills[n] && stills[n].style.opacity !== "1" && !showFilm) {
    stills[n].style.opacity = "1";
  }
  if (filmLive) bgVideo.style.opacity = showFilm ? "1" : "0";
  if (!showFilm && filmLive) {
    /* keep the frozen frame consistent under the still */
    const chapter = bgVideo.duration / LEGS;
    const t = Math.min(bgVideo.duration - 0.05, Math.max(0, n * chapter - 0.05));
    if (videoReady && Math.abs(t - lastVideoT) > 0.02) { bgVideo.currentTime = t; lastVideoT = t; }
  }
}

function apply() {
  const y = window.scrollY + innerHeight * 0.5; /* judge by viewport center */
  let inLeg = -1, legP = 0, stopsPassed = 0;

  for (const r of ranges) {
    if (y >= r.bottom) stopsPassed = r.i + 1;
    else if (y >= r.top) { inLeg = r.i; legP = (y - r.top) / (r.bottom - r.top); break; }
    else break;
  }

  if (inLeg >= 0 && filmLive && videoReady) {
    const chapter = bgVideo.duration / LEGS;
    const t = Math.min(bgVideo.duration - 0.05, (inLeg + legP) * chapter);
    /* The nearest stop still stays visible as the FLOOR (covers unbuffered
       seeks); the film sits above it and fades at the leg's mouth and end. */
    const edge = Math.min(legP / 0.08, (1 - legP) / 0.08, 1);
    bgVideo.style.opacity = String(Math.max(0, Math.min(1, edge)));
    const floor = legP < 0.5 ? inLeg : inLeg + 1;
    stills.forEach((el) => {
      el.style.opacity = Number(el.dataset.still) === floor ? "1" : "0";
    });
    activeStill = floor;
    if (Math.abs(t - lastVideoT) > 0.008) { bgVideo.currentTime = t; lastVideoT = t; }
  } else {
    setStill(stopsPassed, false);
  }
}

if (filmLive) {
  bgVideo.pause();
  const markReady = () => {
    videoReady = bgVideo.readyState >= 2 && bgVideo.duration > 0;
    if (videoReady) apply();
  };
  bgVideo.addEventListener("loadedmetadata", markReady);
  bgVideo.addEventListener("canplay", markReady);
  markReady();
}

if (lenis) lenis.on("scroll", apply);
addEventListener("scroll", apply, { passive: true });
apply();

/* ── Reveals: documents laid down ────────────────────────────────────── */

if (!reducedMotion) {
  document.querySelectorAll(".reveal").forEach((el) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 82%", once: true },
    });
  });
  ScrollTrigger.refresh();
}

/* ── Dev hooks ───────────────────────────────────────────────────────── */

if (import.meta.env.DEV) {
  window.__lenis = lenis;
  window.__ST = ScrollTrigger;
  window.__bgv = bgVideo;
  window.__apply = apply;
  window.__ranges = () => ranges;
}
