# AGENTS.md
> **AI Agent ke liye master instruction file.** Ye file SABSE PEHLE poori padho — phir ek bhi line likho.
> Human README: `README.md` | Version: 3.0 | 2025
> Author: Yousuf — Indie Hacker, AI SaaS Builder (India)

---

## 👤 Developer Identity

| Field | Value |
|---|---|
| Owner | Yousuf — Indie Hacker, AI SaaS Builder |
| Market | India-first (INR, Razorpay, Indian UX) + Global crypto/Web3 |
| Stack | React 18 + Vite + TypeScript + TailwindCSS |
| Backend | Node/Express OR Python FastAPI (match existing) |
| AI APIs | Anthropic Claude (`claude-sonnet-4-20250514`) · Google Gemini (`gemini-2.0-flash`) |
| State | Zustand (global) · React Query / TanStack Query (server state) |
| Package Manager | `pnpm` always — never npm/yarn unless lockfile forces it |
| Deploy | Vercel (frontend) · Railway / Render (backend) |
| Auth | Clerk OR Supabase Auth OR custom JWT — never roll your own crypto |
| DB | Supabase (Postgres) · DynamoDB (AWS) · localStorage (hackathon MVP) |

---

## 🧠 CORE MINDSET — Non-Negotiable

> You are a **senior full-stack engineer** who has shipped 50+ products.
> You think in systems, not features.
> Every file you touch should look like it belongs in a YC S25 batch.
> First reaction from anyone opening this project: **"Yeh kya cheez banayi hai."**

**The 5 Laws:**
1. **No ugly UI** — If it doesn't have depth, motion, and hierarchy, it's not done
2. **No broken mobile** — Every screen tested at 375px before marking done
3. **No dead states** — Every data fetch has loading skeleton + error + empty state
4. **No exposed secrets** — `.env` is sacred, never touched or logged
5. **No `any` without reason** — TypeScript strict is not optional

---

## 🎨 DESIGN SYSTEM

### CSS Variables (always in `src/styles/index.css`)

```css
:root {
  /* === BACKGROUNDS === */
  --bg-base:        #0a0a0f;
  --bg-surface:     #111118;
  --bg-elevated:    #16161f;
  --bg-overlay:     #1c1c28;

  /* === BORDERS === */
  --border-subtle:  #1e1e2e;
  --border-default: #2a2a3d;
  --border-active:  #6c63ff66;
  --border-focus:   #6c63ffaa;

  /* === BRAND === */
  --accent:         #6c63ff;
  --accent-dim:     #6c63ff80;
  --accent-2:       #ff6584;
  --accent-3:       #00d9a6;
  --accent-glow:    #6c63ff30;
  --accent-glow-lg: #6c63ff18;

  /* === TEXT === */
  --text-primary:   #e8e8f0;
  --text-secondary: #a0a0b8;
  --text-muted:     #6b6b80;
  --text-faint:     #3d3d50;

  /* === STATUS === */
  --success:        #4ade80;
  --success-dim:    #4ade8020;
  --warning:        #facc15;
  --warning-dim:    #facc1520;
  --error:          #f87171;
  --error-dim:      #f8717120;
  --info:           #60a5fa;
  --info-dim:       #60a5fa20;

  /* === SIZING === */
  --radius-sm:      6px;
  --radius-md:      12px;
  --radius-lg:      18px;
  --radius-xl:      24px;
  --radius-full:    9999px;
}
```

> **Per-project theming:** Override `--accent`, `--accent-2`, `--bg-base` at top of index.css.
> **Never** hardcode hex values inside components — always use CSS variables.

### Web3 / Crypto Project Theme Override
```css
/* For Solana/crypto projects */
:root {
  --accent:       #9eff00;      /* Neon lime */
  --accent-2:     #00d4ff;      /* Cyan */
  --accent-glow:  #9eff0025;
  --bg-base:      #080808;
  --bg-surface:   #0f0f0f;
  --bg-elevated:  #161616;
  --border-subtle:#1f1f1f;
}
```

### Indian SaaS / INR Product Theme Override
```css
/* For Indian market SaaS */
:root {
  --accent:       #7c3aed;      /* Violet */
  --accent-2:     #f59e0b;      /* Amber */
  --accent-glow:  #7c3aed25;
}
```

---

## 🔤 TYPOGRAPHY RULES

### Font Pairs (pick ONE pair per project)

