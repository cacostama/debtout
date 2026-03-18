# PROMPT MAESTRO — DebtOut v2.0
# Hackathon CubePath 2026
#
# INSTRUCCIONES DE USO:
# 1. Copiá TODO este archivo
# 2. Pegalo en tu agente de IA (Claude, Cursor, Windsurf, etc.)
# 3. El agente construirá el proyecto completo
# 4. Reemplazá los valores del .env antes de deployar
# ─────────────────────────────────────────────────────────────

## TU ROL

Sos un Senior Full-Stack Engineer experto en productos financieros para LATAM.
Vas a construir **DebtOut** — una web app completa que ayuda a personas a salir
de sus deudas usando IA. Es mi proyecto para la Hackathon CubePath 2026.

Los criterios de evaluación en orden son:
1. 🎨 Experiencia del usuario (UX) ← EL MÁS IMPORTANTE
2. 💡 Creatividad
3. 🔧 Utilidad
4. ⚙️ Implementación técnica

**Construí para ganar. Cada decisión debe servir a ese objetivo.**

---

## STACK COMPLETO A USAR

```
Frontend:  React 18 + Vite 5 + TypeScript + Tailwind CSS + Framer Motion + Zustand
Backend:   FastAPI (Python 3.11) + SQLite (via SQLModel) + httpx
IA:        Anthropic Claude API — claude-haiku-4-5 (llamada server-side, SEGURA)
Deploy:    CubePath VPS — Nginx + Systemd
```

**Regla de oro de seguridad:** La API key de Anthropic NUNCA va en el frontend.
Siempre server-side en FastAPI con variables de entorno.

---

## QUÉ ES DEBTOUT

DebtOut es un **coach financiero personal con IA** para LATAM.

El usuario:
1. Ingresa sus deudas (nombre, saldo, tasa, cuota mínima)
2. Elige una estrategia (o deja que la IA elija)
3. Recibe un plan personalizado generado por Claude
4. Obtiene un **PIN privado de 6 dígitos** para recuperar su plan después
5. Puede volver en cualquier momento con su PIN y ver su plan

**Sin registro. Sin email. 100% privado. Planes guardados 30 días.**

Taglines:
- ES: "Tu plan inteligente para salir de deudas"
- EN: "Your smart plan to become debt-free"

---

## ARQUITECTURA

```
CubePath VPS gp.nano
├── Nginx (puerto 80)
│   ├── /* → React SPA (archivos estáticos en /var/www/debtout)
│   └── /api/* → FastAPI (proxy a puerto 8000)
│
├── FastAPI (puerto 8000, systemd)
│   ├── POST /api/plan/generate → llama Claude → guarda en SQLite → devuelve plan + PIN
│   └── GET  /api/plan/{pin}    → busca en SQLite → devuelve plan
│
└── SQLite (debtout.db)
    └── tabla: plans (id, pin, lang, moneda, extra_mensual, estrategia, debts_json, result_json, created_at, expires_at)
```

---

## ESTRUCTURA DE ARCHIVOS A CREAR

```
debtout/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── screens/
│   │   │   │   ├── Landing.tsx
│   │   │   │   ├── Step1.tsx
│   │   │   │   ├── Step2.tsx
│   │   │   │   ├── Step3.tsx
│   │   │   │   ├── Loading.tsx
│   │   │   │   ├── Result.tsx
│   │   │   │   └── RecoverPlan.tsx
│   │   │   └── ui/
│   │   │       ├── DebtCard.tsx
│   │   │       ├── StrategyCard.tsx
│   │   │       ├── ScoreCircle.tsx
│   │   │       ├── MetricCard.tsx
│   │   │       ├── PinDisplay.tsx
│   │   │       ├── TimelineItem.tsx
│   │   │       └── ProgressBar.tsx
│   │   ├── hooks/
│   │   │   ├── useDebtPlan.ts
│   │   │   └── useAnimatedCounter.ts
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── i18n.ts
│   │   │   └── calculations.ts
│   │   ├── types/index.ts
│   │   ├── store/useStore.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   ├── claude_service.py
│   ├── pin_service.py
│   ├── database.py
│   ├── .env.example
│   └── requirements.txt
│
├── nginx.conf
├── deploy.sh
├── README.md
└── AGENTS.md
```

---

## DISEÑO — INSTRUCCIONES EXACTAS

### Estética: "Dark Fintech Editorial Latino"
Como si The Economist y Stripe tuvieran un hijo latinoamericano.
Serio pero esperanzador. Profesional pero accesible.

### Paleta (OBLIGATORIA — no inventar variantes)
```typescript
// tailwind.config.ts
extend: {
  colors: {
    bg:          '#080b0f',
    surface:     '#0f1318',
    surface2:    '#161c24',
    border:      '#1e2730',
    accent:      '#00e5a0',
    'accent-dim':'#00b37d',
    accent2:     '#ff6b35',
    accent3:     '#4d9fff',
    gold:        '#f5c842',
    danger:      '#ff4757',
    text:        '#e8edf2',
    snow:        '#9ba8b5',
    muted:       '#5a6472',
  },
  fontFamily: {
    syne: ['Syne', 'sans-serif'],
    mono: ['DM Mono', 'monospace'],
  }
}
```

