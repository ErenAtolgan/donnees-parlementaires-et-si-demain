import { useState } from 'react'

// Hemicycle PLEIN (demi-disque) oriente vers la droite, utilise comme axe :
// pole bas = Efficacite, pole haut = Debat democratique.
// Deux curseurs indiquent ou la Commission puis l'Assemblee ont place le texte,
// selon la lecture choisie. Couleurs de la charte Assemblee nationale.

const PRIMARY = '#233f6b'
const ACCENT = '#e1000f'
const REMPLISSAGE = '#e6eaf2' // teinte claire du bleu de la charte

const CX = 36
const CY = 150
const R = 134

// Positions d'EXEMPLE du curseur par lecture (0 = efficacite, 100 = debat).
const LECTURES = {
  '1re lecture': { commission: 38, assemblee: 62 },
  '2e lecture': { commission: 55, assemblee: 45 },
  '3e lecture': { commission: 72, assemblee: 30 },
}

// Angle pour une position donnee (0 = bas, 100 = haut ; arc bombe a droite).
function angle(p) {
  return -Math.PI / 2 + (p / 100) * Math.PI
}

function point(p, r) {
  const a = angle(p)
  return [CX + r * Math.cos(a), CY - r * Math.sin(a)]
}

function Curseur({ valeur, couleur }) {
  const [x1, y1] = point(valeur, 10)
  const [x2, y2] = point(valeur, R + 12)
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={couleur} strokeWidth={4} strokeLinecap="round" />
      <circle cx={x2} cy={y2} r={5.5} fill={couleur} />
    </g>
  )
}

export default function Gauge({ label = 'Efficacité ou débat démocratique' }) {
  const [lecture, setLecture] = useState('1re lecture')
  const pos = LECTURES[lecture]

  return (
    <section className="carte">
      <p className="eyebrow">Texte en discussion</p>
      <h1 className="carte-titre">{label}</h1>

      <div className="select-lecture">
        <label htmlFor="lecture">Lecture</label>
        <select id="lecture" value={lecture} onChange={(e) => setLecture(e.target.value)}>
          {Object.keys(LECTURES).map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <div className="gauge-wrap">
        <svg
          viewBox="0 -26 208 348"
          className="gauge-svg"
          role="img"
          aria-label={`${lecture} : commission ${pos.commission}, assemblée ${pos.assemblee} (0 = efficacité, 100 = débat démocratique)`}
        >
          {/* Poles de l'axe */}
          <text x={14} y={-10} className="axe-label">
            Débat démocratique
          </text>
          <text x={14} y={312} className="axe-label">
            Efficacité
          </text>

          {/* Hemicycle plein (demi-disque bombe a droite) */}
          <path
            d={`M ${CX} ${CY + R} A ${R} ${R} 0 0 0 ${CX} ${CY - R} Z`}
            fill={REMPLISSAGE}
            stroke="#dddddd"
          />

          {/* Curseurs */}
          <Curseur valeur={pos.commission} couleur={ACCENT} />
          <Curseur valeur={pos.assemblee} couleur={PRIMARY} />
        </svg>
      </div>

      <div className="legende-curseurs">
        <span className="chip">
          <span className="dot" style={{ backgroundColor: ACCENT }} />
          Commission ({pos.commission})
        </span>
        <span className="chip">
          <span className="dot" style={{ backgroundColor: PRIMARY }} />
          Assemblée ({pos.assemblee})
        </span>
      </div>

      <p className="carte-note">
        Position du texte entre efficacité de la procédure et ampleur du débat démocratique, en
        commission puis en séance. Valeurs d'exemple.
      </p>
    </section>
  )
}
