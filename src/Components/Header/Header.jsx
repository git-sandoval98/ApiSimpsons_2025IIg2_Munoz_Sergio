import React from 'react'
import { useNavigate } from 'react-router-dom'
import FaceHomer from '../../assets/FaceHomer.png'
import './Header.css'

const Header = () => {
  const navigate = useNavigate() 

  const handleLogoClick = () => {
    navigate('/')
  }

  return (
    <header>
      <img
        src={FaceHomer}
        alt="Face Homer"
        id="image-title"
        onClick={handleLogoClick}
        style={{ cursor: 'pointer' }}
      />
      <h1>Los Thomsons</h1>
    </header>
  )
}

export default Header
