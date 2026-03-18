# AGENTS.md — DebtOut
> Instrucciones definitivas para cualquier agente de IA (Claude, GPT-4, Gemini, Cursor, Windsurf, Copilot, Aider, etc.)
> Leé este archivo completo ANTES de escribir cualquier línea de código.
> Compatible con: Claude Code, Cursor, Windsurf, GitHub Copilot Agent, Aider

---

## 🧠 ROL DEL AGENTE

Adoptá este rol durante todo el proyecto:

> Sos un **Senior Full-Stack Engineer** con 10+ años de experiencia en productos financieros para LATAM. Dominás React, TypeScript, FastAPI, Python y diseño de sistemas. Sabés que el código es el medio — el fin es que una persona angustiada por sus deudas salga de esta app con esperanza y un plan claro. Cada decisión técnica debe servir a ese objetivo.

**Principios que guían cada decisión:**
- UX primero, siempre. Una animación bien hecha vale más que una feature extra.
- Simple y funcional supera complejo y roto.
- El usuario tiene deudas y está estresado. La app transmite calma, control y esperanza.
- Seguridad real: la API key de Anthropic NUNCA toca el frontend.
- Código production-ready desde el primer commit.

---

## 📦 CONTEXTO DEL PROYECTO

| Campo | Valor |
|---|---|
| **Nombre** | DebtOut |
| **Tipo** | Web app de coach financiero personal con IA |
| **Evento** | Hackathon CubePath 2026 — organizada por midudev |
| **Deadline** | 31 de marzo de 2026 a las 23:59 CET |
| **Deploy** | CubePath VPS gp.nano (1 vCPU, 2GB RAM, 40GB NVMe) |
| **Repo** | Público en GitHub |

**Problema que resuelve:**
Las personas en LATAM no tienen acceso fácil a asesoramiento financiero real. DebtOut democratiza ese acceso: el usuario ingresa sus deudas, elige una estrategia, y Claude genera un plan personalizado adaptado a la realidad latinoamericana — guardado con un PIN privado, recuperable cuando quiera.

**Propuesta de valor:**
> "Ingresá tus deudas. La IA arma tu plan. Guardalo con tu PIN. Gratis, sin registro."

---

## 🏗️ ARQUITECTURA COMPLETA

```
┌─────────────────────────────────────────────────────────────┐
│                    CubePath VPS gp.nano                      │
│                                                             │
│  ┌─────────────┐    ┌──────────────┐    ┌───────────────┐  │
│  │   Nginx     │    │   FastAPI    │    │    SQLite     │  │
│  │  (puerto 80)│───▶│  (puerto 8000│───▶│  debtout.db   │  │
│  │             │    │              │    │               │  │
│  │  /          │    │  /api/*      │    │  plans table  │  │
│  │  → dist/    │    │              │    │               │  │
│  └─────────────┘    └──────┬───────┘    └───────────────┘  │
│                            │                                │
│                            ▼                                │
│                    ┌───────────────┐                        │
│                    │  Anthropic    │                        │
│                    │  Claude API   │                        │
│                    │  (server-side)│                        │
│                    └───────────────┘                        │
└─────────────────────────────────────────────────────────────┘
         ▲
         │ HTTPS
         │
┌────────────────┐
│ React + Vite   │
│ TypeScript     │
│ Tailwind CSS   │
│ Framer Motion  │
└────────────────┘
```

### Stack técnico completo

**Frontend:**
```
React 18 + Vite 5 + TypeScript
Tailwind CSS v3
Framer Motion (animaciones)
React Query (estado servidor)
Axios (HTTP client)
```

**Backend:**
```
FastAPI (Python 3.11+)
SQLModel (ORM sobre SQLite)
SQLite (base de datos — archivo único debtout.db)
Uvicorn (ASGI server)
httpx (llamadas async a Claude API)
python-dotenv (variables de entorno)
```

**Infraestructura:**
```
CubePath VPS gp.nano
Nginx (reverse proxy + static files)
Systemd (proceso uvicorn como servicio)
```

---

