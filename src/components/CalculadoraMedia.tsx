import { useState } from 'react'
import { ConfigAprovacao, Disciplina, HistoricoItem, PesosAV, Situacao } from '../types'

interface Props {
  config: ConfigAprovacao
  setConfig: (c: ConfigAprovacao) => void
  onSalvar: (d: Disciplina, h: HistoricoItem) => void
}

function clamp(v: number) {
  return Math.min(10, Math.max(1, v))
}

function getSituacao(nota: number, config: ConfigAprovacao): Situacao {
  if (nota >= config.minAprovado) return 'Aprovado'
  if (nota >= config.minRecuperacao) return 'Recuperação'
  return 'Reprovado'
}

function situacaoCls(s: Situacao) {
  if (s === 'Aprovado') return 'badge-green'
  if (s === 'Recuperação') return 'badge-yellow'
  return 'badge-red'
}

export default function CalculadoraMedia({ config, setConfig, onSalvar }: Props) {
  const [nome, setNome] = useState('')
  const [av1, setAv1] = useState('')
  const [av2, setAv2] = useState('')
  const [av3, setAv3] = useState('')
  const [useAv3, setUseAv3] = useState(false)
  const [pesos, setPesos] = useState<PesosAV>({ p1: 50, p2: 50, p3: 0 })

  const p1 = pesos.p1
  const p2 = pesos.p2
  const p3 = useAv3 ? pesos.p3 : 0
  const totalPeso = p1 + p2 + p3

  const v1 = av1 !== '' ? clamp(parseFloat(av1.replace(',', '.'))) : null
  const v2 = av2 !== '' ? clamp(parseFloat(av2.replace(',', '.'))) : null
  const v3 = useAv3 && av3 !== '' ? clamp(parseFloat(av3.replace(',', '.'))) : null

  const hasData = v1 !== null || v2 !== null

  const calcParcial = () => {
    const vals = [v1 ?? 0, v2 ?? 0, ...(useAv3 && v3 !== null ? [v3] : [])]
    return vals.reduce((a, b) => a + b, 0) / (useAv3 ? 3 : 2)
  }

  const calcFinal = () => {
    const tot = useAv3 ? p1 + p2 + p3 : p1 + p2
    if (tot === 0) return 0
    return useAv3
      ? ((v1 ?? 0) * p1 + (v2 ?? 0) * p2 + (v3 ?? 0) * p3) / tot
      : ((v1 ?? 0) * p1 + (v2 ?? 0) * p2) / tot
  }

  const parcial = hasData ? calcParcial() : null
  const final = hasData ? calcFinal() : null
  const situacao: Situacao | null = final !== null ? getSituacao(final, config) : null

  function toggleAv3(on: boolean) {
    setUseAv3(on)
    if (on) {
      setPesos({ p1: 40, p2: 40, p3: 20 })
      setAv3('')
    } else {
      setPesos({ p1: 50, p2: 50, p3: 0 })
      setAv3('')
    }
  }

  function handleSalvar() {
    if (final === null || situacao === null) return
    const ch = prompt('Informe a carga horária desta disciplina (horas):', '60')
    if (!ch) return
    const id = Date.now().toString()
    const d: Disciplina = { id, nome: nome || 'Disciplina', nota: final, ch: parseInt(ch) || 60, createdAt: Date.now() }
    const h: HistoricoItem = { id, nome: d.nome, nota: final, ch: d.ch, tipo: 'media', situacao, ts: Date.now() }
    onSalvar(d, h)
  }

  function limpar() {
    setNome(''); setAv1(''); setAv2(''); setAv3('')
  }

  return (
    <div>
      {/* Config */}
      <div className="card">
        <div className="card-title">⚙️ Configurações de aprovação</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="field-label">Nota mínima — Aprovado</label>
            <input className="field-input" type="number" min={0} max={10} step={0.1}
              value={config.minAprovado}
              onChange={(e) => setConfig({ ...config, minAprovado: parseFloat(e.target.value) || 7 })} />
          </div>
          <div>
            <label className="field-label">Nota mínima — Recuperação</label>
            <input className="field-input" type="number" min={0} max={10} step={0.1}
              value={config.minRecuperacao}
              onChange={(e) => setConfig({ ...config, minRecuperacao: parseFloat(e.target.value) || 5 })} />
          </div>
        </div>
      </div>

      {/* Calculadora */}
      <div className="card">
        <div className="card-title">📐 Calculadora de Média da Disciplina</div>

        <div className="mb-4">
          <label className="field-label">Nome da disciplina (opcional)</label>
          <input className="field-input" type="text" placeholder="Ex: Cálculo I"
            value={nome} onChange={(e) => setNome(e.target.value)} />
        </div>

        <hr className="border-slate-200 dark:border-slate-700 mb-4" />

        {/* Pesos */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Peso de cada avaliação (%)
            </span>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={useAv3} onChange={(e) => toggleAv3(e.target.checked)} />
                <div className={`w-9 h-5 rounded-full transition ${useAv3 ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${useAv3 ? 'translate-x-4' : ''}`} />
                </div>
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Usar AV3</span>
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { label: 'Peso AV1', key: 'p1' as const },
              { label: 'Peso AV2', key: 'p2' as const },
              { label: 'Peso AV3', key: 'p3' as const },
            ].map(({ label, key }) => (
              <div key={key} className={`peso-card ${!useAv3 && key === 'p3' ? 'opacity-40 pointer-events-none' : ''}`}>
                <label className="field-label">{label}</label>
                <input className="nota-input" type="number" min={0} max={100} step={1}
                  value={pesos[key]}
                  onChange={(e) => {
                    setPesos({ ...pesos, [key]: parseInt(e.target.value) || 0 })
                  }} />
              </div>
            ))}
          </div>

          <div className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm
            ${totalPeso === 100
              ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800'
              : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}>
            <span className="text-slate-600 dark:text-slate-300">Soma dos pesos</span>
            <span className={`font-bold text-sm ${totalPeso === 100 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {totalPeso}%
            </span>
          </div>
        </div>

        <hr className="border-slate-200 dark:border-slate-700 mb-4" />

        {/* Notas */}
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide block mb-3">
            Notas (1,0 a 10,0)
          </span>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Nota AV1', val: av1, setter: setAv1, disabled: false, ph: 'Ex: 7,5' },
              { label: 'Nota AV2', val: av2, setter: setAv2, disabled: false, ph: 'Ex: 8,3' },
              { label: 'Nota AV3', val: av3, setter: setAv3, disabled: !useAv3, ph: 'Ex: 6,0' },
            ].map(({ label, val, setter, disabled, ph }) => (
              <div key={label} className={`nota-card ${disabled ? 'opacity-40 pointer-events-none' : ''}`}>
                <label className="field-label">{label}</label>
                <input className="nota-input" type="number" min={1} max={10} step={0.1}
                  placeholder={ph} disabled={disabled}
                  value={val}
                  onChange={(e) => setter(e.target.value)} />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>mín 1,0</span><span>máx 10,0</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resultado */}
        {hasData && final !== null && situacao !== null && (
          <div className="result-box">
            <div className="result-row">
              <span className="text-sm text-slate-600 dark:text-slate-300">Média parcial (sem ponderação)</span>
              <span className="font-medium">{parcial!.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="result-row">
              <span className="text-sm text-slate-600 dark:text-slate-300">Média final (ponderada)</span>
              <span className="font-medium">{final.toFixed(2).replace('.', ',')}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="font-semibold">Situação</span>
              <span className={`badge ${situacaoCls(situacao)}`}>{situacao}</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 flex-wrap mt-4">
          <button className="btn btn-primary" onClick={handleSalvar} disabled={!hasData}>
            ➕ Salvar no CR
          </button>
          <button className="btn" onClick={limpar}>🔄 Limpar campos</button>
        </div>
      </div>
    </div>
  )
}
