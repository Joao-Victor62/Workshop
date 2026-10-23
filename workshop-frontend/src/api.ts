import type { NovoRecado, Recado } from './types'

const BASE = '/api/recados'

type ErroApi = {
  message?: string
  errors?: { defaultMessage: string }[]
}

async function verificar(res: Response): Promise<Response> {
  if (res.ok) return res
  const erro: ErroApi = await res.json().catch(() => ({}))
  const mensagem = erro.errors?.map(e => e.defaultMessage).join(' · ') ?? erro.message
  throw new Error(mensagem || `Erro ${res.status}`)
}

export async function listarRecados(): Promise<Recado[]> {
  const res = await verificar(await fetch(BASE))
  return res.json()
}

export async function criarRecado(novo: NovoRecado): Promise<Recado> {
  const res = await verificar(
    await fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novo),
    }),
  )
  return res.json()
}

export async function excluirRecado(id: number): Promise<void> {
  await verificar(await fetch(`${BASE}/${id}`, { method: 'DELETE' }))
}