## 📁 ESTRUCTURA DE ARCHIVOS

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
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── store/
│   │   │   └── useStore.ts       # Zustand global state
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
├── AGENTS.md
└── PROMPT_DEBTOUT.md
```

---

## 🎨 SISTEMA DE DISEÑO

### Paleta de colores — NO inventar variantes
```css
/* En tailwind.config.ts, extender la paleta con estos valores exactos */
colors: {
  bg:         '#080b0f',   /* fondo principal */
  surface:    '#0f1318',   /* tarjetas */
  surface2:   '#161c24',   /* tarjetas anidadas, inputs */
  border:     '#1e2730',   /* bordes */
  accent:     '#00e5a0',   /* verde neón — acción principal */
  'accent-dim':'#00b37d',  /* verde hover */
  accent2:    '#ff6b35',   /* naranja — alertas */
  accent3:    '#4d9fff',   /* azul — info */
  gold:       '#f5c842',   /* dorado — libertad financiera */
  danger:     '#ff4757',   /* rojo — errores */
  text:       '#e8edf2',   /* texto principal */
  snow:       '#9ba8b5',   /* texto secundario */
  muted:      '#5a6472',   /* placeholders */
}
```

### Tipografía — OBLIGATORIA
```
Google Fonts: Syne (400, 600, 700, 800) + DM Mono (400, 500)

Display/Títulos grandes:  font-syne font-extrabold
UI/Botones/Labels:        font-syne font-semibold
Cuerpo/Texto:             font-syne font-normal
Números/Datos/PIN:        font-mono (DM Mono)
```

**NUNCA usar:** Inter, Roboto, Arial, system-ui

### Componentes base
```tsx
// Tarjeta estándar
<div className="bg-surface border border-border rounded-xl p-6 backdrop-blur-sm">

// Tarjeta destacada (con glow)
<div className="bg-surface border border-accent/20 rounded-xl p-6 shadow-[0_0_24px_rgba(0,229,160,0.08)]">

// Botón primario
<button className="bg-accent text-bg font-syne font-bold px-8 py-4 rounded-xl
                   hover:bg-accent-dim transition-all duration-200
                   shadow-[0_0_20px_rgba(0,229,160,0.3)]
                   hover:shadow-[0_0_32px_rgba(0,229,160,0.5)]">

// Botón secundario
<button className="border border-border text-snow font-syne px-8 py-4 rounded-xl
                   hover:border-accent/50 hover:text-text transition-all duration-200">

// Input
<input className="w-full bg-surface2 border border-border rounded-lg px-4 py-3
                  text-text font-syne placeholder:text-muted
                  focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20
                  transition-all duration-200">

// Badge
<span className="bg-accent/10 text-accent border border-accent/20
                 font-mono text-xs px-3 py-1 rounded-full">
```

### Animaciones con Framer Motion
```tsx
// Entrada de pantalla
const screenVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.25 } }
}

// Stagger para listas
const containerVariants = {
  hidden:  { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
}
const itemVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
}

// Siempre usar AnimatePresence para transiciones entre pantallas
<AnimatePresence mode="wait">
  <motion.div key={currentScreen} variants={screenVariants}
              initial="hidden" animate="visible" exit="exit">
    {/* pantalla actual */}
  </motion.div>
</AnimatePresence>
```

---

## 🔄 ESTADO GLOBAL (Zustand)

```typescript
// store/useStore.ts
interface AppState {
  // Navegación
  screen: Screen
  lang: 'es' | 'en'

  // Datos del usuario
  userData: {
    nombre: string
    extraMensual: number
    moneda: Currency
    estrategia: Strategy
    deudas: Debt[]
  }

  // Resultado
  resultado: PlanResult | null
  pin: string | null
  isLoading: boolean
  error: string | null

  // Acciones
  setScreen: (screen: Screen) => void
  setLang: (lang: 'es' | 'en') => void
  setUserData: (data: Partial<AppState['userData']>) => void
  addDebt: (debt: Debt) => void
  removeDebt: (id: string) => void
  updateDebt: (id: string, debt: Partial<Debt>) => void
  setResultado: (resultado: PlanResult, pin: string) => void
  reset: () => void
}

type Screen = 'landing' | 'recover' | 'step1' | 'step2' | 'step3' | 'loading' | 'result' | 'error'
type Strategy = 'snowball' | 'avalanche' | 'consolidation' | 'ai'
type Currency = 'USD' | 'PYG' | 'ARS' | 'BRL' | 'COP' | 'MXN'
```

---

## 📐 TIPOS TYPESCRIPT

```typescript
// types/index.ts

export interface Debt {
  id: string          // uuid
  nombre: string
  saldo: number
  tasa: number        // % anual
  cuotaMin: number    // cuota mínima mensual
}

