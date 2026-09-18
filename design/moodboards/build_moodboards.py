# Genera los 4 artboards .dc.html del canvas de moodboards
# (3 direcciones + comparativa) a partir del design brief.
import math
import os
import random

HERE = os.path.dirname(os.path.abspath(__file__))
W, PAD = 1440, 72
CW = W - 2 * PAD  # 1296
ACC, ACCFG = "{{accent}}", "{{accentFg}}"
H_MOOD = 3120
H_MAIN = 1560


# ---------- color ----------
def _lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def _rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def lum(h):
    r, g, b = _rgb(h)
    return 0.2126 * _lin(r) + 0.7152 * _lin(g) + 0.0722 * _lin(b)


def contrast(a, b):
    la, lb = lum(a), lum(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def cr(a, b):
    return f"{contrast(a, b):.1f}:1"


def rgba(h, a):
    r, g, b = _rgb(h)
    return f"rgba({r}, {g}, {b}, {a})"


def unit(h):
    return tuple(round(c / 255, 3) for c in _rgb(h))


# ---------- direcciones ----------
FONT_UM = "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap"
FONT_MC = "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..125,400..800&family=IBM+Plex+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap"
FONT_CU = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Manrope:wght@300..700&family=Geist+Mono:wght@400;500&display=swap"

DIRS = [
    dict(
        file="UniverseMinimal", num="01", name="UNIVERSE MINIMAL", title="Universe Minimal",
        thesis="Universo elegante y editorial. La tipografía display es la protagonista, las órbitas son líneas finas y casi no hay fotografía. El espacio se sugiere; no se ilustra.",
        weights=(40, 30, 30),
        risk="Quedarse en un «portfolio minimal genérico» sin identidad. Prueba: si se quitan las órbitas y los labels, ¿sigue siendo reconocible?",
        type_option="Opción A · Instrument Serif + Geist Sans + Geist Mono · Google Fonts (OFL)",
        type_detail="Display · Instrument Serif 400 e itálica — Sans · Geist 300–700 — Mono · Geist Mono 400–500",
        fonts_link=FONT_UM,
        display="'Instrument Serif', Georgia, 'Times New Roman', serif",
        sans="Geist, system-ui, -apple-system, 'Segoe UI', sans-serif",
        mono="'Geist Mono', ui-monospace, 'SF Mono', Consolas, monospace",
        accent_name="Signal white", accent="#E8E1D1",
        accent_note="Blanco cálido como acento por contraste; un único verde apagado para estados",
        p=dict(bg="#0B0D12", bg_elevated="#10131A", surface="#151923", surface_hover="#1B2030",
               fg="#F2EFE8", fg_muted="#A9ABB3", fg_subtle="#7C808B", line="#23272F", line_strong="#363B47",
               success="#6FAF7E", warning="#D9A441", danger="#D95F5F"),
        motion=["Entradas por opacidad y 12 px de desplazamiento, una sola vez, 480 ms, out-expo.",
                "Las órbitas giran 1° cada 4 s; con reduced-motion quedan fijas.",
                "Hover en un nodo: el anillo crece 4 px en 240 ms. Nada más se mueve."],
        refs=["topo", "stars", "lunar", "coords"],
        display_case="none", display_weight="400",
    ),
    dict(
        file="MissionControl", num="02", name="MISSION CONTROL", title="Mission Control",
        thesis="Interfaz técnica y de datos: grids visibles, labels mono, paneles de telemetría, estados. El mapa es un instrumento, no un paisaje.",
        weights=(20, 40, 40),
        risk="Parecer un dashboard o un HUD gamer; frialdad excesiva para una PYME que contrata a una persona, no a un sistema.",
        type_option="Opción D · propuesta nueva para esta dirección · Archivo + IBM Plex Sans + JetBrains Mono · Google Fonts (OFL)",
        type_detail="Display · Archivo 700, ancho 110 %, mayúsculas — Sans · IBM Plex Sans 400–500 — Mono · JetBrains Mono 400–500",
        fonts_link=FONT_MC,
        display="Archivo, 'Arial Narrow', Impact, sans-serif",
        sans="'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
        mono="'JetBrains Mono', ui-monospace, 'SF Mono', Consolas, monospace",
        accent_name="Amber telemetry", accent="#FFB000",
        accent_note="Fósforo de instrumentos; cálido y legible sobre oscuro",
        p=dict(bg="#0A0C10", bg_elevated="#0F1217", surface="#131720", surface_hover="#191E29",
               fg="#E6E8EC", fg_muted="#9CA3AF", fg_subtle="#7A8291", line="#1E2430", line_strong="#2C3442",
               success="#4CB782", warning="#F2A93B", danger="#E5484D"),
        motion=["Los valores de telemetría «cuentan» hasta su cifra en 600 ms; con reduced-motion aparecen fijos.",
                "El grid no se mueve nunca. Solo cambian estados: un punto que pulsa si hay disponibilidad.",
                "La Console (⌘K) abre en 160 ms sin escala, solo opacidad."],
        refs=["coords", "topo", "doc", "stars", "earth"],
        display_case="uppercase", display_weight="700",
    ),
    dict(
        file="CinematicUniverse", num="03", name="CINEMATIC UNIVERSE", title="Cinematic Universe",
        thesis="Inmersiva y cinematográfica: fotografía grande muy tratada, gradientes profundos, un hero con presencia y transiciones lentas.",
        weights=(50, 20, 30),
        risk="Performance (imágenes grandes), legibilidad sobre textura y el cliché espacial. Es la dirección que más fácilmente se convierte en «otro portfolio espacial».",
        type_option="Opción C · stand-in gratuito: Cormorant Garamond + Manrope + Geist Mono · en producción: PP Editorial New + PP Neue Montreal + GT America Mono",
        type_detail="Display · Cormorant Garamond 300 e itálica — Sans · Manrope 300–700 — Mono · Geist Mono 400–500",
        fonts_link=FONT_CU,
        display="'Cormorant Garamond', 'Cormorant', Garamond, Georgia, serif",
        sans="Manrope, system-ui, -apple-system, 'Segoe UI', sans-serif",
        mono="'Geist Mono', ui-monospace, 'SF Mono', Consolas, monospace",
        accent_name="International Orange", accent="#FF4F00",
        accent_note="Naranja aeroespacial: trajes de vuelo y señalética de pruebas; muy poco usado en portfolios",
        p=dict(bg="#070A10", bg_elevated="#0C1119", surface="#111827", surface_hover="#172033",
               fg="#F4F1EA", fg_muted="#ABA99F", fg_subtle="#7E7F7A", line="#1A2130", line_strong="#2A3346",
               success="#4FB477", warning="#F2A93B", danger="#E5484D"),
        motion=["Hero: la textura se revela con un fade de 900 ms; el statement entra 200 ms después. Solo en la primera visita.",
                "Transición entre páginas: crossfade 480 ms + 24 px de desplazamiento vertical (la «trayectoria»).",
                "Parallax de la textura ≤ 8 %; con reduced-motion todo se reduce a opacidad."],
        refs=["gas", "lunar", "earth", "stars", "topo", "coords"],
        display_case="none", display_weight="300",
    ),
]

ACCENT_OPTIONS = ["#E8E1D1", "#FFB000", "#FF4F00"]

REF_META = {
    "topo": ("Topografía lunar", "USGS Astrogeology · dominio público", "monocromo, líneas finas, curvas de nivel como órbitas"),
    "stars": ("Campo estelar", "generado en canvas · 0 KB de imagen", "densidad baja, sin twinkle, pausado fuera de viewport"),
    "lunar": ("Superficie lunar", "NASA LRO · dominio público", "desaturada, contraste bajo, grain 4 %"),
    "coords": ("Placa de coordenadas", "sistema propio", "grid ≤ 10 % de opacidad, ticks, LAT / LON"),
    "earth": ("Tierra de noche", "NASA Earth Observatory · Black Marble", "teñida hacia la paleta, luces cálidas"),
    "gas": ("Nube de gas", "ESA/Hubble · ESA/Webb · CC BY 4.0", "desaturada, sin saturación, siempre bajo overlay"),
    "doc": ("Documento técnico", "NASA Technical Reports · dominio público", "solo referencia para labels, tablas y numeración"),
}

ROLES = [
    ("bg", "fondo base", "bgish"), ("bg_elevated", "fondo elevado", "bgish"),
    ("surface", "superficie", "bgish"), ("surface_hover", "superficie hover", "bgish"),
    ("fg", "texto", "fgish"), ("fg_muted", "texto secundario", "fgish"), ("fg_subtle", "texto sutil", "fgish"),
    ("line", "línea", "line"), ("line_strong", "línea fuerte", "line"),
    ("accent", "acento", "accent"), ("accent_fg", "texto sobre acento", "accent_fg"),
    ("success", "estado ok", "fgish"), ("warning", "aviso", "fgish"), ("danger", "error", "fgish"),
]


# ---------- helpers de markup ----------
def label(d, text, color=None, size=11, extra=""):
    color = color or d["p"]["fg_subtle"]
    return (f'<span style="font-family: {d["mono"]}; font-size: {size}px; letter-spacing: 0.16em; '
            f'text-transform: uppercase; color: {color}; {extra}">{text}</span>')


def dot(color, size=6, pulse=False):
    return f'<span style="display: inline-block; width: {size}px; height: {size}px; border-radius: 999px; background: {color}; flex: none;"></span>'


def svg_check(color, size=10):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 12 12" fill="none" stroke="{color}" stroke-width="1.6" '
            f'stroke-linecap="round" stroke-linejoin="round" style="flex: none;"><path d="M2 6.4 4.8 9 10 3.4"></path></svg>')


