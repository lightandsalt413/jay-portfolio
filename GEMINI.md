# GEMINI.md — Project Constitution
## Protocol Zero: Master Plan for JAY Portfolio

---

## 🎯 Project Mission (Northstar Outcome)

A **professional, modern, and fast** personal portfolio website that positions JAY as a premium Creative Developer & Social Media Specialist.

### Core Objectives
1. **Showcase expertise** — Resume, skills, and professional identity
2. **Present work** — Case studies of completed projects with measurable outcomes
3. **Generate leads** — Functional "Contact Me" pipeline for clients and employers
4. **Perform flawlessly** — Sub-2-second load times, 90+ Lighthouse scores

---

## 👤 Target Audience

| Audience | What They Want | How We Serve Them |
|---|---|---|
| **Potential Clients** | Proof of capability, clear services, easy contact | Case studies, services section, contact form |
| **Employers/Recruiters** | Skills overview, work history, downloadable resume | Resume section, project grid, PDF download |
| **Collaborators** | Creative vision, technical range | Design aesthetic, toolkit section, GitHub link |
| **Industry Peers** | Inspiration, networking | Premium design, social links |

---

## 🏗️ Technical Direction

### Current State
- **Repository:** `https://github.com/lightandsalt413/jay-portfolio.git`
- **Hosting:** GitHub Pages (`lightandsalt413.github.io/jay-portfolio`)
- **Stack:** Vanilla HTML/CSS/JS
- **Design:** Navy (#0d1117) + Gold (#FFD700) editorial theme

### Proposed Evolution
- **Framework:** Next.js (Static Export) — for component reuse, image optimization, and routing
- **Hosting:** Vercel — automatic deployments from GitHub, edge CDN, analytics
- **Content:** Markdown files for case studies (no CMS needed initially)
- **Assets:** Next.js Image component for automatic WebP/AVIF conversion
- **Forms:** Formspree or Vercel Serverless Functions for contact

### Design Language
- **Aesthetic:** Minimalist with "anti-gravity" floating effects
- **Palette:** Navy Blue (#0d1117), Gold (#FFD700), White/Gray
- **Typography:** Playfair Display (serif headings), Inter (sans-serif body)
- **Motion:** Smooth scroll, parallax, subtle shadows, floating elements
- **Responsive:** Mobile-first, 3 breakpoints (600px, 968px, 1200px)

---

## 📐 Site Architecture

```
/
├── Home (Hero + Intro + Statements)
├── About (Bio + Skills + Stats)
├── Projects (Case Studies x3-4)
│   ├── /projects/deeply-rooted
│   ├── /projects/fzi-construction
│   └── /projects/rebel-family-motors
├── Services (Creative Direction, Dev, Social Media)
├── Contact (Form + Email + Links)
└── Resume (Downloadable PDF)
```

---

## 📏 Success Metrics

| Metric | Target |
|---|---|
| Lighthouse Performance | > 90 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Mobile Responsive | 100% |
| SEO Score | > 90 |
| Contact Form Conversion | Functional |

---

## 🔒 Constraints & Rules

1. **No framework bloat** — If vanilla HTML/CSS/JS achieves the goal, prefer simplicity
2. **Progressive enhancement** — Site must work without JavaScript
3. **Performance first** — Every image optimized, every animation GPU-accelerated
4. **Accessibility** — Semantic HTML, ARIA labels, keyboard navigation
5. **SEO** — Meta tags, Open Graph, structured data on every page

---

## 📅 Version History

| Date | Version | Changes |
|---|---|---|
| 2026-05-05 | v0.1 | Initial GEMINI.md — Protocol Zero |

---

> **This document is the single source of truth for all project decisions.**
> Any deviation must be justified and documented here.