export interface PlanResult {
  score: number                    // 0-100
  estrategia_usada: string
  razon_estrategia: string
  meses_total: number
  fecha_libertad: string           // "Octubre 2028"
  intereses_ahorrados: number
  orden_pago: PaymentOrder[]
  aplica_consolidacion: boolean
  consejo_consolidacion: string
  consejo_latam: string
  mensaje_motivacional: string
  advertencia: string
}

export interface PaymentOrder {
  orden: number
  nombre: string
  saldo: number
  pago_mensual: number
  mes_liquidacion: string
  porcentaje_del_total: number
}

export interface PlanResponse {
  pin: string
  plan: PlanResult
  created_at: string
  expires_at: string
}
```

---

## 🔌 API CLIENT (frontend/src/lib/api.ts)

```typescript
import axios from 'axios'
import type { PlanResponse, PlanResult } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 30000,  // 30s para dar tiempo a Claude
  headers: { 'Content-Type': 'application/json' }
})

// Generar plan nuevo
export async function generatePlan(payload: {
  nombre: string
  extra_mensual: number
  moneda: string
  estrategia: string
  lang: string
  deudas: Array<{
    nombre: string
    saldo: number
    tasa: number
    cuota_min: number
  }>
}): Promise<PlanResponse> {
  const { data } = await api.post<PlanResponse>('/plan/generate', payload)
  return data
}

// Recuperar plan por PIN
export async function recoverPlan(pin: string): Promise<PlanResponse> {
  const { data } = await api.get<PlanResponse>(`/plan/${pin}`)
  return data
}

// Health check
export async function healthCheck(): Promise<boolean> {
  try {
    await api.get('/health')
    return true
  } catch {
    return false
  }
}
```

---

## ⚙️ BACKEND COMPLETO

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
```bash
ANTHROPIC_API_KEY=sk-ant-...
CLAUDE_MODEL=claude-haiku-4-5
MAX_TOKENS=1500
DATABASE_URL=sqlite:///./debtout.db
CORS_ORIGINS=http://localhost:5173,http://TU_IP_CUBEPATH
PIN_EXPIRY_DAYS=30
```

### database.py
```python
from sqlmodel import create_engine, SQLModel, Session
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./debtout.db")
engine = create_engine(DATABASE_URL, echo=False,
                       connect_args={"check_same_thread": False})

def create_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
```

### models.py
```python
from sqlmodel import SQLModel, Field
from datetime import datetime
from typing import Optional
import uuid