def svg_arrow(color, size=12):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 12 12" fill="none" stroke="{color}" stroke-width="1.4" '
            f'stroke-linecap="round" stroke-linejoin="round" style="flex: none;"><path d="M2 6h8M6.5 2.5 10 6l-3.5 3.5"></path></svg>')


def svg_ext(color, size=12):
    return (f'<svg width="{size}" height="{size}" viewBox="0 0 12 12" fill="none" stroke="{color}" stroke-width="1.4" '
            f'stroke-linecap="round" stroke-linejoin="round" style="flex: none;"><path d="M4 2H2v8h8V8M7 2h3v3M10 2 5.5 6.5"></path></svg>')


def verified_chip(d):
    return (f'<span style="display: inline-flex; align-items: center; gap: 6px; border: 1px solid {ACC}; color: {ACC}; '
            f'padding: 3px 8px; border-radius: 2px; font-family: {d["mono"]}; font-size: 10px; letter-spacing: 0.16em;">'
            f'{svg_check(ACC)}VERIFIED</span>')


def section(d, num, title, inner, note=None):
    p = d["p"]
    right = label(d, note) if note else ""
    head = (f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 24px; '
            f'border-top: 1px solid {p["line_strong"]}; padding-top: 14px; margin-bottom: 28px;">'
            f'{label(d, f"{num} — {title}", p["fg"])}{right}</div>')
    return f'<section style="margin-bottom: 72px;">{head}{inner}</section>'


# ---------- texturas generadas (stand-in de las referencias) ----------
def _svg(inner, bg, w=300, h=225):
    return (f'<svg viewBox="0 0 {w} {h}" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" '
            f'xmlns="http://www.w3.org/2000/svg" style="display: block;"><rect width="{w}" height="{h}" fill="{bg}"></rect>{inner}</svg>')


def tex_topo(p, seed):
    rnd = random.Random(seed)
    a, b, c = rnd.uniform(0, 6.28), rnd.uniform(0, 6.28), rnd.uniform(0, 6.28)
    cx, cy = 150 + rnd.uniform(-30, 30), 112 + rnd.uniform(-20, 20)
    out = []
    for k in range(1, 15):
        base = 10.5 * k
        pts = []
        for i in range(96):
            t = 2 * math.pi * i / 96
            r = base * (1 + 0.13 * math.sin(3 * t + a) + 0.07 * math.sin(5 * t + b) + 0.05 * math.sin(2 * t + c))
            pts.append((cx + r * math.cos(t) * 1.3, cy + r * math.sin(t)))
        dpath = "M " + " L ".join(f"{x:.1f} {y:.1f}" for x, y in pts) + " Z"
        major = k % 4 == 0
        out.append(f'<path d="{dpath}" fill="none" stroke="{p["fg_muted"]}" stroke-opacity="{0.85 if major else 0.45}" '
                   f'stroke-width="{1.1 if major else 0.55}"></path>')
    out.append(f'<path d="M{cx:.0f} {cy - 6:.0f}v12M{cx - 6:.0f} {cy:.0f}h12" stroke="{p["fg"]}" stroke-width="0.8"></path>')
    return _svg("".join(out), p["bg_elevated"])


def tex_stars(p, seed, n=180):
    rnd = random.Random(seed)
    out = []
    pts = []
    for _ in range(n):
        x, y = rnd.uniform(0, 300), rnd.uniform(0, 225)
        r = rnd.choice([0.4, 0.5, 0.6, 0.7, 0.9, 1.2])
        o = rnd.uniform(0.2, 0.95)
        pts.append((x, y))
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="{p["fg"]}" opacity="{o:.2f}"></circle>')
    chain = rnd.sample(pts, 5)
    dpath = "M " + " L ".join(f"{x:.1f} {y:.1f}" for x, y in chain)
    out.append(f'<path d="{dpath}" fill="none" stroke="{p["fg_muted"]}" stroke-opacity="0.35" stroke-width="0.5"></path>')
    for x, y in chain:
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3.5" fill="none" stroke="{p["fg_muted"]}" stroke-opacity="0.5" stroke-width="0.5"></circle>')
    return _svg("".join(out), p["bg"])


def tex_lunar(p, seed):
    rnd = random.Random(seed)
    fid = f"g{seed}"
    out = [
        f'<defs><radialGradient id="{fid}l" cx="0.25" cy="0.2" r="1.1"><stop offset="0" stop-color="{p["fg_subtle"]}"></stop>'
        f'<stop offset="0.55" stop-color="{p["line_strong"]}"></stop><stop offset="1" stop-color="{p["bg"]}"></stop></radialGradient>'
        f'<filter id="{fid}n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"></feTurbulence>'
        f'<feColorMatrix type="saturate" values="0"></feColorMatrix></filter></defs>',
        f'<rect width="300" height="225" fill="url(#{fid}l)"></rect>',
    ]
    for _ in range(9):
        x, y, r = rnd.uniform(20, 280), rnd.uniform(20, 205), rnd.uniform(6, 34)
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r:.1f}" fill="{p["bg"]}" fill-opacity="0.35" stroke="{p["fg_subtle"]}" stroke-opacity="0.5" stroke-width="0.7"></circle>')
        out.append(f'<path d="M{x - r * 0.9:.1f} {y + r * 0.35:.1f} A{r:.1f} {r:.1f} 0 0 0 {x + r * 0.7:.1f} {y + r * 0.7:.1f}" fill="none" stroke="{p["fg_muted"]}" stroke-opacity="0.35" stroke-width="0.9"></path>')
    out.append(f'<rect width="300" height="225" filter="url(#{fid}n)" opacity="0.16"></rect>')
    return _svg("".join(out), p["bg"])


def tex_earth(p, seed):
    rnd = random.Random(seed)
    fid = f"e{seed}"
    out = [
        f'<defs><radialGradient id="{fid}" cx="0.5" cy="1.2" r="0.9"><stop offset="0" stop-color="{p["surface_hover"]}"></stop>'
        f'<stop offset="1" stop-color="{p["bg"]}"></stop></radialGradient></defs>',
        f'<circle cx="150" cy="330" r="270" fill="url(#{fid})"></circle>',
        f'<circle cx="150" cy="330" r="270" fill="none" stroke="{p["fg"]}" stroke-opacity="0.18" stroke-width="1.2"></circle>',
        f'<circle cx="150" cy="330" r="276" fill="none" stroke="{p["fg"]}" stroke-opacity="0.06" stroke-width="6"></circle>',
    ]
    for _ in range(9):
        cx, cy = rnd.uniform(30, 270), rnd.uniform(95, 215)
        if (cx - 150) ** 2 + (cy - 330) ** 2 > 262 ** 2:
            cy = 150
        for _ in range(rnd.randint(35, 80)):
            x, y = rnd.gauss(cx, 10), rnd.gauss(cy, 6)
            r = rnd.choice([0.4, 0.5, 0.6, 0.8, 1.0])
            out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r}" fill="#E0B36A" opacity="{rnd.uniform(0.35, 1):.2f}"></circle>')
    return _svg("".join(out), p["bg"])


