import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './index.css'

export default function App() {
  const [abaAtiva, setAbaAtiva] = useState("Meu armário")
  // 12 slots: cada item guarda { url, name } ou null
  const [slots, setSlots] = useState(Array(12).fill(null))

  // limpeza de ObjectURL ao desmontar
  useEffect(() => {
    return () => {
      slots.forEach(s => s?.url && URL.revokeObjectURL(s.url))
    }
  }, [slots])

  const handleFiles = (files, idx) => {
    if (!files || !files[0]) return
    const file = files[0]
    if (!file.type.startsWith('image/')) return
    if (file.size > 5 * 1024 * 1024) { // 5MB
      alert('Imagem muito grande (máx 5MB).')
      return
    }
    const url = URL.createObjectURL(file)
    setSlots(prev => {
      // revoke antiga se existir
      if (prev[idx]?.url) URL.revokeObjectURL(prev[idx].url)
      const next = [...prev]
      next[idx] = { url, name: file.name }
      return next
    })
  }

  const onDrop = (e, idx) => {
    e.preventDefault()
    handleFiles(e.dataTransfer.files, idx)
  }

  const onRemove = (idx) => {
    setSlots(prev => {
      const next = [...prev]
      if (next[idx]?.url) URL.revokeObjectURL(next[idx].url)
      next[idx] = null
      return next
    })
  }

  return (
    <div className="page">
      {/* Esquerda */}
      <section className="stage">
        <ul className="side-thumbs"><li/><li/><li/></ul>
      </section>

      <div className="divider" aria-hidden="true" />

      {/* Direita */}
      <aside className="panel">
        <header className="panel-top">
          <h1>Today's Fashion</h1>
          <div className="scroller">
            <button
              className={`pill ${abaAtiva==="Meu armário"?"active":""}`}
              onClick={()=>setAbaAtiva("Meu armário")}
            >
              Meu armário
            </button>
            <button
              className={`pill ${abaAtiva==="Como posso me vestir hoje?"?"active":""}`}
              onClick={()=>setAbaAtiva("Como posso me vestir hoje?")}
            >
              Como posso me vestir hoje?
            </button>
            <button
              className={`pill ${abaAtiva==="O que combina comigo?"?"active":""}`}
              onClick={()=>setAbaAtiva("O que combina comigo?")}
            >
              O que combina comigo?
            </button>
            <button
              className={`pill ${abaAtiva==="Qual seria o melhor caimento?"?"active":""}`}
              onClick={()=>setAbaAtiva("Qual seria o melhor caimento?")}
            >
              Qual seria o melhor caimento?
            </button>
            <span className="arrow">›</span>
          </div>
        </header>

        {/* Slots de upload só na aba Meu armário */}
        {abaAtiva === "Meu armário" && (
          <div className="grid">
            {Array.from({ length: 12 }).map((_, i) => {
              const filled = !!slots[i];
              const canShow = i === 0 || !!slots[i - 1]; // 1º sempre aparece; demais só se o anterior estiver preenchido

              // Só renderiza o slot se já estiver preenchido OU se for o próximo liberado
              if (!filled && !canShow) return null;

              return (
                <label
                  key={i} 
                  className={`card dropzone ${filled ? 'has-image' : ''}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDrop(e, i)}
                  style={filled ? { backgroundImage: `url(${slots[i].url})` } : {}}
                  title={filled ? (slots[i].name || 'Imagem enviada') : 'Clique ou arraste uma imagem'}
                >
                  {!filled && (
                    <div className="card-hint">
                      <span>+</span>
                      <small>Adicionar foto</small>
                    </div>
                  )}

                  {/* Só permite escolher arquivo se não estiver preenchido */}
                  {!filled && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFiles(e.target.files, i)}
                      aria-label={`Upload slot ${i + 1}`}
                    />
                  )}

                  {filled && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={(e) => {
                        e.preventDefault();
                        onRemove(i);
                      }}
                    >
                      X
                    </button>
                  )}
                </label>
              );
            })}
          </div>
        )}

        {/* Overlay de fade no rodapé da direita */}
        <div className="panel-fade" aria-hidden="true" />
      </aside>
    </div>
  )
}
