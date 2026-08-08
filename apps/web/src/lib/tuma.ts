import crypto from 'crypto'

/**
 * Tuma (www.tuma.co.ke) STK Push integration — scaffolded, not live.
 *
 * Real signatures matching CLAUDE.md's spec are wired up so the rest of the
 * system (Payments collection, activation hook, webhook route, admin manual
 * reconciliation) is fully testable today via `provider: manual` payments.
 * The actual HTTP calls are gated behind TUMA_API_KEY/TUMA_API_EMAIL and
 * throw a clear error until those are set and the exact endpoint paths/
 * payload shapes below are confirmed against Tuma's real API docs.
 */

const TUMA_BASE_URL = process.env.TUMA_BASE_URL || 'https://api.tuma.co.ke'

function assertConfigured() {
  if (!process.env.TUMA_API_KEY || !process.env.TUMA_API_EMAIL) {
    throw new Error(
      'Tuma integration not yet configured — set TUMA_API_KEY and TUMA_API_EMAIL to enable live STK Push.',
    )
  }
}

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAuthToken(): Promise<string> {
  assertConfigured()

  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token
  }

  const res = await fetch(`${TUMA_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.TUMA_API_EMAIL,
      api_key: process.env.TUMA_API_KEY,
    }),
  })

  if (!res.ok) {
    throw new Error(`Tuma auth failed: ${res.status} ${await res.text()}`)
  }

  const data = (await res.json()) as { token: string; expires_in?: number }
  cachedToken = {
    token: data.token,
    expiresAt: Date.now() + (data.expires_in ? data.expires_in * 1000 : 5 * 60 * 1000),
  }
  return data.token
}

export async function createSTKPush(params: {
  amount: number
  phone: string
  description: string
  callbackUrl: string
}): Promise<{ paymentId: string }> {
  const token = await getAuthToken()

  const res = await fetch(`${TUMA_BASE_URL}/payment/stk-push`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      amount: params.amount,
      phone: params.phone,
      description: params.description,
      callback_url: params.callbackUrl,
    }),
  })

  if (!res.ok) {
    throw new Error(`Tuma STK push failed: ${res.status} ${await res.text()}`)
  }

  const data = (await res.json()) as { payment_id: string }
  return { paymentId: data.payment_id }
}

/**
 * Placeholder HMAC-SHA256 signature check against TUMA_WEBHOOK_SECRET.
 * Confirm the actual signing scheme (header name, algorithm) against Tuma's
 * webhook docs before relying on this — it is not verified against a real
 * callback payload yet.
 */
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.TUMA_WEBHOOK_SECRET
  if (!secret || !signature) return false

  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  } catch {
    return false
  }
}