def tex_gas(p, seed, w=300, h=225):
    fid = f"gas{seed}"
    t1, t2 = unit(p["fg_subtle"]), unit(p["line_strong"])
    m1 = f"0 0 0 0 {t1[0]}  0 0 0 0 {t1[1]}  0 0 0 0 {t1[2]}  1.3 0 0 0 -0.45"
    m2 = f"0 0 0 0 {t2[0]}  0 0 0 0 {t2[1]}  0 0 0 0 {t2[2]}  1.6 0 0 0 -0.55"
    inner = (
        f'<defs><filter id="{fid}a" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.005 0.008" numOctaves="4" seed="{seed}"></feTurbulence>'
        f'<feColorMatrix type="matrix" values="{m1}"></feColorMatrix></filter>'
        f'<filter id="{fid}b" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="0.011 0.006" numOctaves="3" seed="{seed + 7}"></feTurbulence>'
        f'<feColorMatrix type="matrix" values="{m2}"></feColorMatrix></filter>'
        f'<radialGradient id="{fid}v" cx="0.5" cy="0.5" r="0.75"><stop offset="0.4" stop-color="{p["bg"]}" stop-opacity="0"></stop><stop offset="1" stop-color="{p["bg"]}" stop-opacity="0.9"></stop></radialGradient></defs>'
        f'<rect width="{w}" height="{h}" filter="url(#{fid}b)" opacity="0.9"></rect>'
        f'<rect width="{w}" height="{h}" filter="url(#{fid}a)" opacity="0.8"></rect>'
        f'<rect width="{w}" height="{h}" fill="url(#{fid}v)"></rect>'
    )
    return _svg(inner, p["bg"], w, h)


def tex_coords(p, seed, w=300, h=225):
    out = []
    for x in range(0, w + 1, 15):
        strong = x % 75 == 0
        out.append(f'<line x1="{x}" y1="0" x2="{x}" y2="{h}" stroke="{p["line_strong"] if strong else p["line"]}" stroke-width="{0.8 if strong else 0.5}"></line>')
    for y in range(0, h + 1, 15):
        strong = y % 75 == 0
        out.append(f'<line x1="0" y1="{y}" x2="{w}" y2="{y}" stroke="{p["line_strong"] if strong else p["line"]}" stroke-width="{0.8 if strong else 0.5}"></line>')
    out.append(f'<circle cx="150" cy="112" r="26" fill="none" stroke="{p["fg_muted"]}" stroke-width="0.8"></circle>')
    out.append(f'<circle cx="150" cy="112" r="2" fill="{p["fg"]}"></circle>')
    out.append(f'<path d="M150 74v18M150 132v18M112 112h18M170 112h18" stroke="{p["fg_muted"]}" stroke-width="0.8"></path>')
    for i in range(0, w, 15):
        out.append(f'<line x1="{i}" y1="0" x2="{i}" y2="{6 if i % 75 == 0 else 3}" stroke="{p["fg_muted"]}" stroke-width="0.8"></line>')
    mono = "ui-monospace, 'SF Mono', Consolas, monospace"
    out.append(f'<text x="10" y="18" font-family="{mono}" font-size="8" letter-spacing="1.2" fill="{p["fg_muted"]}">LAT -12.046</text>')
    out.append(f'<text x="{w - 10}" y="{h - 10}" text-anchor="end" font-family="{mono}" font-size="8" letter-spacing="1.2" fill="{p["fg_muted"]}">LON -77.043</text>')
    out.append(f'<text x="10" y="{h - 10}" font-family="{mono}" font-size="8" letter-spacing="1.2" fill="{p["fg_subtle"]}">SECTOR 04</text>')
    return _svg("".join(out), p["bg_elevated"], w, h)


def tex_doc(d):
    p = d["p"]
    rows = [("1.0", "MISSION OBJECTIVE", "01"), ("1.1", "ROLE AND RESPONSIBILITIES", "02"), ("2.0", "APPROACH", "03"),
            ("2.1", "TECHNOLOGY STACK", "04"), ("3.0", "TELEMETRY AND TRACKING", "05"), ("4.0", "RESULT", "06"), ("4.1", "LESSONS", "07")]
    lines = "".join(
        f'<div style="display: flex; align-items: baseline; gap: 10px; padding: 5px 0; border-bottom: 1px dotted {p["line_strong"]};">'
        f'{label(d, a, p["fg_subtle"], 9)}<span style="flex: 1; font-family: {d["mono"]}; font-size: 9px; letter-spacing: 0.12em; color: {p["fg_muted"]};">{b}</span>{label(d, c, p["fg_subtle"], 9)}</div>'
        for a, b, c in rows)
    return (f'<div style="width: 100%; height: 100%; padding: 16px 18px; background: {p["bg_elevated"]}; display: flex; flex-direction: column; gap: 8px;">'
            f'<div style="display: flex; justify-content: space-between;">{label(d, "FLIGHT PLAN · REV C", p["fg"], 9)}{label(d, "PAGE 3-12", p["fg_subtle"], 9)}</div>'
            f'<div style="display: flex; flex-direction: column;">{lines}</div></div>')


def ref_tile(d, key, i):
    p = d["p"]
    seed = 11 * (i + 1) + len(d["file"])
    if key == "topo":
        body = tex_topo(p, seed)
    elif key == "stars":
        body = tex_stars(p, seed)
    elif key == "lunar":
        body = tex_lunar(p, seed)
    elif key == "earth":
        body = tex_earth(p, seed)
    elif key == "gas":
        body = tex_gas(p, seed)
    elif key == "coords":
        body = tex_coords(p, seed)
    else:
        body = tex_doc(d)
    title, source, treat = REF_META[key]
    return (f'<figure style="margin: 0; display: flex; flex-direction: column; gap: 12px; min-width: 0;">'
            f'<div style="aspect-ratio: 4 / 3; overflow: hidden; border: 1px solid {p["line"]}; background: {p["bg_elevated"]};">{body}</div>'
            f'<figcaption style="display: flex; flex-direction: column; gap: 4px;">'
            f'<span style="font-family: {d["sans"]}; font-size: 13px; color: {p["fg"]};">{i + 1:02d} · {title}</span>'
            f'<span style="font-family: {d["mono"]}; font-size: 10px; letter-spacing: 0.06em; color: {p["fg_subtle"]}; line-height: 1.5;">{source}<br>{treat}</span>'
            f'</figcaption></figure>')


# ---------- secciones ----------
def top_strip(d):
    p = d["p"]
    w = d["weights"]
    return (f'<div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid {p["line_strong"]};">'
            f'{label(d, f"MOODBOARD {d['num']} / 03", p["fg"])}'
            f'{label(d, "THE UNIVERSE + MISSION CONTROL · ART DIRECTION · FASE 1")}'
            f'{label(d, f"MAP {w[0]} · CONSOLE {w[1]} · TELEMETRY {w[2]}")}</div>')


def title_block(d):
    p = d["p"]
    return (f'<div style="display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 24px; padding: 56px 0 64px 0; align-items: end;">'
            f'<div style="grid-column: span 7; display: flex; flex-direction: column; gap: 22px;">'
            f'<div style="display: flex; align-items: center; gap: 10px;">{dot(ACC, 7)}{label(d, f"DIRECCIÓN {d['num']}", p["fg_muted"])}</div>'
            f'<h1 style="font-family: {d["display"]}; font-weight: {d["display_weight"]}; font-size: 108px; line-height: 0.95; margin: 0; color: {p["fg"]}; '
            f'text-transform: {d["display_case"]}; letter-spacing: {"-0.01em" if d["display_case"] == "uppercase" else "0"}; font-stretch: 110%;">{d["title"]}</h1></div>'
            f'<div style="grid-column: span 5; display: flex; flex-direction: column; gap: 20px; padding-bottom: 8px;">'
            f'<p style="font-family: {d["sans"]}; font-size: 18px; line-height: 1.5; margin: 0; color: {p["fg_muted"]}; text-wrap: pretty;">{d["thesis"]}</p>'
            f'<div style="display: flex; flex-direction: column; gap: 8px;">'
            f'{label(d, "TIPOGRAFÍA · " + d["type_option"], p["fg_subtle"], 10, "letter-spacing: 0.08em; text-transform: none; line-height: 1.5;")}'
            f'{label(d, f"ACENTO · {d['accent_name']} {d['accent']} · tweak para probar los otros dos", p["fg_subtle"], 10, "letter-spacing: 0.08em; text-transform: none;")}'
            f'</div></div></div>')