| Display | Body | Mono | Best For |
|---|---|---|---|
| `Syne` | `DM Sans` | `JetBrains Mono` | SaaS, dashboards |
| `Outfit` | `Plus Jakarta Sans` | `Fira Code` | Creator tools |
| `Cabinet Grotesk` | `DM Sans` | `JetBrains Mono` | Startup landing |
| `Clash Display` | `Geist` | `JetBrains Mono` | Web3, crypto |
| `Neue Machina` | `DM Sans` | `JetBrains Mono` | Tech/AI products |
| `Bebas Neue` | `Plus Jakarta Sans` | `Fira Code` | Bold, aggressive |

**Import pattern (Google Fonts CDN in `index.html`):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

**Tailwind config (`tailwind.config.ts`):**
```ts
fontFamily: {
  display: ['Syne', 'sans-serif'],
  body:    ['DM Sans', 'sans-serif'],
  mono:    ['JetBrains Mono', 'monospace'],
}
```

**BANNED fonts:** Arial, Roboto, Inter, system-ui for any display/hero text — these are generic, banned.

### Type Scale
```css
.text-hero    { font-size: clamp(2.5rem, 6vw, 5rem); line-height: 1.05; letter-spacing: -0.02em; }
.text-display { font-size: clamp(1.8rem, 4vw, 3rem); line-height: 1.1; letter-spacing: -0.02em; }
.text-title   { font-size: clamp(1.25rem, 2vw, 1.75rem); line-height: 1.25; }
.text-body    { font-size: 1rem; line-height: 1.7; }
.text-small   { font-size: 0.875rem; line-height: 1.6; }
.text-tiny    { font-size: 0.75rem; line-height: 1.5; letter-spacing: 0.05em; }
```

---

## ✨ ANIMATIONS — REQUIRED IN EVERY PROJECT

> **Static UI = unfinished UI.** Every project ships with motion. No exceptions.

### Background — Pick AT LEAST ONE

**A — Animated Gradient Mesh (SaaS recommended)**
```css
.bg-mesh {
  background:
    radial-gradient(ellipse 80% 80% at 20% -20%, var(--accent-glow-lg) 0%, transparent 60%),
    radial-gradient(ellipse 60% 60% at 80% 110%, #ff658415 0%, transparent 60%),
    var(--bg-base);
}
```

**B — Floating Orbs (ambient depth)**
```css
.orb {
  position: absolute; border-radius: 50%;
  filter: blur(90px); pointer-events: none;
  animation: orbFloat 10s ease-in-out infinite;
}
.orb-1 { width: 600px; height: 600px; background: var(--accent-glow-lg); top: -200px; left: -150px; }
.orb-2 { width: 400px; height: 400px; background: #ff658415; bottom: -100px; right: -100px; animation-delay: -5s; }
.orb-3 { width: 300px; height: 300px; background: #00d9a615; top: 40%; left: 50%; animation-delay: -2s; }
@keyframes orbFloat {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33%       { transform: translate(40px, -50px) scale(1.08); }
  66%       { transform: translate(-30px, 25px) scale(0.93); }
}
```

**C — Animated Dot Grid**
```css
.bg-dots {
  background-image: radial-gradient(var(--accent-dim) 1px, transparent 1px);
  background-size: 28px 28px;
  opacity: 0.4;
}
```

**D — Moving Grid Lines**
```css
.bg-grid {
  background-image:
    linear-gradient(var(--border-subtle) 1px, transparent 1px),
    linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px);
  background-size: 52px 52px;
  animation: gridPan 25s linear infinite;
}
@keyframes gridPan {
  to { background-position: 52px 52px; }
}
```

**E — Noise texture overlay**
```css
.bg-noise::after {
  content: '';
  position: fixed; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none; z-index: 0; opacity: 0.4;
}
```

---

### Page Load (every page, every section)
```css
@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(32px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeSlideDown {
  from { opacity: 0; transform: translateY(-20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}

.animate-in       { animation: fadeSlideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) both; }
.animate-down     { animation: fadeSlideDown 0.5s cubic-bezier(0.22, 1, 0.36, 1) both; }
.animate-fade     { animation: fadeIn 0.5s ease both; }
.animate-scale    { animation: scaleIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }

/* Stagger children */
.stagger > *:nth-child(1) { animation-delay: 0ms; }
.stagger > *:nth-child(2) { animation-delay: 80ms; }
.stagger > *:nth-child(3) { animation-delay: 160ms; }
.stagger > *:nth-child(4) { animation-delay: 240ms; }
.stagger > *:nth-child(5) { animation-delay: 320ms; }
.stagger > *:nth-child(6) { animation-delay: 400ms; }
```

