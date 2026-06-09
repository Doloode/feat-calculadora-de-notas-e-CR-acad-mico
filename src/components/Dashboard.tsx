import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Disciplina, ConfigAprovacao } from '../types'

interface Props {
  disciplinas: Disciplina[]
  config: ConfigAprovacao
}

function getSituacao(nota: number, config: ConfigAprovacao) {
  if (nota >= config.minAprovado) return { label: 'Aprovado', cls: 'badge-green' }
  if (nota >= config.minRecuperacao) return { label: 'Recuperação', cls: 'badge-yellow' }
  return { label: 'Reprovado', cls: 'badge-red' }
}

function calcCR(disciplinas: Disciplina[]) {
  if (!disciplinas.length) return null
  const soma = disciplinas.reduce((a, d) => a + d.nota * d.ch, 0)
  const tot = disciplinas.reduce((a, d) => a + d.ch, 0)
  return (soma / tot).toFixed(2).replace('.', ',')
}

export default function Dashboard({ disciplinas, config }: Props) {
  const notas = disciplinas.map((d) => d.nota)
  const cr = calcCR(disciplinas)

  const stats = [
    { v: disciplinas.length, l: 'Disciplinas' },
    { v: notas.length ? Math.max(...notas).toFixed(2).replace('.', ',') : '—', l: 'Maior nota' },
    { v: notas.length ? Math.min(...notas).toFixed(2).replace('.', ',') : '—', l: 'Menor nota' },
    { v: cr ?? '—', l: 'CR atual' },
  ]

  const chartData = disciplinas.map((d) => ({
    nome: d.nome.length > 12 ? d.nome.slice(0, 12) + '…' : d.nome,
    nota: d.nota,
  }))

  const barColor = (nota: number) => {
    if (nota >= config.minAprovado) return '#22c55e'
    if (nota >= config.minRecuperacao) return '#eab308'
    return '#ef4444'
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {stats.map((s) => (
          <div key={s.l} className="stat-card">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 leading-tight">{s.v}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.l}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-title">📈 Desempenho por disciplina</div>
        {disciplinas.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <div className="text-3xl mb-2">📊</div>
            <p className="text-sm">Adicione disciplinas para ver o gráfico.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="nome" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 10]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => [v.toFixed(2).replace('.', ','), 'Nota']} />
              <Bar dataKey="nota" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={barColor(entry.nota)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="card">
        <div className="card-title">📋 Disciplinas cadastradas</div>
        {disciplinas.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-sm">Nenhuma disciplina cadastrada ainda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="th">Disciplina</th>
                  <th className="th text-center">Nota</th>
                  <th className="th text-center">CH</th>
                  <th className="th text-center">Situação</th>
                </tr>
              </thead>
              <tbody>
                {disciplinas.map((d) => {
                  const sit = getSituacao(d.nota, config)
                  return (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="td">{d.nome}</td>
                      <td className="td text-center font-medium">{d.nota.toFixed(2).replace('.', ',')}</td>
                      <td className="td text-center">{d.ch}h</td>
                      <td className="td text-center">
                        <span className={`badge ${sit.cls}`}>{sit.label}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
