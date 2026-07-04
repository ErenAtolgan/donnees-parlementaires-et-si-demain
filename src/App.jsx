import Gauge from './components/Gauge'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <header className="site-header">
        <div className="brand">
          <span className="brand-bar" aria-hidden="true" />
          <div>
            <p className="brand-institution">Assemblée nationale</p>
            <p className="brand-sub">Indicateurs parlementaires</p>
          </div>
        </div>
      </header>

      <main className="content">
        <Gauge />
      </main>

      <footer className="site-footer">
        <p>Prototype - Hackathon 2026, Assemblée nationale</p>
      </footer>
    </div>
  )
}