### Scroll-triggered (IntersectionObserver on all below-fold sections)
```tsx
// hooks/useScrollAnimation.ts
import { useEffect, useRef } from 'react'

export function useScrollAnimation(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add('in-view') },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])
  return ref
}

// CSS:
// .scroll-reveal { opacity: 0; transform: translateY(40px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1); }
// .scroll-reveal.in-view { opacity: 1; transform: translateY(0); }

// Usage:
// const ref = useScrollAnimation()
// <section ref={ref} className="scroll-reveal"> ... </section>
```

### Micro-interactions (apply to ALL interactive elements)
```css
/* Buttons */
.btn-base {
  position: relative; overflow: hidden;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.btn-base::before {
  content: ''; position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 60%);
  opacity: 0; transition: opacity 0.2s;
}
.btn-base:hover::before { opacity: 1; }
.btn-base:hover         { transform: translateY(-2px); box-shadow: 0 10px 40px var(--accent-glow); }
.btn-base:active        { transform: scale(0.97) translateY(0); }

/* Cards */
.card-base {
  border: 1px solid var(--border-subtle);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.card-base:hover {
  border-color: var(--border-active);
  transform: translateY(-6px);
  box-shadow: 0 32px 80px var(--accent-glow);
}

/* Input */
.input-base {
  border: 1px solid var(--border-subtle);
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  background: var(--bg-surface);
}
.input-base:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
  outline: none;
  background: var(--bg-elevated);
}
```

### Glow & Shimmer Effects
```css
/* Text gradient */
.text-gradient {
  background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 50%, var(--accent-2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.text-gradient-2 {
  background: linear-gradient(90deg, var(--accent) 0%, var(--accent-3) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Glow pulse (CTAs, important buttons) */
.glow-pulse { animation: glowPulse 2.5s ease-in-out infinite; }
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 0 20px var(--accent-glow); }
  50%       { box-shadow: 0 0 50px var(--accent), 0 0 80px var(--accent-glow); }
}

/* Shimmer (skeleton loading) */
.shimmer {
  background: linear-gradient(90deg, var(--bg-surface) 25%, var(--bg-elevated) 50%, var(--bg-surface) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  from { background-position: 200% 0; }
  to   { background-position: -200% 0; }
}

/* Rotating border glow */
.border-glow {
  position: relative;
}
.border-glow::before {
  content: ''; position: absolute; inset: -1px;
  border-radius: inherit;
  background: conic-gradient(from 0deg, transparent 0%, var(--accent) 20%, transparent 40%);
  animation: borderSpin 3s linear infinite;
  z-index: -1;
}
@keyframes borderSpin { to { transform: rotate(360deg); } }

/* Number counter animation */
.counter { font-variant-numeric: tabular-nums; }
```

### Loading States (3 variants — use context-appropriate)
```tsx
// 1. Skeleton (for content blocks)
export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`shimmer rounded-xl bg-[var(--bg-elevated)] ${className}`} />
)

// 2. Spinner (for buttons, inline)
export const Spinner = ({ size = 16 }: { size?: number }) => (
  <div
    style={{ width: size, height: size }}
    className="border-2 border-[var(--border-subtle)] border-t-[var(--accent)] rounded-full animate-spin"
  />
)

// 3. Pulse dots (for AI generation, processing)
export const PulseDots = () => (
  <div className="flex gap-1.5 items-center">
    {[0, 1, 2].map(i => (
      <div
        key={i}
        className="w-2 h-2 rounded-full bg-[var(--accent)]"
        style={{ animation: `pulseDot 1.2s ease-in-out ${i * 0.2}s infinite` }}
      />
    ))}
  </div>
)
// CSS: @keyframes pulseDot { 0%,80%,100%{opacity:0.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }
```

---

## 🏗️ COMPONENT STANDARDS

### Every component MUST have:
1. TypeScript interface for props (no `any`)
2. Loading skeleton state (never blank)
3. Error state (styled, not a red text dump)
4. Empty state (designed with icon + message + optional CTA)
5. Mobile responsive (375px min)
6. Hover / focus states on every interactive element
7. `aria-label` on icon-only buttons

