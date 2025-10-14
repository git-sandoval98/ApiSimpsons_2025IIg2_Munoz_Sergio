import React from 'react'
import { motion } from 'framer-motion'
import FaceHomer from '../../assets/FaceHomer.png'
import './Header.css'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()

  return (
    <header className="site-header">
      <motion.img
        src={FaceHomer}
        alt="Face Homer"
        className="site-logo"
        onClick={() => navigate('/')}
        initial={{ opacity: 0, y: -6, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 18 }}
        whileHover={{ rotate: -8, scale: 1.03 }}
        whileTap={{ rotate: 6, scale: 0.97 }}
      />

      {/* Título nítido (sin blur) */}
      <motion.h1
        className="site-title"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        Los Thomsons
      </motion.h1>
    </header>
  )
}
