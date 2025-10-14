import React from 'react'
import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="side-nav">
      <ul className="side-nav__list">
        <li className="side-nav__item"><Link to="/personajes">Personajes</Link></li>
        <li className="side-nav__item"><Link to="/localizacion">Lugares</Link></li>
        <li className="side-nav__item"><Link to="/episodios">Episodios</Link></li>
      </ul>
    </nav>
  )
}
