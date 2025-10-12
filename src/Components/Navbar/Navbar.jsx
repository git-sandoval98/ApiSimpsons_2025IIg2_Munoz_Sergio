import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav>
        <ul>
            <li><Link to="/personajes">Personajes</Link></li>
            <li><Link to="/localizacion">Lugares</Link></li>
            <li><Link to="/episodios">Episodios</Link></li>
        </ul>
    </nav>
  )
}

export default Navbar