// Logo officiel (fichier public/logo.png), avec le nom MarIANne dessous
// (IA et N aux couleurs de la charte).
export default function Logo() {
  return (
    <div className="logo-bloc">
      <img src="/logo.png" alt="Logo MarIANne" className="logo" />
      <p className="logo-nom">
        Mar<span className="logo-nom-ia">IA</span>
        <span className="logo-nom-an">N</span>ne
      </p>
    </div>
  )
}
