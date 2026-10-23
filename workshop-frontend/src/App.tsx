import { useEffect, useState } from 'react'
import { criarRecado, excluirRecado, listarRecados } from './api'
import { RecadoForm } from './components/RecadoForm'
import { RecadoLista } from './components/RecadoLista'
import type { NovoRecado, Recado } from './types'

function App() {
  const [recados, setRecados] = useState<Recado[]>([])
  const [erro, setErro] = useState<string | null>(null)

  useEffect(() => {
    listarRecados()
      .then(setRecados)
      .catch((err: Error) => setErro(err.message))
  }, [])

  async function adicionar(novo: NovoRecado) {
    const criado = await criarRecado(novo)
    setRecados(anteriores => [criado, ...anteriores])
  }

  async function excluir(id: number) {
    try {
      await excluirRecado(id)
      setRecados(anteriores => anteriores.filter(r => r.id !== id))
    } catch (err) {
      setErro((err as Error).message)
    }
  }

  return (
    <main>
      <h1>Mural de Recados</h1>
      <RecadoForm onEnviar={adicionar} />
      {erro && <p className="erro">{erro}</p>}
      <RecadoLista recados={recados} onExcluir={excluir} />
    </main>
  )
}

export default App
