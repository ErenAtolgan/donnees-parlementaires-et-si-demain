import { useId, useState } from 'react'

// Hemicycle PLEIN (demi-disque) oriente selon la prop `orientation`, utilise comme axe :
// pole bas = 0, pole haut = 100 le long de l'arc.
// Palette du LOGO : violet -> bleu -> cyan, en degrade global le long de l'axe
// (violet au pole haut, cyan au pole bas), partage par la jauge et le curseur.
// Jauge en ARC le long du bord externe, pointee par une main.

const VIOLET = '#7c2ae8'
const BLEU = '#2f5fd8'
const CYAN = '#12cbe8'

const CX = 36
const CY = 150
const R = 134
const MILIEU = 50

// Orientation du demi-disque : rotation horaire autour du centre du bord plat.
// 0 = bombe a droite, 90 = bombe en bas, 180 = bombe a gauche, 270 = bombe en haut.
// Chaque entree donne le viewBox et la position des libelles de poles.
const ORIENTATIONS = {
  0: {
    viewBox: '0 -26 208 348',
    haut: { x: 14, y: -10, anchor: 'start' },
    bas: { x: 14, y: 312, anchor: 'start' },
  },
  90: {
    viewBox: '-126 104 316 206',
    haut: { x: 170, y: 118, anchor: 'end' },
    bas: { x: -98, y: 118, anchor: 'start' },
  },
  180: {
    viewBox: '-136 -26 208 348',
    haut: { x: 58, y: 312, anchor: 'end' },
    bas: { x: 58, y: -10, anchor: 'end' },
  },
  270: {
    viewBox: '-126 -30 316 216',
    haut: { x: -98, y: 176, anchor: 'start' },
    bas: { x: 170, y: 176, anchor: 'end' },
  },
}

// Angle pour une position donnee (0 = bas, 100 = haut ; arc bombe a droite).
function angle(p) {
  return -Math.PI / 2 + (p / 100) * Math.PI
}

function point(p, r) {
  const a = angle(p)
  return [CX + r * Math.cos(a), CY - r * Math.sin(a)]
}

// Rotation horaire d'un point autour du centre du bord plat (CX, CY).
function pivote([x, y], rot) {
  const rad = (rot * Math.PI) / 180
  const dx = x - CX
  const dy = y - CY
  return [
    CX + dx * Math.cos(rad) - dy * Math.sin(rad),
    CY + dx * Math.sin(rad) + dy * Math.cos(rad),
  ]
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
// une vraie silhouette de main (paume + 4 doigts + pouce). Par defaut les doigts
// pointent vers l'INTERIEUR de l'hemicycle (interieure=false pour l'exterieur).
// Les doigts se deplient un a un en montant vers le pole haut
// (index seul en bas -> main ouverte pouce compris).
function MainCurseur({ valeur, interieure = true }) {
  const [x, y] = point(valeur, R)
  const deg = (angle(valeur) * 180) / Math.PI
  const rotation = 90 - deg + (interieure ? 180 : 0)
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
    <g transform={`translate(${x} ${y}) rotate(${rotation})`}>
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
  poleHaut = 'Débat démocratique',
  poleBas = 'Efficacité',
  valeurInitiale = 62,
  logoCentre = false,
  mainInterieure = true,
  orientation = 0,
}) {
  const uid = useId()
  const [valeur, setValeur] = useState(valeurInitiale)
  const versLeHaut = valeur >= MILIEU

  const gradLogo = `gradLogo-${uid}`
  const gradDisque = `gradDisque-${uid}`

  const o = ORIENTATIONS[orientation] ?? ORIENTATIONS[0]
  const rot = ORIENTATIONS[orientation] ? orientation : 0

  // Bornes de la portion coloree : de l'extremite (haut ou bas) au curseur.
  const debut = versLeHaut ? valeur : 0
  const fin = versLeHaut ? 100 : valeur

  // Medaillon du logo A CHEVAL sur le bord plat : centre au milieu du bord plat
  // (CX, CY), invariant par rotation — une moitie dans l'hemicycle, une moitie dehors.
  const horizontal = rot === 90 || rot === 270
  const rLogo = 24
  const tailleImg = 38
  const [xLogo, yLogo] = [CX, CY]

  return (
    <section className="carte">
      <p className="eyebrow">Indicateur prototype, design fiction</p>

      <div className="gauge-wrap">
        <svg
          viewBox={o.viewBox}
          className={`gauge-svg${horizontal ? ' gauge-svg-large' : ''}`}
          role="img"
          aria-label={`Position du curseur entre ${poleBas} et ${poleHaut}`}
        >
          <defs>
            {/* Degrade global du logo : violet (pole haut) -> bleu -> cyan (pole bas).
                En userSpaceOnUse, il suit la rotation du dessin. */}
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

          {/* Poles de l'axe (hors rotation pour rester lisibles) */}
          <text x={o.haut.x} y={o.haut.y} className="axe-label" textAnchor={o.haut.anchor}>
            {poleHaut}
          </text>
          <text x={o.bas.x} y={o.bas.y} className="axe-label" textAnchor={o.bas.anchor}>
            {poleBas}
          </text>

          {/* Dessin, tourne selon l'orientation */}
          <g transform={rot ? `rotate(${rot} ${CX} ${CY})` : undefined}>
            {/* Hemicycle plein (demi-disque) */}
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

            {/* Main pointant la position */}
            <MainCurseur valeur={valeur} interieure={mainInterieure} />
          </g>

          {/* Logo au centre du demi-disque (seconde vue du recit), jamais tourne */}
          {logoCentre && (
            <g>
              <circle cx={xLogo} cy={yLogo} r={rLogo} fill="#ffffff" stroke="#dddddd" />
              <image
                href="/logo.png"
                x={xLogo - tailleImg / 2}
                y={yLogo - tailleImg / 2}
                width={tailleImg}
                height={tailleImg}
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          )}
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
    </section>
  )
}
