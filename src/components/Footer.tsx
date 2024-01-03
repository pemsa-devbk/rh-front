import logoFooter from '../img/logo-blanco.png'

export default function Footer() {
  return (
    <footer className="footer">
      <figure className="footer__picture">
        <img className="footer__img" src={logoFooter} alt="logo-en-blanco" />
      </figure>
      <div className="footer__paragraph">
        <p className="footer__text">Protección Electrónica Monterry S.A de C.V. Copyright © 2023 Todos los derechos reservados</p>
      </div>
    </footer>
  )
}
