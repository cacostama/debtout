import json
import os
from typing import Any

import httpx
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-haiku-4-5")
MAX_TOKENS = int(os.getenv("MAX_TOKENS", "1500"))


class ClaudeServiceError(Exception):
    pass


async def generate_debt_plan(
    nombre: str,
    extra_mensual: float,
    moneda: str,
    estrategia: str,
    lang: str,
    deudas: list[dict[str, Any]],
) -> dict[str, Any]:
    if not ANTHROPIC_API_KEY:
        raise ClaudeServiceError("La integración con IA no está configurada todavía.")

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

    try:
        async with httpx.AsyncClient(timeout=25.0) as client:
            response = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "Content-Type": "application/json",
                    "x-api-key": ANTHROPIC_API_KEY,
                    "anthropic-version": "2023-06-01",
                },
                json={
                    "model": CLAUDE_MODEL,
                    "max_tokens": MAX_TOKENS,
                    "messages": [{"role": "user", "content": prompt}],
                },
            )
            response.raise_for_status()
    except httpx.TimeoutException as exc:
        raise ClaudeServiceError("La IA tardó demasiado. Probá de nuevo en unos segundos.") from exc
    except httpx.HTTPStatusError as exc:
        raise ClaudeServiceError("No pudimos generar tu plan ahora mismo. Intentá nuevamente.") from exc
    except httpx.HTTPError as exc:
        raise ClaudeServiceError("No hay conexión disponible para generar el plan.") from exc

    try:
        data = response.json()
        raw = data["content"][0]["text"].strip()
        clean = raw.replace("```json", "").replace("```", "").strip()
        result = json.loads(clean)
    except (KeyError, IndexError, json.JSONDecodeError) as exc:
        raise ClaudeServiceError("La respuesta de la IA llegó incompleta. Intentá nuevamente.") from exc

    return result