def palette_section(d):
    p = d["p"]
    cards = []
    for key, desc, kind in ROLES:
        if key == "accent":
            bgc, hexs = ACC, d["accent"]
            ratio = contrast(d["accent"], p["bg"])
            sub = f"vs bg {cr(d['accent'], p['bg'])} · por defecto"
            txt = ""
        elif key == "accent_fg":
            bgc, hexs = ACC, p["bg"]
            ratio = contrast(p["bg"], d["accent"])
            sub = f"vs acento {cr(p['bg'], d['accent'])}"
            txt = f'<span style="font-family: {d["display"]}; font-size: 34px; color: {ACCFG}; line-height: 1;">Aa</span>'
        else:
            bgc = hexs = p[key]
            if kind == "bgish":
                ratio = contrast(p["fg"], p[key])
                sub = f"texto fg {cr(p['fg'], p[key])}"
            elif kind == "line":
                ratio = contrast(p[key], p["bg"])
                sub = f"vs bg {cr(p[key], p['bg'])} · decorativa"
            else:
                ratio = contrast(p[key], p["bg"])
                sub = f"vs bg {cr(p[key], p['bg'])}"
            txt = ""
        if kind == "line":
            aa, aac = "—", p["fg_subtle"]
        elif ratio >= 4.5:
            aa, aac = "AA", p["success"]
        elif ratio >= 3:
            aa, aac = "AA grande / UI", p["warning"]
        else:
            aa, aac = "no AA", p["danger"]
        cards.append(
            f'<div style="display: flex; flex-direction: column; gap: 10px; min-width: 0;">'
            f'<div style="height: 84px; background: {bgc}; border: 1px solid {p["line_strong"]}; display: flex; align-items: center; justify-content: center;">{txt}</div>'
            f'<div style="display: flex; flex-direction: column; gap: 3px;">'
            f'<span style="font-family: {d["mono"]}; font-size: 11px; color: {p["fg"]}; letter-spacing: 0.04em;">{key.replace("_", "-")}</span>'
            f'<span style="font-family: {d["sans"]}; font-size: 12px; color: {p["fg_muted"]};">{desc}</span>'
            f'<span style="font-family: {d["mono"]}; font-size: 10px; color: {p["fg_subtle"]}; letter-spacing: 0.04em;">{hexs}</span>'
            f'<span style="font-family: {d["mono"]}; font-size: 10px; color: {p["fg_subtle"]}; letter-spacing: 0.04em;">{sub} · <span style="color: {aac};">{aa}</span></span>'
            f'</div></div>')
    grid = f'<div style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 20px 16px;">{"".join(cards)}</div>'
    note = (f'<p style="font-family: {d["sans"]}; font-size: 13px; color: {p["fg_subtle"]}; margin: 20px 0 0 0; line-height: 1.5;">'
            f'{d["accent_note"]}. Base oscura azulada, nunca negro puro. Contrastes calculados (WCAG) para el acento por defecto.</p>')
    return section(d, "01", "PALETA · ROLES Y CONTRASTE", grid + note, "tokens 1:1 con el design system")


def type_section(d):
    p = d["p"]
    up = d["display_case"] == "uppercase"
    statement = ("CONSTRUYO SISTEMAS<br>DIGITALES QUE HACEN<br>CRECER NEGOCIOS." if up
                 else f'Construyo sistemas<br>digitales que hacen<br><em style="font-style: italic; color: {ACC};">crecer</em> negocios.')
    labels = " ".join(label(d, t, p["fg_subtle"]) for t in ["M-001", "·", "SECTOR: ECOMMERCE", "·", "STATUS: LIVE", "·", "T+00:00", "·", "LAT -12.046 · LON -77.043", "·"])
    inner = (
        f'<div style="display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 24px; align-items: start;">'
        f'<div style="grid-column: span 7;"><div style="font-family: {d["display"]}; font-weight: {d["display_weight"]}; font-size: {"50" if up else "68"}px; line-height: 1.0; color: {p["fg"]}; '
        f'font-stretch: 110%; letter-spacing: {"-0.01em" if up else "0"};">{statement}</div></div>'
        f'<div style="grid-column: span 5; display: flex; flex-direction: column; gap: 28px; padding-top: 8px;">'
        f'<p style="font-family: {d["sans"]}; font-size: 17px; line-height: 1.6; margin: 0; color: {p["fg_muted"]}; text-wrap: pretty;">'
        f'El servicio no termina al publicar la web. Cada proyecto se construye para medirse: analítica desde el primer día, SEO técnico en la arquitectura y campañas que se optimizan con datos reales.</p>'
        f'<div style="display: flex; flex-wrap: wrap; gap: 10px 8px; align-items: center;">{labels}{verified_chip(d)}</div>'
        f'<span style="font-family: {d["mono"]}; font-size: 10px; letter-spacing: 0.06em; color: {p["fg_subtle"]}; line-height: 1.6;">{d["type_detail"]}</span>'
        f'</div></div>')
    return section(d, "02", "TIPOGRAFÍA EN USO", inner, "statement · párrafo · labels")


def refs_section(d):
    n = len(d["refs"])
    tiles = "".join(ref_tile(d, k, i) for i, k in enumerate(d["refs"]))
    grid = f'<div style="display: grid; grid-template-columns: repeat({n}, minmax(0, 1fr)); gap: 20px;">{tiles}</div>'
    return section(d, "03", "REFERENCIAS VISUALES", grid, "texturas generadas como stand-in · sustituir por fotografía tratada")


def svg_orbits(p, w=240, h=150):
    cx, cy = w * 0.62, h * 0.55
    out = []
    for i, r in enumerate((28, 52, 78)):
        dash = ' stroke-dasharray="2 4"' if i == 2 else ""
        out.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{r * 1.3:.0f}" ry="{r}" fill="none" stroke="{p["line_strong"]}" stroke-width="0.8"{dash}></ellipse>')
    nodes = [(0.9, 0), (2.4, 1), (4.1, 2), (5.6, 1)]
    for a, ring in nodes:
        r = (28, 52, 78)[ring]
        x, y = cx + r * 1.3 * math.cos(a), cy + r * math.sin(a)
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="3" fill="{ACC}"></circle>')
    x, y = cx + 52 * 1.3 * math.cos(2.4), cy + 52 * math.sin(2.4)
    out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="8" fill="none" stroke="{ACC}" stroke-width="0.8"></circle>')
    out.append(f'<circle cx="{cx}" cy="{cy}" r="1.5" fill="{p["fg_subtle"]}"></circle>')
    return (f'<svg viewBox="0 0 {w} {h}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" style="display: block;">'
            f'{"".join(out)}</svg>')


