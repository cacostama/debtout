# DebtOut 💸

> **ES:** Tu plan inteligente para salir de deudas
> **EN:** Your smart plan to become debt-free

[![Hackathon](https://img.shields.io/badge/Hackathon-CubePath%202026-00e5a0?style=for-the-badge&logo=cloud&logoColor=black)](https://github.com/midudev/hackaton-cubepath-2026)
[![Deploy](https://img.shields.io/badge/Deploy-CubePath%20VPS-0088FF?style=for-the-badge&logo=cloud&logoColor=white)](http://TU_IP_CUBEPATH)
[![AI](https://img.shields.io/badge/AI-Claude%20claude--haiku--4--5-CC785C?style=for-the-badge)](https://anthropic.com)
[![Stack](https://img.shields.io/badge/Stack-React%20%2B%20FastAPI-61DAFB?style=for-the-badge)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🔗 Demo en vivo

👉 **[debtout.app](http://TU_IP_CUBEPATH)** — Desplegado en CubePath VPS

---

## 📸 Capturas

> *Screenshots y GIFs del flujo completo — próximamente*

---

## ¿Qué es DebtOut?

DebtOut es un **coach financiero personal con IA** que ayuda a personas en LATAM a salir de sus deudas con un plan claro, personalizado y accionable.

El usuario ingresa sus deudas, elige una estrategia de pago, y **Claude AI** genera un plan completo adaptado a la realidad latinoamericana. El plan se guarda con un **PIN privado de 6 dígitos** — sin registro, sin email, sin complicaciones.

### El problema real

La mayoría de personas en LATAM no tienen acceso a asesoramiento financiero real. Las apps existentes son complejas, en inglés, o no contemplan nuestra realidad: cooperativas, ingresos variables, informalidad, múltiples monedas.

**DebtOut democratiza ese acceso en menos de 2 minutos.**

---

## ✨ Funcionalidades

| Feature | Descripción |
|---|---|
| 🤖 **Plan con IA** | Claude analiza tu situación y genera un plan personalizado |
| ❄️ **Bola de Nieve** | Menor saldo primero — victorias rápidas para mantenerte motivado |
| 🌊 **Avalancha** | Mayor interés primero — pagás menos intereses en total |
| 🔗 **Consolidación** | Evalúa si conviene unificar tus deudas |
| 🔑 **PIN privado** | Plan guardado 30 días — recuperable con tu PIN de 6 dígitos |
| 📅 **Fecha de libertad** | Mes y año exacto en que estarás libre de deudas |
| 💰 **Intereses ahorrados** | Cuánto ahorrás vs pagar solo mínimos |
| 🌎 **Consejo LATAM** | Adaptado a cooperativas, informalidad, múltiples monedas |
| 🌐 **Bilingüe** | Español e Inglés |
| 📱 **Responsive** | Mobile y desktop |

---

## 🏗️ Arquitectura

```
CubePath VPS gp.nano
├── Nginx (puerto 80)
│   ├── /* → React SPA (Vite build)
│   └── /api/* → FastAPI (reverse proxy)
│
├── FastAPI + Python (puerto 8000)
│   ├── POST /api/plan/generate  → Claude API → SQLite → PIN
│   └── GET  /api/plan/{pin}    → SQLite → plan
│
└── SQLite (debtout.db)
    └── Planes con expiración de 30 días
```

**Decisión de seguridad clave:** La API key de Anthropic vive en el servidor (FastAPI), nunca en el frontend. Todos los proyectos que exponen la key en el browser son vulnerables — DebtOut no.

---

## 🛠️ Stack técnico

**Frontend**
- React 18 + Vite 5 + TypeScript
- Tailwind CSS (design system personalizado)
- Framer Motion (animaciones)
- Zustand (estado global)

**Backend**
- FastAPI (Python 3.11)
- SQLModel + SQLite
- httpx (llamadas async a Claude API)

**Infraestructura**
- CubePath VPS gp.nano
- Nginx como reverse proxy
- Systemd para el proceso FastAPI

---

## ☁️ Cómo usa CubePath

DebtOut está desplegado en un **VPS gp.nano de CubePath**:

- **Specs:** 1 vCPU, 2GB RAM, 40GB NVMe, 3TB transfer
- **DDoS Protection** incluida
- **Nginx** sirve el frontend estático y hace proxy al backend
- **Systemd** mantiene FastAPI corriendo como servicio
- **Deploy** en menos de 2 minutos con el script `deploy.sh`

CubePath permite hostear el frontend y el backend en un mismo servidor con costo mínimo y alta disponibilidad — ideal para LATAM.

---

## ⚡ Cómo ejecutar localmente

### Prerequisitos
- Node.js 18+
- Python 3.11+
- API key de Anthropic ([console.anthropic.com](https://console.anthropic.com))

### Backend
```bash
cd backend
cp .env.example .env
# Editar .env con tu ANTHROPIC_API_KEY

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Deploy en CubePath
```bash
# Configurar tu IP en deploy.sh
chmod +x deploy.sh
./deploy.sh TU_IP_CUBEPATH
```

---

## 📁 Estructura del proyecto

```
debtout/
├── frontend/          # React + Vite + TypeScript
│   └── src/
│       ├── components/screens/   # 7 pantallas
│       ├── components/ui/        # Componentes reutilizables
│       ├── hooks/                # Custom hooks
│       ├── lib/                  # API client, i18n, cálculos
│       ├── store/                # Estado global (Zustand)
│       └── types/                # TypeScript types
├── backend/           # FastAPI + SQLite
│   ├── main.py        # App + rutas
│   ├── claude_service.py  # Integración Claude API
│   ├── pin_service.py     # Generación de PINs únicos
│   └── models.py      # Schema SQLite
├── nginx.conf         # Config reverse proxy
├── deploy.sh          # Script de deploy automatizado
├── AGENTS.md          # Instrucciones para agentes de IA
└── PROMPT_DEBTOUT.md  # Prompt maestro de construcción
```

---

## 👨‍💻 Autor

**Nicolas (cacostama)** — [CNAM Services](https://github.com/cacostama)

Desarrollado para la **Hackathon CubePath 2026** organizada por [@midudev](https://github.com/midudev).

---

## 📄 Licencia

MIT — libre para usar, modificar y distribuir.