### Google Fonts a incluir en index.html
```html
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet"/>
```

### Fondo con textura
```css
/* En index.css — aplicar al body */
body {
  background-color: #080b0f;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
}
```

### Animaciones Framer Motion (OBLIGATORIAS)
```typescript
// Usar en TODAS las transiciones entre pantallas
export const screenVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.25 } }
}

// Para listas (deudas, métricas, timeline)
export const containerVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } }
}
export const itemVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
}

// Siempre envolver en AnimatePresence mode="wait"
```

---

## PANTALLAS DETALLADAS

### LANDING
Hero centrado con:
- Logo DebtOut (Syne 800, con punto verde animado que pulsa)
- Tagline principal grande
- Tagline EN secundario más pequeño en DM Mono
- Subtítulo descriptivo
- Botón CTA enorme "Comenzar ahora →" con glow de accent
- 3 pills de beneficio: ⚡ 2 minutos | 🔒 PIN privado | 🤖 Plan con IA
- Link "Recuperar plan con PIN →" debajo

### STEP 1 — Datos base
- Input nombre (placeholder "¿Cómo te llamamos?")
- Input numérico monto extra + select moneda (USD/PYG/ARS/BRL/COP/MXN)
- Toggle bilingüe: botones ES | EN
- Warning si monto = 0: "Solo pagarás mínimos sin dinero extra"
- Botón "Continuar →"

### STEP 2 — Deudas
Por cada deuda (máx 8):
```
┌──────────────────────────────────────┐
│ #1  Nombre de la deuda          [×]  │
│ ─────────────────────────────────── │
│ Saldo total    Tasa anual %          │
│ [__________]   [______]              │
│ Cuota mínima mensual                 │
│ [__________]                         │
└──────────────────────────────────────┘
```
- Animación slide-down al agregar
- Validación inline verde/rojo
- Resumen sticky: "Total: $X | Cuotas: $Y/mes"
- Botón "Agregar deuda +"
- Botón "Continuar →"

### STEP 3 — Estrategia
4 tarjetas seleccionables con hover/active states:
```
❄️ BOLA DE NIEVE
   Menor saldo primero
   Victorias rápidas → motivación sostenida

🌊 ALUD / AVALANCHA
   Mayor interés primero
   Menos intereses en total

🔗 CONSOLIDACIÓN
   Unificar todas las deudas
   Una sola cuota mensual

🤖 PLAN IA ← pre-seleccionada, badge "RECOMENDADO"
   Claude analiza todo y combina estrategias
```
Botón "Generar mi plan →"

### LOADING
- Logo DebtOut con pulse animation (Framer Motion)
- Array de textos rotativos cada 2.5s:
  - "Analizando tus deudas..."
  - "Calculando la mejor estrategia..."
  - "Optimizando tu plan de pagos..."
  - "Consultando con la IA financiera..."
  - "¡Preparando tu camino a la libertad!"
- Progress bar animada (0→90% en 8s, easing suave)
- "Powered by Claude AI" en muted

### RESULT — La más importante
```
┌─────────────────────────────────────────────┐
│  ¡[Nombre], tu plan está listo!             │
│                                             │
│         [Score Circle Animado]              │
│              87/100                         │
│                                             │
│  🎉 Serás libre de deudas en Octubre 2028  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  🔑 TU PIN DE ACCESO                        │
│                                             │
│         4 8 3 - 2 7 1                       │
│         (DM Mono grande, accent color)      │
│                                             │
│  Guardá este PIN para recuperar tu plan     │
│  Tu plan se guarda por 30 días              │
│                    [📋 Copiar PIN]          │
└─────────────────────────────────────────────┘

┌──────────┐  ┌──────────┐  ┌──────────┐
│ $12,500  │  │ 28 meses │  │  $1,840  │
│ Total    │  │  Libertad│  │  Ahorrado│
└──────────┘  └──────────┘  └──────────┘
(counter animation al aparecer)

Estrategia usada + razón explicada

[Timeline visual de deudas ordenadas]
Cada item:
  1. → Tarjeta Visa    $3,200  →  $480/mes  →  Dic 2026
     ████████░░░░░░░░ 25% del total

[Consejo LATAM — tarjeta borde azul]
[Advertencia si existe — tarjeta borde naranja]
[Mensaje motivacional — tipografía grande accent]

[📋 Copiar plan completo]  [🔄 Nuevo plan]
```

### RECOVER PLAN
- Input PIN con auto-formato XXX-XXX
- Botón "Recuperar mi plan"
- Errores: PIN no encontrado | PIN expirado
- Al recuperar: muestra pantalla Result completa

---

## BACKEND COMPLETO

### requirements.txt
```
fastapi==0.115.0
uvicorn[standard]==0.30.0
sqlmodel==0.0.21
httpx==0.27.0
python-dotenv==1.0.1
pydantic==2.8.0
```

