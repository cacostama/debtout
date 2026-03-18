# DebtOut 💸

> **ES:** Tu plan inteligente para salir de deudas
> **EN:** Your smart plan to become debt-free

[![Hackathon](https://img.shields.io/badge/Hackathon-CubePath%202026-00C853?style=for-the-badge&logo=cloud&logoColor=white)](https://github.com/midudev/hackaton-cubepath-2026)
[![Deploy](https://img.shields.io/badge/Deploy-CubePath-0088FF?style=for-the-badge&logo=cloud&logoColor=white)](http://TU_IP_CUBEPATH)
[![IA](https://img.shields.io/badge/AI-Claude%20API-CC785C?style=for-the-badge&logo=anthropic&logoColor=white)](https://anthropic.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🔗 Demo en vivo

👉 **[Ver demo](http://TU_IP_CUBEPATH)** — Desplegado en CubePath

---

## 📸 Capturas

> *Screenshots y GIFs próximamente...*

---

## ¿Qué es DebtOut?

DebtOut es una web app que actúa como **coach financiero personal con IA**. El usuario ingresa sus deudas, elige una estrategia de pago, y Claude genera un plan personalizado adaptado a la realidad latinoamericana.

**Sin registro. Sin datos guardados. Gratis.**

### El problema que resuelve

La mayoría de personas en LATAM no tienen acceso fácil a asesoramiento financiero real. Las apps existentes son complejas, en inglés, o no contemplan la realidad local: cooperativas, ingresos variables, informalidad, múltiples monedas.

DebtOut democratiza ese acceso en menos de 2 minutos.

---

## ✨ Funcionalidades

- 📊 **4 estrategias de pago:** Bola de Nieve, Alud/Avalancha, Consolidación y Plan IA
- 🤖 **Plan personalizado con Claude AI** — analiza tu situación y combina estrategias
- 📅 **Fecha estimada de libertad financiera** — mes y año exacto
- 💰 **Cálculo de intereses ahorrados** vs pagar solo mínimos
- 🌎 **Consejo adaptado a LATAM** — cooperativas, dólares, informalidad
- 🌐 **Bilingüe** — Español e Inglés
- 📋 **Plan copiable** — para compartir o guardar
- 📱 **Responsive** — funciona en mobile y desktop

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|---|---|
| Frontend | HTML5 + CSS3 + JavaScript vanilla |
| IA | Anthropic Claude API (`claude-haiku-4-5`) |
| Hosting | CubePath VPS (plan gp.nano) |
| Fonts | Google Fonts — Syne + DM Mono |
| Build | Sin build tools — archivo único `index.html` |

---

## ☁️ Cómo usa CubePath

El proyecto está desplegado en un **VPS gp.nano de CubePath** con:
- 1 vCPU, 2GB RAM, 40GB NVMe
- DDoS Protection incluida
- Nginx como servidor web estático
- Deploy en menos de 30 segundos via `scp`

CubePath permite hostear la app con costos mínimos y alta disponibilidad, ideal para demos y producción en LATAM.

---

## ⚡ Cómo ejecutar localmente

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/debtout.git
cd debtout

# Agregar tu API key de Anthropic en index.html
# Buscar: TU_API_KEY_AQUI
# Reemplazar con tu key real

# Levantar servidor local
python3 -m http.server 3000

# Abrir en el browser
# http://localhost:3000
```

> **Nota:** Necesitás una API key de Anthropic. Podés obtenerla en [console.anthropic.com](https://console.anthropic.com)

---

## 📁 Estructura del proyecto

```
debtout/
├── index.html          # App completa (HTML + CSS + JS en un solo archivo)
├── README.md           # Este archivo
├── AGENTS.md           # Instrucciones para agentes de IA
└── PROMPT_DEBTOUT.md   # Prompt maestro de construcción
```

---

## 👨‍💻 Autor

**Nicolas** — [CNAM Services](https://github.com/TU_USUARIO)

Proyecto desarrollado para la **Hackathon CubePath 2026** organizada por [@midudev](https://github.com/midudev).

---

## 📄 Licencia

MIT — libre para usar, modificar y distribuir.
