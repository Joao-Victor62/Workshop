import { useState, type SubmitEvent } from 'react'
import type { NovoRecado } from '../types'

type Props = {
  onEnviar: (novo: NovoRecado) => Promise<void>
}

export function RecadoForm({ onEnviar }: Props) {
  const [autor, setAutor] = useState('')
  const [texto, setTexto] = useState('')
  const [erro, setErro] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)
    try {
      await onEnviar({ autor, texto })
      setTexto('')
    } catch (err) {
      setErro((err as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="recado-form" onSubmit={enviar}>
      <input
        placeholder="Seu nome"
        value={autor}
        onChange={e => setAutor(e.target.value)}
      />
      <textarea
        placeholder="Escreva um recado..."
        rows={3}
        value={texto}
        onChange={e => setTexto(e.target.value)}
      />
      <button disabled={enviando}>{enviando ? 'Enviando...' : 'Enviar'}</button>
      {erro && <p className="erro">{erro}</p>}
    </form>
  )
}
