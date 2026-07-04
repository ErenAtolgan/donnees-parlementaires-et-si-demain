import Gauge from './components/Gauge'
import Logo from './components/Logo'
import './App.css'

export default function App() {
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
        <Gauge />
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