def resources_section(d):
    p = d["p"]

    def panel(title, body):
        return (f'<div style="background: {p["surface"]}; border: 1px solid {p["line"]}; height: 190px; padding: 16px; display: flex; flex-direction: column; gap: 12px; min-width: 0;">'
                f'{label(d, title, p["fg_subtle"], 10)}<div style="flex: 1; display: flex; align-items: center; min-height: 0;">{body}</div></div>')

    orbits = f'<div style="width: 100%; height: 100%;">{svg_orbits(p)}</div>'
    grid = (f'<div style="width: 100%; height: 100%; position: relative; background-image: linear-gradient({rgba(p["line_strong"], 0.9)} 1px, transparent 1px), '
            f'linear-gradient(90deg, {rgba(p["line_strong"], 0.9)} 1px, transparent 1px); background-size: 24px 24px; background-position: 0 0, 0 0;">'
            f'<div style="position: absolute; left: 50%; top: 50%; width: 1px; height: 24px; margin: -12px 0 0 0; background: {ACC};"></div>'
            f'<div style="position: absolute; left: 50%; top: 50%; width: 24px; height: 1px; margin: 0 0 0 -12px; background: {ACC};"></div></div>')
    coords = (f'<div style="display: flex; flex-direction: column; gap: 8px; font-family: {d["mono"]}; color: {p["fg"]}; font-size: 15px; letter-spacing: 0.08em;">'
              f'<span>LAT -12.046</span><span>LON -77.043</span><span style="color: {p["fg_subtle"]}; font-size: 11px; letter-spacing: 0.16em;">LIMA, PE · UTC-5</span></div>')
    states = (f'<div style="display: flex; flex-direction: column; gap: 10px; width: 100%;">'
              + "".join(f'<div style="display: flex; align-items: center; gap: 8px;">{dot(c)}{label(d, t, p["fg"], 10)}</div>'
                        for c, t in ((p["success"], "AVAILABLE"), (p["warning"], "LIMITED"), (p["danger"], "UNAVAILABLE")))
              + f'<div style="display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px;">'
              + "".join(f'<span style="border: 1px solid {p["line_strong"]}; padding: 3px 7px; border-radius: 2px;">{label(d, t, p["fg_muted"], 9)}</span>'
                        for t in ("LIVE", "IN PROGRESS", "ARCHIVED"))
              + '</div></div>')
    numbering = (f'<div style="display: flex; flex-direction: column; gap: 10px;">'
                 f'<span style="font-family: {d["mono"]}; font-size: 26px; color: {p["fg"]}; letter-spacing: 0.04em;">01 —</span>'
                 f'<span style="font-family: {d["mono"]}; font-size: 15px; color: {ACC}; letter-spacing: 0.12em;">M-001</span>'
                 f'<span style="font-family: {d["mono"]}; font-size: 12px; color: {p["fg_subtle"]}; letter-spacing: 0.16em;">T+00:00:00</span></div>')
    inner = (f'<div style="display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 16px;">'
             f'{panel("ÓRBITAS", orbits)}{panel("GRID · ≤ 10 %", grid)}{panel("COORDENADAS", coords)}{panel("ESTADO", states)}{panel("NUMERACIÓN", numbering)}</div>')
    return section(d, "04", "RECURSOS GRÁFICOS", inner, "órbitas · grid · coordenadas · estado · numeración")


# ---------- hero por dirección ----------
def hero_nav(d, variant):
    p = d["p"]
    nav = "".join(label(d, t, p["fg_muted"]) for t in ("01 PROJECTS", "02 SERVICES", "03 ABOUT", "04 CONTACT"))
    key = (f'<span style="border: 1px solid {p["line_strong"]}; padding: 3px 7px; border-radius: 2px; font-family: {d["mono"]}; font-size: 10px; color: {p["fg_muted"]}; letter-spacing: 0.1em;">⌘K</span>')
    right = (f'<div style="display: flex; align-items: center; gap: 18px;">{label(d, "LIMA 14:32", p["fg_muted"])}'
             f'<span style="display: inline-flex; align-items: center; gap: 7px;">{dot(p["success"])}{label(d, "AVAILABLE", p["fg_muted"])}</span>{key}</div>')
    border = f'border-bottom: 1px solid {p["line_strong"]};' if variant == "mc" else ""
    return (f'<div style="position: absolute; left: 72px; right: 72px; top: 0; height: 72px; display: flex; align-items: center; justify-content: space-between; {border}">'
            f'<div style="display: flex; align-items: baseline; gap: 12px;"><span style="font-family: {d["sans"]}; font-size: 14px; font-weight: 500; letter-spacing: 0.12em; color: {p["fg"]};">ADRIÁN</span>{label(d, "[CALLSIGN]", p["fg_subtle"], 10)}</div>'
            f'<div style="display: flex; gap: 32px;">{nav}</div>{right}</div>')


def hero_footer(d):
    p = d["p"]
    return (f'<div style="position: absolute; left: 72px; right: 72px; bottom: 0; height: 56px; border-top: 1px solid {p["line"]}; display: flex; justify-content: space-between; align-items: center;">'
            f'{label(d, "LIMA 14:32 · STATUS: AVAILABLE · LAT -12.046 · LON -77.043")}'
            f'{label(d, "YOUR SESSION → LCP 1.1 S · INP 40 MS · CLS 0.00")}</div>')


def btn(d, text, primary=True, mono=False):
    p = d["p"]
    font = f'font-family: {d["mono"]}; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase;' if mono else f'font-family: {d["sans"]}; font-size: 15px; font-weight: 500;'
    if primary:
        style = f'background: {ACC}; color: {ACCFG}; border: 1px solid {ACC};'
    else:
        style = f'background: transparent; color: {p["fg"]}; border: 1px solid {p["line_strong"]};'
    return f'<a href="#" style="display: inline-flex; align-items: center; gap: 10px; padding: 14px 22px; border-radius: 2px; text-decoration: none; min-height: 44px; {font} {style}">{text}</a>'


def hero_um(d):
    p = d["p"]
    orbits = (f'<svg style="position: absolute; right: -300px; top: -160px;" width="980" height="980" viewBox="0 0 980 980" xmlns="http://www.w3.org/2000/svg">'
              f'<circle cx="490" cy="490" r="460" fill="none" stroke="{p["line_strong"]}" stroke-width="1" stroke-dasharray="3 6"></circle>'
              f'<circle cx="490" cy="490" r="340" fill="none" stroke="{p["line_strong"]}" stroke-width="1"></circle>'
              f'<circle cx="490" cy="490" r="220" fill="none" stroke="{p["line"]}" stroke-width="1"></circle>'
              f'<circle cx="164" cy="490" r="4" fill="{ACC}"></circle><circle cx="164" cy="490" r="12" fill="none" stroke="{ACC}" stroke-width="1"></circle>'
              f'<circle cx="250" cy="250" r="3" fill="{ACC}"></circle><circle cx="270" cy="490" r="3" fill="{p["fg_muted"]}"></circle>'
              f'<circle cx="345" cy="790" r="3" fill="{p["fg_muted"]}"></circle></svg>')
    mission_tip = (f'<div style="position: absolute; left: 1010px; top: 302px; display: flex; flex-direction: column; gap: 4px;">'
                   f'{label(d, "M-001 · EVOX", p["fg"], 10)}{label(d, "ECOMMERCE · 2026 · LIVE", p["fg_subtle"], 10)}</div>')
    body = (f'<div style="position: absolute; left: 72px; top: 176px; width: 1000px; display: flex; flex-direction: column; gap: 30px;">'
            f'<div style="display: flex; align-items: center; gap: 10px;">{dot(ACC)}{label(d, "SYSTEM ONLINE · v1.0.0", p["fg_muted"])}</div>'
            f'<h1 style="font-family: {d["display"]}; font-weight: 400; font-size: 84px; line-height: 0.98; margin: 0; color: {p["fg"]};">Construyo sistemas digitales<br>que hacen <em style="font-style: italic; color: {ACC};">crecer</em> negocios.</h1>'
            f'{label(d, "DESARROLLO WEB · E-COMMERCE · SEO · GOOGLE ADS · ANALYTICS", p["fg_muted"])}'
            f'<div style="display: flex; gap: 12px; margin-top: 6px;">{btn(d, "Explorar proyectos")}{btn(d, "Contactar", False)}</div></div>')
    return (f'<div style="position: relative; width: 1440px; height: 720px; overflow: hidden; background: {p["bg"]}; color: {p["fg"]}; font-family: {d["sans"]};">'
            f'{orbits}{mission_tip}{hero_nav(d, "um")}{body}{hero_footer(d)}</div>')