class Plan(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    pin: str = Field(unique=True, index=True)
    lang: str = Field(default="es")
    moneda: str = Field(default="USD")
    extra_mensual: float
    estrategia: str
    debts_json: str      # JSON serializado de las deudas
    result_json: str     # JSON serializado del plan de Claude
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
```

### pin_service.py
```python
import random
import string
from sqlmodel import Session, select
from models import Plan

def generate_unique_pin(session: Session) -> str:
    """Genera un PIN de 6 dígitos único en formato XXX-XXX"""
    while True:
        digits = ''.join(random.choices(string.digits, k=6))
        pin = f"{digits[:3]}-{digits[3:]}"
        existing = session.exec(select(Plan).where(Plan.pin == pin)).first()
        if not existing:
            return pin

def validate_pin_format(pin: str) -> bool:
    """Valida formato XXX-XXX"""
    parts = pin.split('-')
    return (len(parts) == 2 and
            len(parts[0]) == 3 and len(parts[1]) == 3 and
            parts[0].isdigit() and parts[1].isdigit())
```

### claude_service.py
```python
import httpx
import json
import os
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-haiku-4-5")
MAX_TOKENS = int(os.getenv("MAX_TOKENS", "1500"))

async def generate_debt_plan(
    nombre: str,
    extra_mensual: float,
    moneda: str,
    estrategia: str,
    lang: str,
    deudas: list[dict]
) -> dict:
    """Llama a Claude API y retorna el plan como dict"""

    lang_instruction = "Respond ENTIRELY in English." if lang == "en" else "Respondé COMPLETAMENTE en Español."

    deudas_text = "\n".join([
        f"{i+1}. {d['nombre']}: saldo {moneda} {d['saldo']}, "
        f"tasa {d['tasa']}% anual, cuota mínima {moneda} {d['cuota_min']}/mes"
        for i, d in enumerate(deudas)
    ])

    prompt = f"""Sos un experto asesor financiero especializado en economías latinoamericanas.
{lang_instruction}

Usuario: {nombre or 'Usuario'}
Dinero extra disponible por mes (además de cuotas mínimas): {moneda} {extra_mensual}
Estrategia preferida: {estrategia}

Deudas:
{deudas_text}

Generá un plan de pago completo. Respondé ÚNICAMENTE con JSON válido (sin markdown, sin backticks):

{{
  "score": <0-100, salud financiera actual>,
  "estrategia_usada": "<nombre de la estrategia aplicada>",
  "razon_estrategia": "<2-3 líneas explicando por qué esta estrategia>",
  "meses_total": <número de meses hasta liquidar todo>,
  "fecha_libertad": "<Mes Año, ej: Octubre 2028>",
  "intereses_ahorrados": <número — ahorro vs pagar solo mínimos>,
  "orden_pago": [
    {{
      "orden": 1,
      "nombre": "<nombre deuda>",
      "saldo": <número>,
      "pago_mensual": <número>,
      "mes_liquidacion": "<Mes Año>",
      "porcentaje_del_total": <número 0-100>
    }}
  ],
  "aplica_consolidacion": <true|false>,
  "consejo_consolidacion": "<cómo consolidar en LATAM si aplica, sino string vacío>",
  "consejo_latam": "<3-4 oraciones con consejo específico para realidad latinoamericana>",
  "mensaje_motivacional": "<1-2 oraciones inspiradoras y poderosas>",
  "advertencia": "<riesgo en los datos del usuario, o string vacío>"
}}"""

    async with httpx.AsyncClient(timeout=25.0) as client:
        response = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers={
                "Content-Type": "application/json",
                "x-api-key": ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01"
            },
            json={
                "model": CLAUDE_MODEL,
                "max_tokens": MAX_TOKENS,
                "messages": [{"role": "user", "content": prompt}]
            }
        )
        response.raise_for_status()
        data = response.json()
        raw = data["content"][0]["text"].strip()
        # Limpiar posibles backticks
        clean = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(clean)
```

### schemas.py
```python
from pydantic import BaseModel, Field, validator
from typing import Optional

class DebtInput(BaseModel):
    nombre: str = Field(..., min_length=1, max_length=100)
    saldo: float = Field(..., gt=0)
    tasa: float = Field(..., ge=0, le=500)
    cuota_min: float = Field(..., ge=0)

class GeneratePlanRequest(BaseModel):
    nombre: Optional[str] = ""
    extra_mensual: float = Field(..., ge=0)
    moneda: str = Field(default="USD")
    estrategia: str = Field(default="ai")
    lang: str = Field(default="es")
    deudas: list[DebtInput] = Field(..., min_items=1, max_items=8)

    @validator('moneda')
    def validate_moneda(cls, v):
        allowed = ['USD', 'PYG', 'ARS', 'BRL', 'COP', 'MXN']
        if v not in allowed:
            raise ValueError(f'Moneda debe ser una de: {allowed}')
        return v

    @validator('estrategia')
    def validate_estrategia(cls, v):
        allowed = ['snowball', 'avalanche', 'consolidation', 'ai']
        if v not in allowed:
            raise ValueError(f'Estrategia debe ser una de: {allowed}')
        return v

    @validator('lang')
    def validate_lang(cls, v):
        if v not in ['es', 'en']:
            raise ValueError('Lang debe ser es o en')
        return v

class PlanResponse(BaseModel):
    pin: str
    plan: dict
    created_at: str
    expires_at: str
```

### main.py
```python
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select
from datetime import datetime, timedelta
from dotenv import load_dotenv
import json, os

from database import create_db, get_session
from models import Plan
from schemas import GeneratePlanRequest, PlanResponse
from claude_service import generate_debt_plan
from pin_service import generate_unique_pin, validate_pin_format

load_dotenv()
create_db()

app = FastAPI(title="DebtOut API", version="1.0.0")

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "DebtOut API"}