### Card Component
```tsx
interface CardProps {
  title: string
  description?: string
  icon?: React.ReactNode
  badge?: string
  footer?: React.ReactNode
  onClick?: () => void
  className?: string
  glow?: boolean
}

export const Card = ({ title, description, icon, badge, footer, onClick, className, glow }: CardProps) => (
  <div
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    className={`
      relative group rounded-2xl p-6
      bg-[var(--bg-surface)] border border-[var(--border-subtle)]
      transition-all duration-300 cursor-pointer
      hover:border-[var(--accent)]/40 hover:-translate-y-1.5
      hover:shadow-[0_24px_80px_var(--accent-glow)]
      focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-2
      ${glow ? 'border-glow' : ''}
      ${className}
    `}
  >
    {/* Ambient glow on hover */}
    <div className="absolute inset-0 rounded-2xl bg-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

    {badge && (
      <span className="absolute top-4 right-4 text-xs font-medium px-2.5 py-1 rounded-full bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/20">
        {badge}
      </span>
    )}

    {icon && (
      <div className="mb-4 w-12 h-12 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center text-[var(--accent)] group-hover:scale-110 group-hover:bg-[var(--accent)]/20 transition-all duration-300">
        {icon}
      </div>
    )}

    <h3 className="font-display text-[var(--text-primary)] font-semibold text-lg mb-2 leading-snug">{title}</h3>
    {description && <p className="text-[var(--text-muted)] text-sm leading-relaxed">{description}</p>}
    {footer && <div className="mt-4 pt-4 border-t border-[var(--border-subtle)]">{footer}</div>}
  </div>
)
```

### Button Component
```tsx
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary:   'bg-[var(--accent)] text-white hover:brightness-110 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_var(--accent-glow)]',
  secondary: 'bg-transparent border border-[var(--accent)]/50 text-[var(--accent)] hover:bg-[var(--accent)]/10 hover:border-[var(--accent)]',
  ghost:     'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]',
  danger:    'bg-[var(--error)]/10 border border-[var(--error)]/40 text-[var(--error)] hover:bg-[var(--error)]/20',
  success:   'bg-[var(--success)]/10 border border-[var(--success)]/40 text-[var(--success)] hover:bg-[var(--success)]/20',
}
const sizes: Record<Size, string> = {
  xs: 'px-3 py-1.5 text-xs rounded-lg gap-1',
  sm: 'px-4 py-2 text-sm rounded-xl gap-1.5',
  md: 'px-6 py-3 text-base rounded-xl gap-2',
  lg: 'px-8 py-4 text-lg rounded-2xl gap-2.5',
  xl: 'px-10 py-5 text-xl rounded-2xl gap-3',
}

export const Button = ({
  variant = 'primary', size = 'md', loading, icon, iconPosition = 'left',
  fullWidth, children, className, ...props
}: ButtonProps) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className={`
      relative overflow-hidden font-medium
      flex items-center justify-center
      transition-all duration-200 active:scale-[0.97]
      disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none
      ${variants[variant]} ${sizes[size]}
      ${fullWidth ? 'w-full' : ''}
      ${className}
    `}
  >
    {/* Shine overlay on hover */}
    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
    {loading ? <Spinner size={16} /> : (iconPosition === 'left' && icon)}
    {children}
    {!loading && iconPosition === 'right' && icon}
  </button>
)
```

### Input Component
```tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  icon?: React.ReactNode
  suffix?: React.ReactNode
}

export const Input = ({ label, error, hint, icon, suffix, className, ...props }: InputProps) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-medium text-[var(--text-secondary)]">
        {label}
        {props.required && <span className="text-[var(--error)] ml-1">*</span>}
      </label>
    )}
    <div className="relative flex items-center">
      {icon && <div className="absolute left-3 text-[var(--text-muted)]">{icon}</div>}
      <input
        {...props}
        className={`
          w-full px-4 py-3 rounded-xl text-sm
          bg-[var(--bg-surface)] text-[var(--text-primary)]
          border border-[var(--border-subtle)]
          placeholder:text-[var(--text-faint)]
          focus:border-[var(--accent)] focus:shadow-[0_0_0_3px_var(--accent-glow)] focus:outline-none
          transition-all duration-200
          ${icon ? 'pl-10' : ''}
          ${suffix ? 'pr-10' : ''}
          ${error ? 'border-[var(--error)] focus:border-[var(--error)] focus:shadow-[0_0_0_3px_var(--error-dim)]' : ''}
          ${className}
        `}
      />
      {suffix && <div className="absolute right-3 text-[var(--text-muted)]">{suffix}</div>}
    </div>
    {error && <p className="text-xs text-[var(--error)] flex items-center gap-1">⚠ {error}</p>}
    {hint && !error && <p className="text-xs text-[var(--text-faint)]">{hint}</p>}
  </div>
)
```

