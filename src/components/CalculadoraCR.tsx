import { useState } from 'react'
import { Disciplina, HistoricoItem } from '../types'

interface Props {
  disciplinas: Disciplina[]
  onAdd: (d: Disciplina, h: HistoricoItem) => void
  onDelete: (id: string) => void
  onEdit: (id: string, nota: number, ch: number) => void
}

function calcCR(disciplinas: Disciplina[]) {
  if (!disciplinas.length) return null
  const soma = disciplinas.reduce((a, d) => a + d.nota * d.ch, 0)
  const tot = disciplinas.reduce((a, d) => a + d.ch, 0)
  return { cr: soma / tot, soma, tot }
}

export default function CalculadoraCR({ disciplinas, onAdd, onDelete, onEdit }: Props) {
  const [nome, setNome] = useState('')
  const [nota, setNota] = useState('')
  const [ch, setCh] = useState('')

  function handleAdd() {
    const n = parseFloat(nota.replace(',', '.'))
    const c = parseInt(ch)
    if (!nome.trim()) return alert('Informe o nome da disciplina.')
    if (isNaN(n) || n < 1 || n > 10) return alert('Nota inválida (1,0 a 10,0).')
    if (!c || c < 1) return alert('Carga horária inválida.')
    const id = Date.now().toString()
    const d: Disciplina = { id, nome: nome.trim(), nota: n, ch: c, createdAt: Date.now() }
    const h: HistoricoItem = { id, nome: d.nome, nota: n, ch: c, tipo: 'cr', ts: Date.now() }
    onAdd(d, h)
    setNome(''); setNota(''); setCh('')
  }

  function handleEdit(d: Disciplina) {
    const n = prompt(`Nova nota para "${d.nome}" (1,0 a 10,0):`, d.nota.toFixed(2).replace('.', ','))
    if (n === null) return
    const nota = parseFloat(n.replace(',', '.'))
    if (isNaN(nota) || nota < 1 || nota > 10) return alert('Nota inválida.')
    const c = prompt('Nova carga horária:', d.ch.toString())
    if (c === null) return
    onEdit(d.id, nota, parseInt(c) || d.ch)
  }

  const r = calcCR(disciplinas)

  return (
    <div>
      <div className="card">
        <div className="card-title">➕ Adicionar disciplina</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="field-label">Nome da disciplina</label>
            <input className="field-input" type="text" placeholder="Ex: Algoritmos"
              value={nome} onChange={(e) => setNome(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
          </div>
          <div>
            <label className="field-label">Nota final (1,0–10,0)</label>
            <input className="field-input" type="number" min={1} max={10} step={0.1}
              placeholder="Ex: 8,5" value={nota}
              onChange={(e) => setNota(e.target.value)} />
          </div>
          <div>
            <label className="field-label">Carga horária (h)</label>
            <input className="field-input" type="number" min={1} step={1}
              placeholder="60" value={ch}
              onChange={(e) => setCh(e.target.value)} />
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>➕ Adicionar disciplina</button>
      </div>

      <div className="card">
        <div className="card-title">📊 Resultado do CR</div>

        {disciplinas.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-sm">Nenhuma disciplina adicionada.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto mb-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="th">Disciplina</th>
                    <th className="th text-center">Nota</th>
                    <th className="th text-center">CH</th>
                    <th className="th text-center">Nota × CH</th>
                    <th className="th"></th>
                  </tr>
                </thead>
                <tbody>
                  {disciplinas.map((d) => (
                    <tr key={d.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="td font-medium">{d.nome}</td>
                      <td className="td text-center">{d.nota.toFixed(2).replace('.', ',')}</td>
                      <td className="td text-center">{d.ch}h</td>
                      <td className="td text-center text-blue-600 dark:text-blue-400 font-medium">
                        {(d.nota * d.ch).toFixed(2)}
                      </td>
                      <td className="td text-right">
                        <div className="flex gap-1 justify-end">
                          <button className="btn btn-sm" onClick={() => handleEdit(d)}>✏️</button>
                          <button className="btn btn-sm btn-danger" onClick={() => {
                            if (confirm('Remover esta disciplina?')) onDelete(d.id)
                          }}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {r && (
              <div className="bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-600 rounded-lg p-4">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wide">
                  Detalhamento do cálculo
                </p>
                <code className="block text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded p-3 text-slate-700 dark:text-slate-300 break-all">
                  CR = [{disciplinas.map((d) => `(${d.nota.toFixed(1).replace('.', ',')}×${d.ch})`).join(' + ')}] ÷ {r.tot}
                  {'\n'}CR = {r.soma.toFixed(2)} ÷ {r.tot} = <strong>{r.cr.toFixed(2).replace('.', ',')}</strong>
                </code>
                <div className="text-center mt-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Coeficiente de Rendimento atual</p>
                  <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                    {r.cr.toFixed(2).replace('.', ',')}
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
