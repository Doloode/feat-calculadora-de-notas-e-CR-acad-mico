import { HistoricoItem } from '../types'

interface Props {
  historico: HistoricoItem[]
  onDelete: (id: string) => void
}

export default function Historico({ historico, onDelete }: Props) {
  if (!historico.length) {
    return (
      <div className="card">
        <div className="card-title">📋 Histórico de cálculos</div>
        <div className="text-center py-10 text-slate-400">
          <div className="text-3xl mb-2">📋</div>
          <p className="text-sm">Nenhum cálculo salvo ainda.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-title">📋 Histórico de cálculos</div>
      <div className="space-y-2">
        {historico.map((h) => (
          <div key={h.id}
            className="border border-slate-200 dark:border-slate-600 rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition">
            <div className="flex justify-between items-start gap-2">
              <div>
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{h.nome}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {new Date(h.ts).toLocaleString('pt-BR')} ·{' '}
                  {h.tipo === 'media' ? 'Calculadora de Média' : 'Calculadora de CR'}
                </p>
              </div>
              <button className="btn btn-sm btn-danger flex-shrink-0" onClick={() => onDelete(h.id)}>🗑</button>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <span className="text-[10px] text-slate-400 block">Nota</span>
                <span className="text-sm font-semibold">{h.nota.toFixed(2).replace('.', ',')}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Carga Horária</span>
                <span className="text-sm font-semibold">{h.ch}h</span>
              </div>
              {h.situacao && (
                <div>
                  <span className="text-[10px] text-slate-400 block">Situação</span>
                  <span className={`badge text-xs ${
                    h.situacao === 'Aprovado' ? 'badge-green'
                    : h.situacao === 'Recuperação' ? 'badge-yellow'
                    : 'badge-red'
                  }`}>{h.situacao}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