### Badge Component
```tsx
type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'accent'

const badgeStyles: Record<BadgeVariant, string> = {
  default: 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border-[var(--border-default)]',
  success: 'bg-[var(--success-dim)] text-[var(--success)] border-[var(--success)]/30',
  warning: 'bg-[var(--warning-dim)] text-[var(--warning)] border-[var(--warning)]/30',
  error:   'bg-[var(--error-dim)] text-[var(--error)] border-[var(--error)]/30',
  info:    'bg-[var(--info-dim)] text-[var(--info)] border-[var(--info)]/30',
  accent:  'bg-[var(--accent)]/15 text-[var(--accent)] border-[var(--accent)]/30',
}

export const Badge = ({ children, variant = 'default', dot }: { children: React.ReactNode, variant?: BadgeVariant, dot?: boolean }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${badgeStyles[variant]}`}>
    {dot && <span className={`w-1.5 h-1.5 rounded-full bg-current`} />}
    {children}
  </span>
)
```

### Empty State Component
```tsx
interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
  action?: { label: string; onClick: () => void }
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-muted)] text-2xl mb-4">
      {icon}
    </div>
    <h3 className="text-[var(--text-primary)] font-semibold text-lg mb-2">{title}</h3>
    <p className="text-[var(--text-muted)] text-sm max-w-xs leading-relaxed mb-6">{description}</p>
    {action && (
      <Button onClick={action.onClick} size="sm">{action.label}</Button>
    )}
  </div>
)
```

### Toast / Notification System
```tsx
// Use react-hot-toast (pnpm add react-hot-toast)
import toast from 'react-hot-toast'

// Standard call patterns:
toast.success('Quest created! Share the link.')
toast.error('Something went wrong. Try again.')
toast.loading('Generating with AI...')
toast.promise(apiCall(), { loading: 'Saving...', success: 'Saved!', error: 'Failed.' })

// Config in App.tsx:
// <Toaster position="bottom-right" toastOptions={{
//   style: { background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border-default)' }
// }} />
```

---

## 🌐 LANDING PAGE BLUEPRINT

Every SaaS / product must follow this exact section order:

```
1.  NAVBAR        — Logo | Nav links | CTA button — sticky, backdrop-blur-xl, border-bottom on scroll
2.  HERO          — Gradient headline (clamp font-size) + sub + 2 CTAs + animated bg + floating badge/tag
3.  SOCIAL PROOF  — Avatars + "X creators trust Bags" OR logo strip (6 logos, grayscale → color on hover)
4.  PROBLEM       — "The Old Way vs New Way" 2-column comparison (optional but high-converting)
5.  FEATURES      — 3–6 cards, icon + title + desc, staggered animation, asymmetric layout
6.  HOW IT WORKS  — 3 steps numbered, connecting line/arrow, each step animates in on scroll
7.  DEMO          — Browser mockup or phone frame, screenshot with depth shadow + slow float animation
8.  PRICING       — INR, 3 tiers, center highlighted (glow border + "Most Popular"), annual/monthly toggle
9.  TESTIMONIALS  — Avatar + name + company + quote, horizontal scroll on mobile, star rating
10. FAQ           — Accordion, smooth open/close, schema markup for SEO
11. FINAL CTA     — Full-width section, gradient bg, big headline + single button + urgency copy
12. FOOTER        — Logo | links grid | social icons | copyright | "Made in India 🇮🇳"
```

### Hero Pattern
```tsx
// Hero must have:
// 1. Overline tag (e.g., "Now in Beta · 200+ users")
// 2. Headline: display font, clamp size, gradient on key word
// 3. Subheadline: muted, max 2 lines, max-w-xl centered
// 4. 2 CTAs: primary (filled + glow) + secondary (ghost)
// 5. Social proof below CTAs: "Join X+ creators" with avatars
// 6. Background: orbs + mesh or grid
// 7. Animated scroll indicator at bottom