@app.post("/api/plan/generate", response_model=PlanResponse)
async def generate_plan(
    request: GeneratePlanRequest,
    session: Session = Depends(get_session)
):
    try:
        result = await generate_debt_plan(
            nombre=request.nombre,
            extra_mensual=request.extra_mensual,
            moneda=request.moneda,
            estrategia=request.estrategia,
            lang=request.lang,
            deudas=[d.dict() for d in request.deudas]
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Error generando plan con IA: {str(e)}")

    pin = generate_unique_pin(session)
    expiry_days = int(os.getenv("PIN_EXPIRY_DAYS", "30"))
    expires_at = datetime.utcnow() + timedelta(days=expiry_days)

    plan = Plan(
        pin=pin,
        lang=request.lang,
        moneda=request.moneda,
        extra_mensual=request.extra_mensual,
        estrategia=request.estrategia,
        debts_json=json.dumps([d.dict() for d in request.deudas]),
        result_json=json.dumps(result),
        expires_at=expires_at
    )
    session.add(plan)
    session.commit()

    return PlanResponse(
        pin=pin,
        plan=result,
        created_at=plan.created_at.isoformat(),
        expires_at=expires_at.isoformat()
    )

@app.get("/api/plan/{pin}", response_model=PlanResponse)
async def get_plan(pin: str, session: Session = Depends(get_session)):
    if not validate_pin_format(pin):
        raise HTTPException(status_code=400, detail="Formato de PIN inválido. Debe ser XXX-XXX")

    plan = session.exec(select(Plan).where(Plan.pin == pin)).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan no encontrado")

    if datetime.utcnow() > plan.expires_at:
        raise HTTPException(status_code=410, detail="Este plan expiró. Generá uno nuevo.")

    return PlanResponse(
        pin=plan.pin,
        plan=json.loads(plan.result_json),
        created_at=plan.created_at.isoformat(),
        expires_at=plan.expires_at.isoformat()
    )
```

---

## 🖥️ PANTALLAS DEL FRONTEND

### LANDING
```
Elementos:
- Logo "DebtOut" — Syne 800 + punto verde animado
- Tagline ES principal + EN secundario
- Subtítulo con propuesta de valor
- CTA "Comenzar ahora →" — botón grande con glow animation
- 3 pills: ⚡ 2 minutos | 🔒 PIN privado | 🤖 Plan con IA
- Botón secundario "Recuperar plan con PIN" (texto link)
- Fondo: grid sutil de puntos + noise texture overlay
```

### STEP 1 — Datos base
```
- Nombre (opcional, solo para personalizar)
- Monto extra por mes + selector de moneda [USD|PYG|ARS|BRL|COP|MXN]
- Toggle idioma ES | EN
- Botón "Continuar →"
- Validación inline en tiempo real
```

### STEP 2 — Cargar deudas
```
- Tarjetas de deuda (min 1, max 8)
  Cada tarjeta: Nombre | Saldo | Tasa % | Cuota mínima
- Botón "Agregar deuda +"
- Resumen en tiempo real al fondo
- Validación: todos los campos requeridos
- Botón "Continuar →"
```

### STEP 3 — Estrategia
```
4 tarjetas seleccionables:
- ❄️ Bola de Nieve
- 🌊 Alud/Avalancha
- 🔗 Consolidación
- 🤖 Plan IA (pre-seleccionada, badge RECOMENDADO)

Botón "Generar mi plan →"
```

### LOADING
```
- Logo pulsante con Framer Motion
- Textos rotativos cada 2.5s (5-6 frases)
- Progress bar animada fake (0→90% en 8s)
- "Powered by Claude AI"
```

### RESULT — La pantalla más importante
```
A. Header
   - "¡[Nombre], tu plan está listo!"
   - Score circular animado (SVG + Framer Motion)
   - Fecha libertad financiera (color gold, tipografía grande)

B. PIN DE ACCESO — tarjeta especial
   - Fondo con gradiente accent/10
   - PIN en DM Mono grande: "483-271"
   - Texto: "Guardá este PIN para recuperar tu plan"
   - Botón copiar PIN
   - "Tu plan se guarda por 30 días"

C. 3 métricas clave
   - Total deudas | Tiempo | Intereses ahorrados
   - Números con counter animation

D. Estrategia + razón

E. Timeline de pago
   - Lista visual ordenada con barras de progreso

F. Consejo LATAM (tarjeta azul)

G. Advertencia si existe (tarjeta naranja)

H. Mensaje motivacional (tipografía grande, color accent)

I. CTAs
   - "📋 Copiar plan completo"
   - "🔄 Nuevo plan"
```

### RECOVER PLAN
```
- Input PIN en formato XXX-XXX (auto-formato al escribir)
- Botón "Recuperar mi plan"
- Manejo de errores: PIN no encontrado | PIN expirado
- Al recuperar: va directo a RESULT con los datos
```

---

## 🚀 DEPLOY EN CUBEPATH

### nginx.conf
```nginx
server {
    listen 80;
    server_name _;
    root /var/www/debtout;
    index index.html;

    # Frontend — React SPA
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Backend — FastAPI
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 60s;
    }
}
```

### deploy.sh
```bash
#!/bin/bash
# Deploy script para CubePath VPS
# Uso: ./deploy.sh TU_IP_CUBEPATH

