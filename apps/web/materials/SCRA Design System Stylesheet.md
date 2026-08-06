# SCRA Design System Stylesheet

```
/*==========================================================South Coast Residents Association (SCRA)Design System v1.0==========================================================*/

/*=========================================================COLORS=========================================================*/

:root {    /* Primary */

    --color-primary: #0D2B5B;    --color-primary-dark: #071C3D;    --color-primary-light: #214E8C;    /* Secondary */

    --color-secondary: #0077C8;    --color-secondary-light: #2D9CDB;    /* Coastal */

    --color-ocean: #00B4DB;    --color-lagoon: #27C5C3;    /* Nature */

    --color-green: #139A3D;    --color-green-light: #2BBE61;    /* Accent */

    --color-sand: #F2E8D5;    --color-beach: #FFF9EF;    /* Neutrals */

    --color-white: #FFFFFF;    --color-gray-50: #F8FAFC;    --color-gray-100: #F1F5F9;    --color-gray-200: #E2E8F0;    --color-gray-300: #CBD5E1;    --color-gray-400: #94A3B8;    --color-gray-500: #64748B;    --color-gray-600: #475569;    --color-gray-700: #334155;    --color-gray-800: #1E293B;    --color-gray-900: #111827;    /* Status */

    --success: #16A34A;    --warning: #F59E0B;    --danger: #DC2626;    --info: #0284C7;}
```

---

# Typography

```
:root {    --font-heading: "Poppins", sans-serif;    --font-body: "Inter", sans-serif;    --text-xs: .75rem;    --text-sm: .875rem;    --text-base: 1rem;    --text-lg: 1.125rem;    --text-xl: 1.25rem;    --text-2xl: 1.5rem;    --text-3xl: 1.875rem;    --text-4xl: 2.25rem;    --text-5xl: 3rem;    --line-tight: 1.2;    --line-normal: 1.6;    --line-relaxed: 1.8;}
```

---

# Spacing

```
:root {    --space-1:4px;    --space-2:8px;    --space-3:12px;    --space-4:16px;    --space-5:20px;    --space-6:24px;    --space-8:32px;    --space-10:40px;    --space-12:48px;    --space-16:64px;    --space-20:80px;    --space-24:96px;}
```

---

# Border Radius

```
:root {    --radius-xs:4px;    --radius-sm:8px;    --radius-md:12px;    --radius-lg:16px;    --radius-xl:24px;    --radius-pill:999px;}
```

---

# Shadows

```
:root {

--shadow-sm:
0 1px 2px rgba(0,0,0,.05);

--shadow:

0 6px 18px rgba(0,0,0,.08);

--shadow-lg:

0 12px 32px rgba(0,0,0,.12);}
```

---

# Global Styles

```
html{scroll-behavior:smooth;}

body{font-family:var(--font-body);font-size:16px;line-height:1.6;color:var(--color-gray-700);background:var(--color-gray-50);}

h1,h2,h3,h4,h5{font-family:var(--font-heading);font-weight:700;color:var(--color-primary);margin-bottom:1rem;}

h1{font-size:3.5rem;}

h2{font-size:2.5rem;}

h3{font-size:2rem;}

h4{font-size:1.5rem;}

p{margin-bottom:1rem;}

a{text-decoration:none;color:var(--color-secondary);transition:.3s;}

a:hover{color:var(--color-primary);}
```

---

# Buttons

```
.btn{display:inline-flex;align-items:center;justify-content:center;padding:14px 28px;border-radius:12px;font-weight:600;transition:.3s;cursor:pointer;}.btn-primary{background:var(--color-primary);color:white;}.btn-primary:hover{background:var(--color-primary-dark);}.btn-secondary{background:var(--color-secondary);color:white;}.btn-secondary:hover{background:#0065AE;}.btn-outline{background:white;border:2px solid var(--color-primary);color:var(--color-primary);}.btn-outline:hover{background:var(--color-primary);color:white;}
```

---

# Cards

```
.card{background:white;border-radius:16px;padding:32px;box-shadow:var(--shadow);transition:.3s;}.card:hover{transform:translateY(-4px);box-shadow:var(--shadow-lg);}
```

---

# Form Controls

```
input,
textarea,
select{width:100%;padding:14px;border:1px solid var(--color-gray-300);border-radius:12px;font-size:16px;transition:.3s;}

input:focus,
textarea:focus,
select:focus{outline:none;border-color:var(--color-secondary);box-shadow:0 0 0 3px rgba(0,119,200,.15);}
```

---

# Badges

```
.badge{display:inline-block;padding:6px 14px;border-radius:999px;font-size:.8rem;font-weight:600;}.badge-success{background:#DCFCE7;color:#15803D;}.badge-warning{background:#FEF3C7;color:#B45309;}.badge-danger{background:#FEE2E2;color:#B91C1C;}
```

---

# Section Layout

```
.section{padding:96px 0;}.container{width:min(1280px,92%);margin:auto;}.grid{display:grid;gap:32px;}
```

---

# Navigation

```
.navbar{height:90px;background:white;box-shadow:var(--shadow-sm);}.nav-link{font-weight:500;color:var(--color-primary);}.nav-link:hover{color:var(--color-secondary);}
```

---

# Hero Section

```
.hero{background:

linear-gradient(

rgba(13,43,91,.55),

rgba(13,43,91,.55)),

url("/images/diani-hero.jpg");background-size:cover;background-position:center;color:white;padding:180px 0;}.hero h1{color:white;font-size:4rem;}.hero p{font-size:1.3rem;max-width:650px;}
```

---

# Footer

```
footer{background:var(--color-primary);color:white;padding:80px 0;}

footer a{color:#D7E6FF;}

footer a:hover{color:white;}
```

---

# Motion

```
*{transition:

background .25s,

color .25s,

border-color .25s,

transform .25s,

box-shadow .25s;}
```

---

## Additional Recommendations

For this project, I'd also define a set of **semantic design tokens** rather than relying directly on color names. This makes future redesigns much easier:

```
:root {    --background: var(--color-gray-50);    --surface: var(--color-white);    --surface-muted: var(--color-sand);    --text-primary: var(--color-primary);    --text-secondary: var(--color-gray-700);    --text-muted: var(--color-gray-500);    --border: var(--color-gray-200);    --link: var(--color-secondary);    --link-hover: var(--color-primary);    --button-primary: var(--color-primary);    --button-secondary: var(--color-secondary);    --hero-overlay: rgba(13, 43, 91, 0.58);}
```