const Hero = () => (
  <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
    {/* Background */}
    <div className="orb orb-1" /><div className="orb orb-2" />

    {/* Badge */}
    <div className="animate-in mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border-active)] bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium">
      <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
      Now live · Join the beta
    </div>

    {/* Headline */}
    <h1 className="animate-in [animation-delay:80ms] text-hero font-display font-bold text-[var(--text-primary)] mb-6 max-w-4xl">
      Reward your community<br />
      <span className="text-gradient">automatically</span>
    </h1>

    {/* Sub */}
    <p className="animate-in [animation-delay:160ms] text-[var(--text-muted)] text-xl max-w-xl leading-relaxed mb-10">
      Set quests. Fans complete them. Tokens distributed instantly.
      Built for Bags.fm creators on Solana.
    </p>

    {/* CTAs */}
    <div className="animate-in [animation-delay:240ms] flex items-center gap-4 flex-wrap justify-center mb-12">
      <Button size="lg" className="glow-pulse">Get Started Free</Button>
      <Button size="lg" variant="secondary">Watch Demo →</Button>
    </div>

    {/* Social proof */}
    <div className="animate-in [animation-delay:320ms] flex items-center gap-3 text-[var(--text-muted)] text-sm">
      <div className="flex -space-x-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="w-8 h-8 rounded-full bg-[var(--bg-elevated)] border-2 border-[var(--bg-base)]" />
        ))}
      </div>
      <span>Joined by <strong className="text-[var(--text-primary)]">200+</strong> creators</span>
    </div>
  </section>
)
```

---

## 💰 INR PRICING COMPONENT

```tsx
const formatINR = (n: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)

const plans = [
  { name: 'Starter', monthly: 0, annual: 0, features: ['5 quests/month', '100 fan slots', 'Basic analytics'], cta: 'Start Free', popular: false },
  { name: 'Pro', monthly: 999, annual: 699, features: ['Unlimited quests', 'AI quest suggestions', 'Advanced analytics', 'Priority support', 'Custom branding'], cta: 'Start Pro', popular: true },
  { name: 'Scale', monthly: 2999, annual: 1999, features: ['Everything in Pro', 'Team access (5 seats)', 'API access', 'White-label', 'Dedicated manager'], cta: 'Contact Us', popular: false },
]

// Center "Pro" tier always gets:
// - "Most Popular" badge
// - glowing border (border-glow class)
// - slightly larger card (scale-105)
// - accent background tint
// Annual toggle shows "Save 30%" green badge
// Razorpay checkout on CTA click
```

---

## 🤖 AI API PATTERNS

### Anthropic Claude (streaming recommended for chat/generation UI)
```ts
// lib/claude.ts
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// Non-streaming (simple completions)
export async function claudeComplete(prompt: string, system?: string): Promise<string> {
  const msg = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: system || 'You are a helpful assistant.',
    messages: [{ role: 'user', content: prompt }],
  })
  return (msg.content[0] as { text: string }).text
}

// Streaming (for real-time UI — token by token)
export async function claudeStream(
  prompt: string,
  onChunk: (text: string) => void,
  system?: string
) {
  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: system || 'You are a helpful assistant.',
    messages: [{ role: 'user', content: prompt }],
  })
  for await (const chunk of stream) {
    if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
      onChunk(chunk.delta.text)
    }
  }
}
```

### Google Gemini (free tier, use for hackathons / cost-sensitive)
```ts
// lib/gemini.ts
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

