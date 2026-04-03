/*
 * TechWorX Manchester — Sovereign Edition
 * Copyright (C) 2026 TechWorX Manchester
 * SPDX-License-Identifier: GPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation, either version 3 of the License, or (at your option)
 * any later version.
 */

'use strict';

/* ─── Mobile Navigation ─────────────────────────────────────────────────── */
(function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.site-nav');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when a link is clicked (single-page navigation)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ─── Active Nav Link (scroll-spy) ─────────────────────────────────────── */
(function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.site-nav a[href^="#"]');
  if (!sections.length || !links.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(link => {
            const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
            link.setAttribute('aria-current', isCurrent ? 'page' : 'false');
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  sections.forEach(s => observer.observe(s));
})();

/* ─── Impact Tracker — load stats from JSON ─────────────────────────────── */
(function loadImpactStats() {
  /**
   * Animate a number from 0 to `target` over ~800 ms.
   * Respects prefers-reduced-motion by skipping the animation.
   *
   * @param {HTMLElement} el     - Element whose textContent to update
   * @param {number}      target - Final value
   */
  function animateCounter(el, target) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = target.toLocaleString();
      return;
    }

    const duration = 800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /**
   * Populate the four impact stat elements.
   *
   * @param {{ clients: number, kids: number, nodes: number, heartsGoal: number }} data
   */
  function renderStats(data) {
    const mapping = {
      'stat-clients': data.clients   || 0,
      'stat-kids':    data.kids      || 0,
      'stat-nodes':   data.nodes     || 0,
      'stat-hearts':  data.heartsGoal ? formatLargeNumber(data.heartsGoal) : 0,
    };

    Object.entries(mapping).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (typeof value === 'number') {
        animateCounter(el, value);
      } else {
        el.textContent = value; // pre-formatted string (e.g. "15B")
      }
    });
  }

  /**
   * Format large numbers as human-readable strings (e.g. 15000000000 → "15B").
   *
   * @param {number} n
   * @returns {string}
   */
  function formatLargeNumber(n) {
    if (n >= 1e9) return `${(n / 1e9).toLocaleString()}B`;
    if (n >= 1e6) return `${(n / 1e6).toLocaleString()}M`;
    if (n >= 1e3) return `${(n / 1e3).toLocaleString()}K`;
    return n.toLocaleString();
  }

  fetch('impact-data.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => renderStats(data))
    .catch(() => {
      // Fallback: show the goal; tracker not yet deployed or file missing.
      ['stat-clients', 'stat-kids', 'stat-nodes'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = '0';
      });
      const hearts = document.getElementById('stat-hearts');
      if (hearts) hearts.textContent = '15B';
    });
})();
