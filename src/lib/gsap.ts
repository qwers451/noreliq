"use client";

import { gsap } from "gsap";

/** Кривые и длительности продублированы из globals.css (--ease-*, --dur-*). */
export const EASE = {
  outExpo: "expo.out",
  inOutQuart: "power4.inOut",
} as const;

export const DUR = {
  fast: 0.3,
  base: 0.6,
  slow: 1.1,
} as const;

export { gsap };