def hero_mc(d):
    p = d["p"]
    grid_bg = (f'background-color: {p["bg"]}; background-image: linear-gradient({rgba(p["line"], 0.9)} 1px, transparent 1px), '
               f'linear-gradient(90deg, {rgba(p["line"], 0.9)} 1px, transparent 1px); background-size: 48px 48px;')
    ticks = "".join(
        f'<svg style="position: absolute; {pos}" width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg"><path d="{path}" stroke="{p["fg_muted"]}" stroke-width="1" fill="none"></path></svg>'
        for pos, path in (("left: 72px; top: 96px;", "M0 14V0h14"), ("right: 72px; top: 96px;", "M0 0h14v14"),
                          ("left: 72px; bottom: 80px;", "M0 0v14h14"), ("right: 72px; bottom: 80px;", "M14 0v14H0")))
    rows = [("MISSIONS", "06 · LIVE 04"), ("STATUS", "AVAILABLE"), ("LOCAL TIME", "LIMA 14:32 · UTC-5"), ("YOUR TIME", "21:32"),
            ("SESSION", "LCP 1.1 s · INP 40 ms · CLS 0.00"), ("BUILD", "v1.0.0 · 2026-09-14")]
    rows_html = "".join(
        f'<div style="display: flex; justify-content: space-between; align-items: center; gap: 12px; padding: 11px 0; border-top: 1px solid {p["line"]};">'
        f'{label(d, k, p["fg_subtle"], 10)}<span style="font-family: {d["mono"]}; font-size: 12px; letter-spacing: 0.06em; color: {p["fg"]}; display: inline-flex; align-items: center; gap: 8px;">{dot(p["success"]) if k == "STATUS" else ""}{v}</span></div>'
        for k, v in rows)
    panel = (f'<div style="position: absolute; left: 1000px; top: 152px; width: 368px; background: {p["surface"]}; border: 1px solid {p["line_strong"]}; padding: 16px 20px 6px 20px;">'
             f'<div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px;">{label(d, "TELEMETRY", p["fg"], 10)}<span style="display: inline-flex; align-items: center; gap: 7px;">{dot(ACC)}{label(d, "LIVE", ACC, 10)}</span></div>{rows_html}</div>')
    body = (f'<div style="position: absolute; left: 72px; top: 152px; width: 880px; display: flex; flex-direction: column; gap: 28px;">'
            f'{label(d, "SYSTEM ONLINE · v1.0.0 · T+00:00:00", ACC)}'
            f'<h1 style="font-family: {d["display"]}; font-weight: 700; font-stretch: 110%; font-size: 60px; line-height: 0.96; letter-spacing: -0.01em; margin: 0; color: {p["fg"]}; text-transform: uppercase;">Construyo sistemas<br>digitales que hacen<br>crecer negocios.</h1>'
            f'<p style="font-family: {d["sans"]}; font-size: 16px; color: {p["fg_muted"]}; margin: 0;">Desarrollo web · E-commerce · SEO · Google Ads · Analytics</p>'
            f'<div style="display: flex; gap: 12px; margin-top: 4px;">{btn(d, "Explorar proyectos", True, True)}{btn(d, "Contactar", False, True)}</div></div>')
    caps = "".join(label(d, t, p["fg_muted"]) for t in ("01 DESARROLLO WEB", "02 E-COMMERCE", "03 SEO", "04 GOOGLE ADS", "05 ANALYTICS"))
    strip = (f'<div style="position: absolute; left: 72px; right: 72px; bottom: 0; height: 64px; border-top: 1px solid {p["line_strong"]}; display: flex; justify-content: space-between; align-items: center; background: {p["bg"]};">'
             f'<div style="display: flex; gap: 40px;">{caps}</div>{label(d, "LAT -12.046 · LON -77.043")}</div>')
    return (f'<div style="position: relative; width: 1440px; height: 720px; overflow: hidden; {grid_bg} color: {p["fg"]}; font-family: {d["sans"]};">'
            f'{hero_nav(d, "mc")}{ticks}{body}{panel}{strip}</div>')


def hero_cu(d):
    p = d["p"]
    gas = tex_gas(p, 41, 1440, 720)
    overlay = (f'<div style="position: absolute; inset: 0; background: linear-gradient(180deg, {rgba(p["bg"], 0.25)} 0%, {rgba(p["bg"], 0.7)} 55%, {p["bg"]} 100%);"></div>')
    grain = (f'<svg style="position: absolute; inset: 0; opacity: 0.1;" width="1440" height="720" xmlns="http://www.w3.org/2000/svg"><filter id="hg"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"></feTurbulence>'
             f'<feColorMatrix type="saturate" values="0"></feColorMatrix></filter><rect width="1440" height="720" filter="url(#hg)"></rect></svg>')
    body = (f'<div style="position: absolute; left: 72px; right: 72px; top: 168px; display: flex; flex-direction: column; align-items: center; text-align: center; gap: 30px;">'
            f'<div style="display: flex; align-items: center; gap: 10px;">{dot(ACC)}{label(d, "SYSTEM ONLINE · v1.0.0", ACC)}</div>'
            f'<h1 style="font-family: {d["display"]}; font-weight: 300; font-size: 104px; line-height: 0.95; margin: 0; color: {p["fg"]}; letter-spacing: -0.01em;">Construyo sistemas digitales<br>que hacen <em style="font-style: italic;">crecer</em> negocios.</h1>'
            f'<p style="font-family: {d["sans"]}; font-size: 17px; font-weight: 300; color: {p["fg_muted"]}; margin: 0; letter-spacing: 0.02em;">Desarrollo web · E-commerce · SEO · Google Ads · Analytics</p>'
            f'<div style="display: flex; gap: 12px; margin-top: 6px;">{btn(d, "Explorar proyectos")}{btn(d, "Contactar", False)}</div></div>')
    return (f'<div style="position: relative; width: 1440px; height: 720px; overflow: hidden; background: {p["bg"]}; color: {p["fg"]}; font-family: {d["sans"]};">'
            f'<div style="position: absolute; inset: 0; opacity: 0.9;">{gas}</div>{overlay}{grain}{hero_nav(d, "cu")}{body}{hero_footer(d)}</div>')


def hero_section(d):
    p = d["p"]
    hero = {"UniverseMinimal": hero_um, "MissionControl": hero_mc, "CinematicUniverse": hero_cu}[d["file"]](d)
    wrap = (f'<div style="width: 1296px; height: 648px; overflow: hidden; border: 1px solid {p["line_strong"]}; position: relative;">'
            f'<div style="width: 1440px; height: 720px; transform: scale(0.9); transform-origin: top left;">{hero}</div></div>')
    return section(d, "05", "KEY SCREEN · HERO 1440", wrap, "copy real del brief · el LCP es el texto · escala 0,9")


# ---------- mission card + motion ----------
def cover_placeholder(d):
    p = d["p"]
    return (f'<div style="position: relative; aspect-ratio: 16 / 10; background: {p["bg_elevated"]}; overflow: hidden; border-bottom: 1px solid {p["line"]};">'
            f'<div style="position: absolute; inset: 14px; border: 1px solid {p["line_strong"]}; border-radius: 2px;">'
            f'<div style="height: 22px; border-bottom: 1px solid {p["line_strong"]}; display: flex; align-items: center; gap: 5px; padding: 0 8px;">'
            f'{dot(p["line_strong"], 5)}{dot(p["line_strong"], 5)}{dot(p["line_strong"], 5)}</div>'
            f'<div style="padding: 14px; display: flex; flex-direction: column; gap: 8px;">'
            f'<div style="height: 8px; width: 40%; background: {p["line_strong"]};"></div><div style="height: 6px; width: 70%; background: {p["line"]};"></div>'
            f'<div style="height: 6px; width: 55%; background: {p["line"]};"></div>'
            f'<div style="display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin-top: 8px;"><div style="height: 34px; background: {p["line"]};"></div><div style="height: 34px; background: {p["line"]};"></div><div style="height: 34px; background: {p["line"]};"></div></div>'
            f'</div></div>'
            f'<div style="position: absolute; left: 14px; bottom: 12px;">{label(d, "COVER · CAPTURA REAL 16:10", p["fg_subtle"], 9)}</div></div>')


