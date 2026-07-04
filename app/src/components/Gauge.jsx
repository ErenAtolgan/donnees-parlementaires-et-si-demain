import { useId, useState } from 'react'

// Hemicycle PLEIN (demi-disque) oriente vers la droite, utilise comme axe :
// pole bas = Efficacite, pole haut = Debat democratique.
// Palette du LOGO : violet -> bleu -> cyan, en degrade global vertical
// (violet au pole haut, cyan au pole bas), partage par la jauge et le curseur.
// Jauge en ARC le long du bord externe, pointee par une main.

const VIOLET = '#7c2ae8'
const BLEU = '#2f5fd8'
const CYAN = '#12cbe8'

const CX = 36
const CY = 150
const R = 134
const MILIEU = 50

// Angle pour une position donnee (0 = bas, 100 = haut ; arc bombe a droite).
function angle(p) {
  return -Math.PI / 2 + (p / 100) * Math.PI
}

function point(p, r) {
  const a = angle(p)
  return [CX + r * Math.cos(a), CY - r * Math.sin(a)]
}

// Arc le long du bord externe entre deux positions (debut < fin).
function cheminArc(debut, fin) {
  const [x1, y1] = point(debut, R)
  const [x2, y2] = point(fin, R)
  return `M ${x1} ${y1} A ${R} ${R} 0 0 0 ${x2} ${y2}`
}

// Couleur de la charte a une position donnee (cyan en bas -> bleu -> violet en haut).
function couleurValeur(v) {
  const hex = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)]
  const mix = (a, b, t) => a.map((x, i) => Math.round(x + (b[i] - x) * t))
  const rgb = v < 50 ? mix(hex(CYAN), hex(BLEU), v / 50) : mix(hex(BLEU), hex(VIOLET), (v - 50) / 50)
  return `rgb(${rgb.join(',')})`
}

// Main-curseur posee SUR l'arc, dessinee en SVG aux couleurs de la charte :
// une vraie silhouette de main (paume + 4 doigts + pouce), doigts vers
// l'exterieur de l'hemicycle. Les doigts se deplient un a un en montant
// vers le debat democratique (index seul en bas -> main ouverte pouce compris).
function MainCurseur({ valeur }) {
  const [x, y] = point(valeur, R)
  const deg = (angle(valeur) * 180) / Math.PI
  const nb = valeur < 20 ? 1 : valeur < 40 ? 2 : valeur < 60 ? 3 : valeur < 80 ? 4 : 5
  const couleur = couleurValeur(valeur)

  // Doigts de gauche a droite ; "ordre" = rang de depliage (index en premier).
  const doigts = [
    { x: -6.6, max: 10.5, ordre: 4 }, // auriculaire
    { x: -2.2, max: 13.5, ordre: 3 }, // annulaire
    { x: 2.2, max: 15, ordre: 2 }, // majeur
    { x: 6.6, max: 13, ordre: 1 }, // index
  ]
  const longueur = (d) => (nb >= d.ordre ? d.max : 3) // replie = petite bosse
  const pouce = nb >= 5 ? { x2: 18, y2: -2 } : { x2: 12, y2: 2 }

  return (
    <g transform={`translate(${x} ${y}) rotate(${90 - deg})`}>
      {/* Halo blanc pour detacher la main de l'arc */}
      {doigts.map((d, i) => (
        <line
          key={`h${i}`}
          x1={d.x}
          y1={2}
          x2={d.x}
          y2={-1 - longueur(d)}
          stroke="#ffffff"
          strokeWidth={7.4}
          strokeLinecap="round"
        />
      ))}
      <line
        x1={9}
        y1={7}
        x2={pouce.x2}
        y2={pouce.y2}
        stroke="#ffffff"
        strokeWidth={7.8}
        strokeLinecap="round"
      />
      <rect x={-12} y={-3} width={24} height={20} rx={8} fill="#ffffff" />
      {/* Doigts */}
      {doigts.map((d, i) => (
        <line
          key={i}
          x1={d.x}
          y1={2}
          x2={d.x}
          y2={-1 - longueur(d)}
          stroke={couleur}
          strokeWidth={3.9}
          strokeLinecap="round"
        />
      ))}
      {/* Pouce */}
      <line
        x1={9}
        y1={7}
        x2={pouce.x2}
        y2={pouce.y2}
        stroke={couleur}
        strokeWidth={4.2}
        strokeLinecap="round"
      />
      {/* Paume */}
      <rect x={-10} y={-1} width={20} height={16} rx={6.5} fill={couleur} />
    </g>
  )
}