### .env.example
```
ANTHROPIC_API_KEY=sk-ant-api03-...
CLAUDE_MODEL=claude-haiku-4-5
MAX_TOKENS=1500
DATABASE_URL=sqlite:///./debtout.db
CORS_ORIGINS=http://localhost:5173,http://TU_IP_CUBEPATH
PIN_EXPIRY_DAYS=30
```

### Endpoints
```
GET  /api/health            → {"status": "ok"}
POST /api/plan/generate     → genera plan, guarda en DB, retorna plan + PIN
GET  /api/plan/{pin}        → retorna plan guardado por PIN
```

### Formato PIN
- 6 dígitos únicos en formato XXX-XXX (ej: "483-271")
- Generado aleatoriamente, verificado contra DB para unicidad
- Expira a los 30 días

### Prompt exacto para Claude (en claude_service.py)
```python
prompt = f"""Sos un experto asesor financiero especializado en economías latinoamericanas.
{"Respond ENTIRELY in English." if lang == "en" else "Respondé COMPLETAMENTE en Español."}

Usuario: {nombre or 'Usuario'}
Dinero extra disponible por mes: {moneda} {extra_mensual}
Estrategia preferida: {estrategia}

Deudas:
{chr(10).join([f"{i+1}. {d['nombre']}: saldo {moneda} {d['saldo']}, tasa {d['tasa']}% anual, cuota mínima {moneda} {d['cuota_min']}/mes" for i, d in enumerate(deudas)])}

Respondé ÚNICAMENTE con JSON válido (sin markdown, sin backticks):
{{
  "score": <0-100>,
  "estrategia_usada": "<string>",
  "razon_estrategia": "<2-3 líneas>",
  "meses_total": <número>,
  "fecha_libertad": "<Mes Año>",
  "intereses_ahorrados": <número>,
  "orden_pago": [{{"orden": 1, "nombre": "<>", "saldo": <>, "pago_mensual": <>, "mes_liquidacion": "<Mes Año>", "porcentaje_del_total": <>}}],
  "aplica_consolidacion": <true|false>,
  "consejo_consolidacion": "<string o vacío>",
  "consejo_latam": "<3-4 oraciones>",
  "mensaje_motivacional": "<1-2 oraciones inspiradoras>",
  "advertencia": "<string o vacío>"
}}"""
```

---

## SISTEMA I18N

```typescript
// lib/i18n.ts — implementar objeto TEXTS completo en ES y EN
// Cubrir TODOS los strings de UI: labels, placeholders, botones, mensajes de error
// Función: const t = (key: string) => TEXTS[lang][key] ?? TEXTS['es'][key]
// Hook: const { t, lang, setLang } = useI18n()
```

Strings mínimos requeridos:
- Landing: tagline, subtítulo, CTA, pills, link recuperar
- Steps: títulos, labels de campos, botones, validaciones
- Estrategias: nombres y descripciones de las 4
- Loading: 5 textos rotativos
- Result: todos los labels, PIN section, CTAs
- Errors: mensajes amigables para cada caso

---

## VITE CONFIG

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
```

---

## PACKAGE.JSON FRONTEND

```json
{
  "name": "debtout-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "framer-motion": "^11.0.0",
    "zustand": "^4.5.0",
    "axios": "^1.7.0",
    "@tanstack/react-query": "^5.0.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.1",
    "@vitejs/plugin-react": "^4.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0"
  }
}
```

---

## NGINX CONFIG

```nginx
server {
    listen 80;
    server_name _;
    root /var/www/debtout;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 60s;
        proxy_connect_timeout 60s;
    }
}
```

---

## REGLAS ABSOLUTAS DE CALIDAD

1. **TypeScript strict** — nunca `any`, siempre tipos explícitos
2. **API key en backend** — NUNCA en frontend ni en código fuente
3. **Framer Motion** en TODAS las transiciones de pantalla
4. **i18n** en todos los strings de UI — nunca hardcodeados
5. **Try/catch** en todas las llamadas a la API
6. **Mensajes de error amigables** — nunca errores técnicos al usuario
7. **Responsive** — funcionar desde 320px hasta 1440px
8. **Colores exactos** del design system — nunca improvisar
9. **Fuentes exactas** — solo Syne y DM Mono
10. **Validación** de todos los inputs antes de enviar

---

## ENTREGABLES ESPERADOS

Construí estos archivos completos y funcionales:

**Frontend (13 archivos):**
- src/components/screens/ — 7 pantallas
- src/components/ui/ — 7 componentes
- src/hooks/ — 2 hooks
- src/lib/ — 3 utilidades
- src/types/index.ts
- src/store/useStore.ts
- App.tsx, main.tsx, index.css
- index.html, tailwind.config.ts, vite.config.ts, package.json

**Backend (8 archivos):**
- main.py, models.py, schemas.py
- claude_service.py, pin_service.py, database.py
- requirements.txt, .env.example

**Infra (2 archivos):**
- nginx.conf
- deploy.sh

**Total: proyecto completo, production-ready, listo para ganar.**