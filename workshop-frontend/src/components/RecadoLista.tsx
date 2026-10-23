import type { Recado } from '../types'

type Props = {
  recados: Recado[]
  onExcluir: (id: number) => void
}

export function RecadoLista({ recados, onExcluir }: Props) {
  if (recados.length === 0) {
    return <p className="vazio">Nenhum recado ainda. Seja o primeiro!</p>
  }

  return (
    <ul className="recado-lista">
      {recados.map(r => (
        <li key={r.id} className="recado">
          <div className="recado-cabecalho">
            <strong>{r.autor}</strong>
            <time dateTime={r.criadoEm}>
              {new Date(r.criadoEm).toLocaleString('pt-BR')}
            </time>
          </div>
          <p>{r.texto}</p>
          <button className="excluir" onClick={() => onExcluir(r.id)}>
            Excluir
          </button>
        </li>
      ))}
    </ul>
  )
}