export default function Gauge({
  titre = 'Efficacité du débat démocratique',
  poleHaut = 'Débat démocratique',
  poleBas = 'Efficacité',
  note,
  valeurInitiale = 62,
  logoCentre = false,
}) {
  const uid = useId()
  const [valeur, setValeur] = useState(valeurInitiale)
  const versLeHaut = valeur >= MILIEU

  const gradLogo = `gradLogo-${uid}`
  const gradDisque = `gradDisque-${uid}`

  // Bornes de la portion coloree : de l'extremite (haut ou bas) au curseur.
  const debut = versLeHaut ? valeur : 0
  const fin = versLeHaut ? 100 : valeur

  return (
    <section className="carte">
      <p className="eyebrow">Indicateur prototype, design fiction</p>
      <h1 className="carte-titre">{titre}</h1>

      <div className="gauge-wrap">
        <svg
          viewBox="0 -26 208 348"
          className="gauge-svg"
          role="img"
          aria-label={`Position du curseur entre ${poleBas} (bas) et ${poleHaut} (haut)`}
        >
          <defs>
            {/* Degrade global du logo : violet (haut) -> bleu -> cyan (bas) */}
            <linearGradient
              id={gradLogo}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1={CY - R}
              x2="0"
              y2={CY + R}
            >
              <stop offset="0%" stopColor={VIOLET} />
              <stop offset="50%" stopColor={BLEU} />
              <stop offset="100%" stopColor={CYAN} />
            </linearGradient>
            {/* Degrade de fond du demi-disque : teintes pales du logo */}
            <linearGradient id={gradDisque} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f0e7fb" />
              <stop offset="50%" stopColor="#eef1f8" />
              <stop offset="100%" stopColor="#e2f7fa" />
            </linearGradient>
          </defs>

          {/* Poles de l'axe */}
          <text x={14} y={-10} className="axe-label">
            {poleHaut}
          </text>
          <text x={14} y={312} className="axe-label">
            {poleBas}
          </text>

          {/* Hemicycle plein (demi-disque bombe a droite) */}
          <path
            d={`M ${CX} ${CY + R} A ${R} ${R} 0 0 0 ${CX} ${CY - R} Z`}
            fill={`url(#${gradDisque})`}
            stroke="#dddddd"
          />

          {/* Arc de l'extremite (haut ou bas) jusqu'au curseur */}
          <path
            d={cheminArc(debut, fin)}
            fill="none"
            stroke={`url(#${gradLogo})`}
            strokeWidth={10}
            strokeLinecap="round"
          />

          {/* Logo au centre du demi-disque (seconde vue du recit) */}
          {logoCentre && (
            <g>
              {/* Centre visuel du demi-disque : a ~0.42 R du bord plat */}
              <circle cx={CX + R * 0.42} cy={CY} r={42} fill="#ffffff" stroke="#dddddd" />
              <image
                href="/logo.png"
                x={CX + R * 0.42 - 34}
                y={CY - 34}
                width={68}
                height={68}
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          )}

          {/* Main pointant la position */}
          <MainCurseur valeur={valeur} />
        </svg>
      </div>

      <div className="reglage">
        <span className="pole">{poleBas}</span>
        <input
          id={`valeur-${uid}`}
          type="range"
          min="0"
          max="100"
          value={valeur}
          onChange={(e) => setValeur(Number(e.target.value))}
          aria-label={`Position entre ${poleBas} et ${poleHaut}`}
        />
        <span className="pole">{poleHaut}</span>
      </div>

      {note && <p className="carte-note">{note}</p>}
    </section>
  )
}