def mission_card(d):
    p = d["p"]
    f = d["file"]
    tags = "".join(f'<span style="border: 1px solid {p["line_strong"]}; padding: 4px 8px; border-radius: 2px;">{label(d, t, p["fg_muted"], 10, "text-transform: none; letter-spacing: 0.04em;")}</span>'
                   for t in ("Next.js", "TypeScript", "Analytics"))
    status = f'<span style="display: inline-flex; align-items: center; gap: 7px;">{dot(p["success"])}{label(d, "LIVE", p["fg"], 10)}</span>'
    if f == "UniverseMinimal":
        frame = f'background: transparent; border-top: 1px solid {p["line_strong"]};'
        title_style = f'font-family: {d["display"]}; font-size: 40px; font-weight: 400; line-height: 1;'
    elif f == "MissionControl":
        frame = f'background: {p["surface"]}; border: 1px solid {p["line_strong"]};'
        title_style = f'font-family: {d["display"]}; font-size: 30px; font-weight: 700; font-stretch: 110%; text-transform: uppercase; letter-spacing: -0.01em; line-height: 1;'
    else:
        frame = f'background: {p["surface"]}; border: 1px solid {p["line"]}; border-top: 2px solid {ACC};'
        title_style = f'font-family: {d["display"]}; font-size: 42px; font-weight: 300; line-height: 1;'
    body = (f'<div style="padding: 20px 20px 22px 20px; display: flex; flex-direction: column; gap: 14px;">'
            f'<div style="display: flex; justify-content: space-between; align-items: center; gap: 12px;">{label(d, "M-001 · SECTOR: ECOMMERCE · 2026", p["fg_subtle"], 10)}{status}</div>'
            f'<h3 style="margin: 0; color: {p["fg"]}; {title_style}">EVOX</h3>'
            f'<p style="margin: 0; font-family: {d["sans"]}; font-size: 14px; line-height: 1.5; color: {p["fg_muted"]};">[Resumen de la misión · máximo 120 caracteres]</p>'
            f'{label(d, "Development · Architecture · Analytics", p["fg_subtle"], 10, "text-transform: none; letter-spacing: 0.06em;")}'
            f'<div style="display: flex; gap: 6px; flex-wrap: wrap;">{tags}</div>'
            f'<div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid {p["line"]}; margin-top: 4px;">'
            f'<a href="#" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none; color: {ACC}; font-family: {d["mono"]}; font-size: 11px; letter-spacing: 0.14em;">VER MISIÓN{svg_arrow(ACC)}</a>'
            f'<a href="#" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none; color: {p["fg_muted"]}; font-family: {d["mono"]}; font-size: 11px; letter-spacing: 0.14em;">VISIT WEBSITE{svg_ext(p["fg_muted"])}</a>'
            f'</div></div>')
    return f'<div style="width: 420px; {frame} overflow: hidden;">{cover_placeholder(d)}{body}</div>'


def card_motion_section(d):
    p = d["p"]
    w = d["weights"]
    bars = "".join(
        f'<div style="display: flex; align-items: center; gap: 14px;"><span style="width: 96px; flex: none;">{label(d, name, p["fg_muted"], 10)}</span>'
        f'<div style="flex: 1; height: 6px; background: {p["line"]};"><div style="width: {val}%; height: 100%; background: {ACC};"></div></div>'
        f'<span style="width: 28px; text-align: right; font-family: {d["mono"]}; font-size: 11px; color: {p["fg"]};">{val}</span></div>'
        for name, val in (("MAP", w[0]), ("CONSOLE", w[1]), ("TELEMETRY", w[2])))
    motion = "".join(f'<li style="margin: 0; padding: 10px 0; border-top: 1px solid {p["line"]}; font-family: {d["sans"]}; font-size: 14px; line-height: 1.5; color: {p["fg_muted"]};">{m}</li>' for m in d["motion"])
    right = (f'<div style="display: flex; flex-direction: column; gap: 36px;">'
             f'<div style="display: flex; flex-direction: column; gap: 14px;">{label(d, "PESO DE LAS CAPAS", p["fg"], 10)}<div style="display: flex; flex-direction: column; gap: 10px;">{bars}</div></div>'
             f'<div style="display: flex; flex-direction: column; gap: 6px;">{label(d, "MOTION · SENSACIÓN", p["fg"], 10)}<ul style="list-style: none; margin: 0; padding: 0;">{motion}</ul></div>'
             f'<div style="display: flex; flex-direction: column; gap: 10px; padding: 18px 20px; border: 1px solid {p["line_strong"]}; background: {p["surface"]};">'
             f'<div style="display: flex; align-items: center; gap: 8px;">{dot(p["warning"])}{label(d, "RIESGO A VIGILAR", p["fg"], 10)}</div>'
             f'<p style="margin: 0; font-family: {d["sans"]}; font-size: 14px; line-height: 1.55; color: {p["fg_muted"]};">{d["risk"]}</p></div></div>')
    inner = (f'<div style="display: grid; grid-template-columns: 420px minmax(0, 1fr); gap: 72px; align-items: start;">'
             f'{mission_card(d)}{right}</div>')
    return section(d, "06", "MISSION CARD · M-001 EVOX + MOTION Y RIESGO", inner, "misma información en las tres direcciones")


# ---------- documento ----------
SCRIPT = """<script data-dc-script data-props='{"accent":{"editor":"color","default":"%s","options":["#E8E1D1","#FFB000","#FF4F00"],"section":"Acento"}}'>
class Component extends DCLogic {
  renderVals() {
    const accent = this.props.accent || '%s';
    let h = String(accent).replace('#', '');
    if (h.length === 3) { h = h.split('').map((c) => c + c).join(''); }
    const r = parseInt(h.slice(0, 2), 16) || 0;
    const g = parseInt(h.slice(2, 4), 16) || 0;
    const b = parseInt(h.slice(4, 6), 16) || 0;
    const lin = (c) => { c = c / 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
    const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    return { accent: accent, accentFg: L > 0.18 ? '#0B0D12' : '#F2EFE8' };
  }
}
</script>"""


def document(d):
    p = d["p"]
    head_style = (f'body {{ margin: 0; background: {p["bg"]}; }} * {{ box-sizing: border-box; }} '
                  f'a {{ color: {d["accent"]}; }} a:hover {{ color: {p["fg"]}; }} '
                  f'h1, h2, h3, p {{ margin: 0; }}')
    root = (f'<div style="width: 1440px; min-height: {H_MOOD}px; background: {p["bg"]}; color: {p["fg"]}; font-family: {d["sans"]}; padding: 48px 72px 56px 72px;">'
            f'{top_strip(d)}{title_block(d)}{palette_section(d)}{type_section(d)}{refs_section(d)}{resources_section(d)}{hero_section(d)}{card_motion_section(d)}</div>')
    return ('<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n'
            f'  <link rel="stylesheet" href="{d["fonts_link"]}">\n  <style>{head_style}</style>\n</helmet>\n{root}\n</x-dc>\n'
            + (SCRIPT % (d["accent"], d["accent"])) + '\n</body>\n</html>\n')


# ---------- comparativa (Main) ----------
CRITERIA = [
    ("Diferenciación frente a otros portfolios", (3, 5, 4),
     ("Elegante, pero cerca de otros portfolios editoriales.", "Nadie muestra telemetría real; identidad propia.", "Memorable, pero el género está saturado.")),
    ("Confianza para una PYME peruana", (4, 3, 4),
     ("Sobrio y legible; transmite oficio.", "Puede leerse como frío o «solo para ingenieros».", "Impacta, pero puede parecer agencia grande y cara.")),
    ("Legibilidad y contraste AA", (5, 4, 3),
     ("Texto sobre fondo plano: contraste máximo.", "El grid visible compite con el texto si no se controla.", "Texto sobre textura: exige overlays constantes.")),
    ("Viabilidad de performance", (5, 5, 2),
     ("Sin fotografía; hero de texto.", "Sin fotografía; paneles ligeros.", "Imágenes grandes, filtros y gradientes: LCP en riesgo.")),
    ("Escalabilidad a Lab y Journal", (4, 5, 3),
     ("Lab y Journal encajan como texto editorial.", "Lab es su hábitat natural: datos, diagramas, estados.", "Cada entrada pediría una imagen cinematográfica.")),
    ("Bajo riesgo de cliché espacial", (4, 4, 2),
     ("Poco «espacial», poco cliché.", "El riesgo es el HUD gamer, no el espacio.", "Es el cliché por definición si no se contiene.")),
]


