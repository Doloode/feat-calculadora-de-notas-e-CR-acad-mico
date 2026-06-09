# 🎓 Calculadora de Notas e CR Acadêmico

Aplicação web responsiva para estudantes universitários calcularem sua **média final por disciplina** e seu **Coeficiente de Rendimento (CR)**.

## ✨ Funcionalidades

- **Calculadora de Média** — insira as notas da AV1, AV2 e AV3 (opcional) com pesos configuráveis e veja a situação do aluno (Aprovado / Recuperação / Reprovado)
- **Calculadora de CR** — adicione disciplinas com nota e carga horária; o CR ponderado é calculado automaticamente com detalhamento completo da fórmula
- **Dashboard** — visão geral com estatísticas e gráfico de desempenho por disciplina
- **Histórico** — cálculos salvos no LocalStorage, com opção de exclusão
- **Tema claro / escuro**
- **Exportar CSV** (compatível com Excel) e **PDF** via impressão
- **Responsivo** para celular, tablet e desktop

## 🧮 Fórmula do CR

```
CR = Σ(Nota Final × Carga Horária) ÷ Σ(Carga Horária)
```

**Exemplo:**
- Algoritmos: 8,5 × 60h = 510
- Banco de Dados: 9,0 × 80h = 720
- Redes: 7,5 × 60h = 450

```
CR = (510 + 720 + 450) ÷ (60 + 80 + 60) = 1680 ÷ 200 = 8,40
```

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** (bundler)
- **Tailwind CSS** (estilização)
- **Recharts** (gráficos)
- **LocalStorage** (persistência de dados)

## 🚀 Como rodar localmente

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/calculadora-academica.git
cd calculadora-academica

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no navegador.

## 📦 Build para produção

```bash
npm run build
npm run preview
```

## 📁 Estrutura do projeto

```
src/
├── components/
│   ├── Dashboard.tsx        # Estatísticas e gráfico
│   ├── CalculadoraMedia.tsx # Calculadora de média por disciplina
│   ├── CalculadoraCR.tsx    # Calculadora de CR
│   └── Historico.tsx        # Histórico de cálculos
├── hooks/
│   ├── useLocalStorage.ts   # Hook para persistência
│   └── useTheme.ts          # Hook para tema claro/escuro
├── types/
│   └── index.ts             # Tipos TypeScript
├── App.tsx                  # Shell principal
├── main.tsx                 # Entry point
└── index.css                # Estilos Tailwind
```

## 📄 Licença

MIT