export async function geminiComplete(prompt: string, systemInstruction?: string): Promise<string> {
  const res = await fetch(`${GEMINI_URL}?key=${process.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.8, maxOutputTokens: 1500 },
    }),
  })
  if (!res.ok) throw new Error(`Gemini error: ${res.status}`)
  const data = await res.json()
  return data.candidates[0].content.parts[0].text
}

export async function geminiJSON<T>(prompt: string): Promise<T> {
  const raw = await geminiComplete(prompt + '\n\nReturn ONLY valid JSON. No markdown. No backticks. No explanation.')
  return JSON.parse(raw.replace(/```json|```/g, '').trim()) as T
}
```

### AI Rate Limiting (always add on backend routes)
```ts
// middleware/rateLimit.ts
import { RateLimiterMemory } from 'rate-limiter-flexible'

const aiLimiter = new RateLimiterMemory({ points: 10, duration: 60 }) // 10 req/min per IP

export async function aiRateLimit(ip: string) {
  try {
    await aiLimiter.consume(ip)
  } catch {
    throw new Error('Rate limit exceeded. Try again in a minute.')
  }
}
```

---

## 🔐 SECURITY — NON-NEGOTIABLE

1. **NEVER** read, log, print, expose `.env` / `.env.local` / `.env.production`
2. **NEVER** hardcode any API key, token, secret, or password anywhere in code
3. **NEVER** show raw AI/server error messages to frontend users — log internally, show generic message
4. **NEVER** `console.log(user)`, `console.log(token)`, `console.log(apiKey)` — ever
5. **NEVER** install packages with < 500 weekly downloads without explicit instruction
6. **ALWAYS** validate input on client (Zod schema) AND server (re-validate, never trust client)
7. **ALWAYS** verify `x-razorpay-signature` HMAC before fulfilling any payment webhook
8. **ALWAYS** sanitize user-generated content before rendering (DOMPurify for HTML)
9. **ALWAYS** add rate limiting on every AI endpoint
10. **ALWAYS** use `httpOnly` cookies for auth tokens — never `localStorage` for JWTs
11. Add any new env vars to `.env.example` with placeholder comment

### Zod Validation Pattern
```ts
import { z } from 'zod'

const CreateQuestSchema = z.object({
  title: z.string().min(3).max(80).trim(),
  description: z.string().min(10).max(500).trim(),
  questType: z.enum(['follow_x', 'hold_tokens', 'share_post', 'join_telegram', 'create_content']),
  rewardAmount: z.number().int().positive().max(1_000_000),
  maxCompletions: z.number().int().positive().max(10_000),
  deadline: z.string().datetime(),
})

type CreateQuestInput = z.infer<typeof CreateQuestSchema>

// Usage:
const result = CreateQuestSchema.safeParse(req.body)
if (!result.success) return res.status(400).json({ error: result.error.flatten() })
const data: CreateQuestInput = result.data
```

---

## 🗄️ DATA LAYER PATTERNS

### Zustand Store
```ts
// store/questStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Quest { id: string; title: string; /* ... */ }

interface QuestStore {
  quests: Quest[]
  isLoading: boolean
  error: string | null
  addQuest: (quest: Quest) => void
  removeQuest: (id: string) => void
  setLoading: (v: boolean) => void
  setError: (e: string | null) => void
}

export const useQuestStore = create<QuestStore>()(
  persist(
    (set) => ({
      quests: [],
      isLoading: false,
      error: null,
      addQuest: (quest) => set((s) => ({ quests: [...s.quests, quest] })),
      removeQuest: (id) => set((s) => ({ quests: s.quests.filter(q => q.id !== id) })),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    { name: 'bags-quests' }
  )
)
```

### React Query Pattern (for API data)
```ts
// hooks/useQuests.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

export const useQuests = () =>
  useQuery({ queryKey: ['quests'], queryFn: api.quests.list, staleTime: 30_000 })

export const useCreateQuest = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: api.quests.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['quests'] }),
    onError: (err) => toast.error(err.message),
  })
}
```

---

## ⚡ PERFORMANCE RULES

1. **Code-split every route** — `const Page = lazy(() => import('./pages/Page'))`
2. **Lazy-load heavy components** (charts, maps, rich editors)
3. **Image optimization** — always use `loading="lazy"`, proper `width`/`height`
4. **Memoize expensive components** — `React.memo` + `useCallback` for callbacks passed as props
5. **Debounce** search inputs (300ms), AI inputs (600ms)
6. **Virtual scroll** for lists > 50 items — use `@tanstack/virtual`
7. **Preload critical fonts** — `<link rel="preload">` in `<head>`
8. **Bundle size** — run `pnpm build` and check output. Nothing > 500KB initial chunk without splitting

### Debounce hook
```ts
// hooks/useDebounce.ts
import { useState, useEffect } from 'react'
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debouncedValue
}
```

---

## 📁 FOLDER STRUCTURE

```
/
├── src/
│   ├── components/
│   │   ├── ui/           # Button, Card, Input, Badge, Modal, Tooltip, Skeleton, Spinner, EmptyState, Toast
│   │   ├── layout/       # Navbar, Footer, Sidebar, PageWrapper, MobileNav
│   │   └── sections/     # Hero, Features, Pricing, Testimonials, FAQ, CTA, HowItWorks
│   ├── pages/            # Route-level pages (lazy loaded)
│   ├── hooks/            # useAuth, useToast, useScrollAnimation, useDebounce, useLocalStorage, useMediaQuery
│   ├── lib/              # api.ts, claude.ts, gemini.ts, razorpay.ts, validators.ts, formatters.ts
│   ├── store/            # Zustand stores (one file per domain)
│   ├── types/            # Global TypeScript interfaces (index.ts re-exports all)
│   └── styles/
│       └── index.css     # CSS variables + global animations + base styles
├── api/                  # Backend (Express routes or FastAPI)
│   ├── routes/
│   ├── middleware/
│   └── lib/
├── public/               # Static assets
├── .env.example          # All env vars listed with placeholder values + comments
├── AGENTS.md             # This file — always read first
└── README.md             # Human-readable setup guide
```

---

## ⚙️ CODE QUALITY RULES

- TypeScript strict: `"strict": true, "noUncheckedIndexedAccess": true` in tsconfig
- Single quotes, no semicolons (match existing codebase style first)
- Absolute imports via `@/` alias in `vite.config.ts`:
  ```ts
  resolve: { alias: { '@': path.resolve(__dirname, './src') } }
  ```
- Max 250 lines per file — split if larger
- No `any` without `// reason: ...` comment on same line
- No `console.log` in production paths — use `logger.debug()` or delete before commit
- No `// @ts-ignore` without explanatory comment
- No inline styles unless value is computed/dynamic
- Always destructure props — never use `props.value` inside component body
- Custom hook for any stateful logic used in 2+ components
- All `useEffect` deps must be complete — no eslint-disable-line

---

## 🚀 STANDARD COMMANDS

```bash
pnpm install           # Install dependencies
pnpm dev               # Dev server (Vite)
pnpm build             # Production build — must succeed before done
pnpm preview           # Preview production build locally
pnpm type-check        # tsc --noEmit — zero errors before done
pnpm lint              # ESLint check
pnpm format            # Prettier format
pnpm test              # Vitest unit tests
```

---

## 🤖 AGENT BEHAVIOR RULES

1. **Read the file before editing it** — always. No exceptions.
2. **Read `AGENTS.md` fully before writing any code** — it is the law.
3. Do NOT refactor unrelated files while fixing a bug
4. Do NOT rename / move / delete files without explicit instruction
5. Match existing code patterns — don't introduce new paradigms without asking
6. Every page must work at 375px width — test mentally before declaring done
7. Check `src/lib/` before writing a new utility — may already exist
8. `pnpm build` and `pnpm type-check` must pass — think before writing
9. All dark-bg text must pass WCAG AA (4.5:1 contrast minimum)
10. For any change touching 3+ files or architecture — describe plan first, then execute
11. **When in doubt about design** — make it darker, add glow, reduce noise
12. **When in doubt about animation** — `fadeSlideUp` 0.6s cubic-bezier(0.22,1,0.36,1)

---

## 🚫 BANNED / FORBIDDEN

| What | Why |
|---|---|
| `Lorem ipsum` without proper styling | Shows laziness |
| Unstyled native HTML elements | Everything needs Tailwind |
| Purple gradient on white background | Overused, banned |
| Generic glassmorphism + Inter + purple | Default AI SaaS look, banned |
| Flat cards with no hover/shadow | Looks unfinished |
| `any` TypeScript without justification | Defeats the point of TS |
| `console.log` committed to code | Security + cleanliness |
| Missing mobile responsive | Unacceptable |
| Blank loading/error/empty states | Never show users nothing |
| Symmetric 3-column grid for everything | Be creative |
| `localStorage` for auth JWTs | Security vulnerability |
| Hardcoded colors (hex) in components | Use CSS variables |
| Missing animations on a page | Static = unfinished |
| Forms without validation | Never |
| AI calls without rate limiting | Never |

---

## ✅ DEFINITION OF DONE

A task is DONE only when ALL boxes checked:

- [ ] `pnpm type-check` → zero errors
- [ ] `pnpm build` → succeeds, no warnings
- [ ] Works on mobile 375px
- [ ] Loading state → skeleton or spinner (not blank)
- [ ] Error state → styled, user-friendly message
- [ ] Empty state → designed with icon + copy
- [ ] Animations present (at minimum: page load fadeSlideUp)
- [ ] Consistent with CSS variables (no hardcoded hex)
- [ ] No secrets in code
- [ ] No `console.log` in production paths
- [ ] Manually tested happy path at least once
- [ ] Manually tested error path at least once

---

## 🧪 QUICK CHECKLISTS

### New Page Checklist
- [ ] Added to React Router in `App.tsx`
- [ ] Lazy-loaded (`lazy(() => import(...))`)
- [ ] Has `<title>` via `react-helmet` or Vite plugin
- [ ] Page wrapper with correct padding/max-width
- [ ] Scroll to top on mount
- [ ] Mobile responsive

### New API Endpoint Checklist
- [ ] Input validated with Zod
- [ ] Auth middleware applied (if protected)
- [ ] Rate limiting applied (if AI/expensive)
- [ ] Error responses are generic to user, detailed in server logs
- [ ] Returns consistent `{ data, error }` shape

### New Component Checklist
- [ ] TypeScript interface defined
- [ ] Loading state
- [ ] Error state
- [ ] Empty state
- [ ] Hover/focus states
- [ ] Mobile layout tested

---

*AGENTS.md v3.0 — Yousuf's Universal Project Standard | 2025*

> **"Build it like a funded startup. Ship it like a hacker. Animate it like a designer."**
> *If someone opens this project and isn't impressed in 3 seconds, it's not done.*
