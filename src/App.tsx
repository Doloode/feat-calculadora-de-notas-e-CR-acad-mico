import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTheme } from './hooks/useTheme'
import { Disciplina, HistoricoItem, ConfigAprovacao, TabId } from './types'
import Dashboard from './components/Dashboard'
import CalculadoraMedia from './components/CalculadoraMedia'
import CalculadoraCR from './components/CalculadoraCR'
import Historico from './components/Historico'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'media', label: 'Média', icon: '📐' },
  { id: 'cr', label: 'CR', icon: '🏆' },
  { id: 'historico', label: 'Histórico', icon: '📋' },
]

export default function App() {
  const { dark, toggleTheme } = useTheme()
  const [tab, setTab] = useState<TabId>('dashboard')
  const [disciplinas, setDisciplinas] = useLocalStorage<Disciplina[]>('discs', [])
  const [historico, setHistorico] = useLocalStorage<HistoricoItem[]>('hist', [])
  const [config, setConfig] = useLocalStorage<ConfigAprovacao>('config', {
    minAprovado: 7,
    minRecuperacao: 5,
  })

  function addDisciplina(d: Disciplina, h: HistoricoItem) {
    setDisciplinas((prev) => [...prev, d])
    setHistorico((prev) => [h, ...prev].slice(0, 50))
    alert(`Disciplina "${d.nome}" adicionada ao CR!`)
  }

  function deleteDisciplina(id: string) {
    setDisciplinas((prev) => prev.filter((d) => d.id !== id))
  }

  function editDisciplina(id: string, nota: number, ch: number) {
    setDisciplinas((prev) => prev.map((d) => (d.id === id ? { ...d, nota, ch } : d)))
  }

  function deleteHistorico(id: string) {
    setHistorico((prev) => prev.filter((h) => h.id !== id))
  }

  function clearAll() {
    if (!confirm('Apagar todos os dados? Esta ação não pode ser desfeita.')) return
    setDisciplinas([])
    setHistorico([])
  }

  function exportCSV() {
    if (!disciplinas.length) return alert('Nenhuma disciplina para exportar.')
    const soma = disciplinas.reduce((a, d) => a + d.nota * d.ch, 0)
    const tot = disciplinas.reduce((a, d) => a + d.ch, 0)
    const cr = (soma / tot).toFixed(2)
    let csv = 'Disciplina,Nota,Carga Horária,Nota×CH\n'
    csv += disciplinas.map((d) => `"${d.nome}",${d.nota.toFixed(2)},${d.ch},${(d.nota * d.ch).toFixed(2)}`).join('\n')
    csv += `\n\nCR GERAL,${cr}`
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'cr_academico.csv'
    a.click()
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 py-4">

        {/* Header */}
        <header className="flex items-center justify-between mb-5 flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white text-xl flex-shrink-0">
              🎓
            </div>
            <div>
              <h1 className="text-base font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                Calculadora Acadêmica
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Notas e Coeficiente de Rendimento</p>
            </div>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <button className="btn btn-sm" onClick={() => window.print()}>
              <span>📄</span><span className="hidden sm:inline">PDF</span>
            </button>
            <button className="btn btn-sm" onClick={exportCSV}>
              <span>📊</span><span className="hidden sm:inline">Excel</span>
            </button>
            <button className="btn btn-sm btn-danger" onClick={clearAll}>
              <span>🗑</span><span className="hidden sm:inline">Limpar</span>
            </button>
            <button className="btn btn-sm" onClick={toggleTheme} aria-label="Alternar tema">
              {dark ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* Nav */}
        <nav className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl mb-5 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`nav-tab ${tab === t.id ? 'nav-tab-active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              <span className="mr-1">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        {tab === 'dashboard' && (
          <Dashboard disciplinas={disciplinas} config={config} />
        )}
        {tab === 'media' && (
          <CalculadoraMedia
            config={config}
            setConfig={setConfig}
            onSalvar={addDisciplina}
          />
        )}
        {tab === 'cr' && (
          <CalculadoraCR
            disciplinas={disciplinas}
            onAdd={addDisciplina}
            onDelete={deleteDisciplina}
            onEdit={editDisciplina}
          />
        )}
        {tab === 'historico' && (
          <Historico historico={historico} onDelete={deleteHistorico} />
        )}
      </div>
    </div>
  )
}