def main_document():
    um, mc, cu = DIRS
    d = um  # tipografía y paleta neutra del 01 para el documento comparativo
    p = um["p"]
    acc = um["accent"]

    def squares(n, color):
        return (f'<div style="display: flex; gap: 4px;">'
                + "".join(f'<span style="width: 12px; height: 12px; background: {color if i < n else p["line"]}; display: inline-block;"></span>' for i in range(5))
                + '</div>')

    def head_cell(x):
        strip = "".join(f'<span style="flex: 1; height: 10px; background: {c};"></span>' for c in (x["p"]["bg_elevated"], x["p"]["surface"], x["p"]["fg_muted"], x["p"]["fg"], x["accent"]))
        return (f'<div style="display: flex; flex-direction: column; gap: 10px; padding: 0 0 18px 0;">'
                f'{label(d, f"{x['num']} · {x['name']}", p["fg"])}<div style="display: flex; gap: 2px; width: 160px;">{strip}</div>'
                f'{label(d, f"{x['accent_name']} · {x['accent']}", p["fg_subtle"], 10, "text-transform: none; letter-spacing: 0.06em;")}</div>')

    header = (f'<div style="display: grid; grid-template-columns: 300px repeat(3, minmax(0, 1fr)); gap: 32px; border-bottom: 1px solid {p["line_strong"]}; align-items: end;">'
              f'<div style="padding-bottom: 18px;">{label(d, "CRITERIO · 1–5", p["fg_subtle"])}</div>{head_cell(um)}{head_cell(mc)}{head_cell(cu)}</div>')
    rows = []
    for name, scores, notes in CRITERIA:
        cells = "".join(
            f'<div style="display: flex; flex-direction: column; gap: 10px;"><div style="display: flex; align-items: center; gap: 12px;">{squares(s, x["accent"])}'
            f'<span style="font-family: {d["mono"]}; font-size: 12px; color: {p["fg"]};">{s}</span></div>'
            f'<span style="font-family: {d["sans"]}; font-size: 13px; line-height: 1.45; color: {p["fg_muted"]};">{n}</span></div>'
            for s, n, x in zip(scores, notes, DIRS))
        rows.append(f'<div style="display: grid; grid-template-columns: 300px repeat(3, minmax(0, 1fr)); gap: 32px; padding: 22px 0; border-bottom: 1px solid {p["line"]};">'
                    f'<span style="font-family: {d["sans"]}; font-size: 15px; color: {p["fg"]};">{name}</span>{cells}</div>')
    totals = [sum(s[i] for _, s, _ in CRITERIA) for i in range(3)]
    total_row = (f'<div style="display: grid; grid-template-columns: 300px repeat(3, minmax(0, 1fr)); gap: 32px; padding: 22px 0; border-bottom: 1px solid {p["line_strong"]};">'
                 f'{label(d, "TOTAL / 30", p["fg"])}'
                 + "".join(f'<span style="font-family: {d["display"]}; font-size: 40px; line-height: 1; color: {x["accent"]};">{t}</span>' for t, x in zip(totals, DIRS))
                 + '</div>')
    table = header + "".join(rows) + total_row

    takes = [
        ("DE UNIVERSE MINIMAL", um, "El tono: tipografía display serif para los statements, fondo plano, contención absoluta y fotografía casi ausente. Es lo que hace que una PYME confíe."),
        ("DE MISSION CONTROL", mc, "El sistema: panel de telemetría, labels mono, estados, la Console y el grid como estructura (visible solo donde organiza datos). Es lo que nadie más tiene."),
        ("DE CINEMATIC UNIVERSE", cu, "Un solo momento: el hero con gradiente profundo y grain (sin fotografía), una única imagen tratada en About y en la 404, y la transición lenta entre páginas."),
    ]
    cols = "".join(
        f'<div style="display: flex; flex-direction: column; gap: 14px; padding: 24px; border: 1px solid {p["line_strong"]}; background: {p["surface"]};">'
        f'<div style="display: flex; align-items: center; gap: 10px;">{dot(x["accent"], 7)}{label(d, t, p["fg"], 10)}</div>'
        f'<p style="font-family: {d["sans"]}; font-size: 15px; line-height: 1.55; color: {p["fg_muted"]}; text-wrap: pretty;">{txt}</p></div>'
        for t, x, txt in takes)
    reco = (f'<div style="display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 24px; padding-top: 56px;">'
            f'<div style="grid-column: span 5; display: flex; flex-direction: column; gap: 20px;">'
            f'<div style="display: flex; align-items: center; gap: 10px;">{dot(acc, 7)}{label(d, "RECOMENDACIÓN", p["fg_muted"])}</div>'
            f'<h2 style="font-family: {d["display"]}; font-size: 52px; line-height: 1.0; font-weight: 400; color: {p["fg"]};">Híbrido: el sistema de Mission Control con el tono de Universe Minimal.</h2>'
            f'<p style="font-family: {d["sans"]}; font-size: 16px; line-height: 1.6; color: {p["fg_muted"]}; text-wrap: pretty;">Mission Control puntúa más alto porque es la única dirección cuya diferencia está en la interacción (telemetría, consola, estados) y no en la estética. Su debilidad, la frialdad, se corrige con la tipografía y la contención de Universe Minimal. Cinematic Universe aporta un único momento memorable; como sistema completo compromete performance y legibilidad.</p>'
            f'<p style="font-family: {d["sans"]}; font-size: 14px; line-height: 1.6; color: {p["fg_subtle"]};">Acento sugerido para el híbrido: International Orange o Amber. Probar ambos sobre el moodboard 02 con el tweak «Acento» antes de decidir. Las puntuaciones son un punto de partida para discutir, no un veredicto.</p></div>'
            f'<div style="grid-column: span 7; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; align-content: start;">{cols}</div></div>')
    top = (f'<div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 16px; border-bottom: 1px solid {p["line_strong"]};">'
           f'{label(d, "MOODBOARDS · 04 / 04", p["fg"])}{label(d, "THE UNIVERSE + MISSION CONTROL · ART DIRECTION · FASE 1")}{label(d, "COMPARATIVA Y RECOMENDACIÓN")}</div>')
    title = (f'<div style="display: grid; grid-template-columns: repeat(12, minmax(0, 1fr)); gap: 24px; padding: 56px 0 56px 0; align-items: end;">'
             f'<h1 style="grid-column: span 7; font-family: {d["display"]}; font-size: 96px; line-height: 0.95; font-weight: 400; color: {p["fg"]};">Comparativa y recomendación</h1>'
             f'<p style="grid-column: span 5; font-family: {d["sans"]}; font-size: 18px; line-height: 1.5; color: {p["fg_muted"]}; padding-bottom: 8px; text-wrap: pretty;">Las tres direcciones evaluadas contra los criterios del brief. Siguiente paso: elegir una dirección (o confirmar el híbrido) y pasar al design system con los tokens del brief.</p></div>')
    next_step = (f'<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 56px; padding-top: 16px; border-top: 1px solid {p["line_strong"]};">'
                 f'{label(d, "SIGUIENTE → DESIGN SYSTEM · TOKENS §9 · COMPONENTES CON ESTADOS", p["fg_muted"])}{label(d, "FASE 1 → FASE 2")}</div>')
    head_style = (f'body {{ margin: 0; background: {p["bg"]}; }} * {{ box-sizing: border-box; }} '
                  f'a {{ color: {acc}; }} a:hover {{ color: {p["fg"]}; }} h1, h2, h3, p {{ margin: 0; }}')
    root = (f'<div style="width: 1440px; min-height: {H_MAIN}px; background: {p["bg"]}; color: {p["fg"]}; font-family: {d["sans"]}; padding: 48px 72px 56px 72px;">'
            f'{top}{title}{table}{reco}{next_step}</div>')
    return ('<!doctype html>\n<html>\n<head>\n  <meta charset="utf-8">\n  <script src="./support.js"></script>\n</head>\n<body>\n<x-dc>\n<helmet>\n'
            f'  <link rel="stylesheet" href="{um["fonts_link"]}">\n  <style>{head_style}</style>\n</helmet>\n{root}\n</x-dc>\n</body>\n</html>\n')


def write(name, html):
    path = os.path.join(HERE, name)
    with open(path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"{name}: {len(html.encode('utf-8')) / 1024:.0f} KB")


if __name__ == "__main__":
    for d in DIRS:
        write(f"{d['file']}.dc.html", document(d))
    write("Main.dc.html", main_document())
