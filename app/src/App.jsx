import { useState } from 'react'
import Gauge from './components/Gauge'
import Logo from './components/Logo'
import './App.css'

// Les deux hemicycles proposes ; chacun garde sa propre position de curseur.
const HEMICYCLES = [
  {
    id: 'debat',
    menu: 'Débat démocratique',
    titre: 'Efficacité du débat démocratique',
    poleHaut: 'Débat démocratique',
    poleBas: 'Efficacité',
    valeurInitiale: 62,
    note:
      "Indicateur synthétique calculé à partir des données ouvertes de l'Assemblée (comptes " +
      'rendus de séance, votes, amendements). Déplacez le curseur pour situer un texte entre ' +
      "efficacité de la procédure (bas) et intensité du débat en hémicycle (haut), et " +
      "interroger ce que l'on souhaite mesurer, automatiser et rendre public demain.",
  },
  {
    id: 'recit',
    menu: 'Vérité et volonté',
    titre: 'Entre vérité consensuelle et volonté',
    poleHaut: 'Vérité consensuelle',
    poleBas: 'Volonté',
    valeurInitiale: 50,
    logoCentre: true,
    note:
      'Seconde vue du récit : le même hémicycle, le logo en son centre. Déplacez le curseur ' +
      'pour situer une décision entre la volonté (bas) et la vérité consensuelle (haut), et ' +
      "interroger ce qui doit guider demain l'écriture de la loi.",
  },
]

export default function App() {
  const [actif, setActif] = useState(0)

  const basculer = () => setActif((a) => (a + 1) % HEMICYCLES.length)

  return (
    <div className="app">
      <header className="site-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-bar" aria-hidden="true" />
            <div>
              <p className="brand-institution">Données parlementaires : et si demain ?</p>
              <p className="brand-sub">Hackathon 2026, Assemblée nationale</p>
            </div>
          </div>
          <Logo />
        </div>
      </header>

      <main className="content">
        <div className="hemicycle-zone">
          {/* Menu de choix de l'hemicycle + bascule directe */}
          <nav className="menu-hemicycles" aria-label="Choix de l'hémicycle">
            <div className="onglets" role="tablist">
              {HEMICYCLES.map((h, i) => (
                <button
                  key={h.id}
                  type="button"
                  role="tab"
                  aria-selected={i === actif}
                  className={`onglet${i === actif ? ' onglet-actif' : ''}`}
                  onClick={() => setActif(i)}
                >
                  {h.menu}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="btn-bascule"
              onClick={basculer}
              title="Passer directement à l'autre hémicycle"
              aria-label="Passer directement à l'autre hémicycle"
            >
              ⇄
            </button>
          </nav>

          {/* Les deux hemicycles restent montes pour conserver leur curseur */}
          {HEMICYCLES.map((h, i) => (
            <div key={h.id} hidden={i !== actif}>
              <Gauge
                titre={h.titre}
                poleHaut={h.poleHaut}
                poleBas={h.poleBas}
                note={h.note}
                valeurInitiale={h.valeurInitiale}
                logoCentre={h.logoCentre}
              />
            </div>
          ))}
        </div>
      </main>

      <footer className="site-footer">
        <p>
          Prototype de design fiction, défi « Données parlementaires : et si demain ? »,
          Hackathon 2026 de l'Assemblée nationale
        </p>
      </footer>
    </div>
  )
}
