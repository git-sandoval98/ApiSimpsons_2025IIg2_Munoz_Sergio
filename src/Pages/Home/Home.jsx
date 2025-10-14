import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './Home.css'
import Banner1 from '../../assets/los-simpsons-horizontal-1.jpg'
import Banner2 from '../../assets/los-simpsons-horizontal-2.jpg'
import Banner3 from '../../assets/los-simpsons-horizontal-3.jpg'

/**
 * Pequeño componente de máquina de escribir que soporta
 * varias partes (para estilizar “Los Simpsons” con gradiente).
 *
 * parts: [{ text: string, className?: string }]
 */
function TypewriterMulti({ parts, speed = 40, startDelay = 300 }) {
  const [n, setN] = useState(0)

  const total = useMemo(
    () => parts.reduce((acc, p) => acc + (p.text?.length || 0), 0),
    [parts]
  )

  useEffect(() => {
    let t1 = setTimeout(() => {
      const id = setInterval(() => {
        setN((v) => {
          if (v >= total) {
            clearInterval(id)
            return v
          }
          return v + 1
        })
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(t1)
    }
  }, [speed, startDelay, total])

  let consumed = 0
  return (
    <span className="tw">
      {parts.map((p, idx) => {
        const len = p.text.length
        const visible = Math.max(0, Math.min(len, n - consumed))
        consumed += len
        return (
          <span key={idx} className={p.className || ''}>
            {p.text.slice(0, visible)}
          </span>
        )
      })}
      <span className={`tw__caret ${n >= total ? 'tw__caret--hidden' : ''}`} />
    </span>
  )
}

const container = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.08, duration: 0.5, ease: 'easeOut' }
  }
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } }
}

export default function Home() {
  const titleParts = [
    { text: 'Bienvenido al Mundo de ' },
    { text: 'Los Simpsons', className: 'hero__title--gradient' },
    { text: ' por Sergio Muñoz' }
  ]

  return (
    <div className="home">
      <motion.section
        className="hero"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h2 className="hero__title" variants={item}>
          <TypewriterMulti parts={titleParts} speed={35} startDelay={250} />
        </motion.h2>

        <motion.p className="hero__subtitle" variants={item}>
          Explora personajes, episodios y locaciones de la serie animada más famosa del mundo.
        </motion.p>

        <motion.div className="hero__hint" variants={item}>
          Usa el menú o las tarjetas para navegar por las secciones.
        </motion.div>

        {/* Nubes y donita flotando */}
        <motion.div
          className="cloud cloud--left"
          initial={{ y: 0 }}
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="cloud cloud--right"
          initial={{ y: 0 }}
          animate={{ y: [-2, 6, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="donut-float"
          initial={{ rotate: -6, y: 0 }}
          animate={{ rotate: [-6, 6, -6], y: [0, -8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          🍩
        </motion.div>
      </motion.section>

      {/* Tarjetas / accesos rápidos */}
      <div className="cards-container">
        <Link to="/personajes" className="home-card">
          <img
            src={Banner1}
            // src="https://static.simpsonswiki.com/images/0/02/Homer_Simpson.png"
            alt="Personajes"
          />
          <div>
            <h3>Personajes</h3>
            <p>Conoce a los habitantes de Springfield: su trabajo, estado y más.</p>
          </div>
        </Link>

        <Link to="/episodios" className="home-card">
          <img
            src={Banner2}
            // src="https://static.simpsonswiki.com/images/8/8a/Simpsons_Roasting_on_an_Open_Fire.jpg"
            alt="Episodios"
          />
          <div>
            <h3>Episodios</h3>
            <p>Explora la historia de la serie temporada por temporada.</p>
          </div>
        </Link>

        <Link to="/lugares" className="home-card">
          <img
            src={Banner3}
            // src="https://static.simpsonswiki.com/images/0/0b/The_Simpsons_House.png"
            alt="Lugares"
          />
          <div>
            <h3>Lugares</h3>
            <p>Descubre los lugares más icónicos de Springfield.</p>
          </div>
        </Link>
      </div>
      <motion.section
        className="home-quote"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <blockquote>
          “Intentar es el primer paso hacia el fracaso.”
          <span> — Homero Simpson</span>
        </blockquote>
      </motion.section>
    </div>
  )
}