IP=$1
if [ -z "$IP" ]; then echo "Uso: ./deploy.sh IP_DEL_VPS"; exit 1; fi

echo "🚀 Deployando DebtOut en CubePath ($IP)..."

# Build frontend
cd frontend
npm install && npm run build
cd ..

# Subir archivos
scp -r frontend/dist root@$IP:/var/www/debtout
scp -r backend/ root@$IP:/opt/debtout-api
scp nginx.conf root@$IP:/etc/nginx/sites-available/debtout

# Configurar en el servidor
ssh root@$IP << 'EOF'
  # Nginx
  ln -sf /etc/nginx/sites-available/debtout /etc/nginx/sites-enabled/
  nginx -t && systemctl reload nginx

  # Backend
  cd /opt/debtout-api
  pip install -r requirements.txt -q
  # Crear servicio systemd
  cat > /etc/systemd/system/debtout.service << 'SERVICE'
[Unit]
Description=DebtOut FastAPI
After=network.target

[Service]
WorkingDirectory=/opt/debtout-api
ExecStart=/usr/bin/python3 -m uvicorn main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
SERVICE

  systemctl daemon-reload
  systemctl enable debtout
  systemctl restart debtout

  echo "✅ Deploy completado!"
  systemctl status debtout --no-pager
EOF
```

---

## ✅ REGLAS DE CALIDAD

### SIEMPRE
- TypeScript strict mode en el frontend
- Tipos explícitos — nunca `any`
- Try/catch en todas las llamadas a la API
- Validación de inputs antes de enviar al backend
- Mensajes de error amigables (nunca errores técnicos al usuario)
- Comentarios en secciones complejas
- Variables de entorno para toda configuración sensible

### NUNCA
- La API key de Anthropic en el frontend — JAMÁS
- `console.log` en producción
- Colores fuera de las variables del design system
- Fuentes distintas a Syne y DM Mono
- `any` en TypeScript
- Strings de UI hardcodeadas (siempre usar i18n)
- Múltiples llamadas a la API innecesariamente

---

## 📋 CHECKLIST PRE-ENTREGA HACKATHON

**Funcionalidad**
- [ ] Flujo completo: Landing → Step1 → Step2 → Step3 → Loading → Result
- [ ] Recuperar plan con PIN funciona correctamente
- [ ] PIN se muestra y se puede copiar
- [ ] Cambio de idioma ES/EN funciona en todas las pantallas
- [ ] Todas las monedas funcionan en el selector
- [ ] Los errores de API muestran mensajes amigables
- [ ] Plan expirado muestra mensaje claro

**Diseño**
- [ ] Animaciones Framer Motion en todas las transiciones
- [ ] Score circle se anima al mostrar resultado
- [ ] Counters de números se animan
- [ ] App es completamente responsive (320px mínimo)
- [ ] Colores del design system aplicados consistentemente

**Backend**
- [ ] API key de Anthropic en .env (no en código)
- [ ] CORS configurado correctamente
- [ ] SQLite se crea automáticamente al arrancar
- [ ] PINs son únicos y en formato XXX-XXX
- [ ] Planes expirados retornan 410

**Deploy**
- [ ] Frontend accesible en http://IP_CUBEPATH
- [ ] Backend /api/health retorna 200
- [ ] Nginx proxy funcionando correctamente
- [ ] Servicio systemd arranca automáticamente

**Hackathon**
- [ ] Repositorio público en GitHub
- [ ] README.md con descripción, demo link y screenshots/GIFs
- [ ] Issue registrada en github.com/midudev/hackaton-cubepath-2026
- [ ] Entrega antes del 31 de marzo a las 23:59 CET

---

*AGENTS.md — DebtOut v2.0 | Hackathon CubePath 2026*
*Compatible con: Claude, GPT-4o, Gemini, Cursor, Windsurf, GitHub Copilot Agent, Aider, Claude Code*