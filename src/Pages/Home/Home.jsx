import { Box, Typography, Grid, CardContent } from '@mui/material'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AnimatedCard from '../../Components/Animated/AnimatedCard'
import AnimatedMedia from '../../Components/Animated/AnimatedMedia'
import './Home.css'

const cdn = (path, size = 500) => `https://cdn.thesimpsonsapi.com/${size}${path}`

const highlights = [
  { title: 'Personajes', desc: 'Conoce a los habitantes de Springfield: su trabajo, estado y más.', img: cdn('/character/1.webp'), link: '/personajes' },
  { title: 'Episodios',  desc: 'Explora la historia de la serie temporada por temporada.',           img: cdn('/episode/1.webp'),   link: '/episodios' },
  { title: 'Lugares',    desc: 'Visita locaciones icónicas: la planta nuclear, el Bar de Moe y más.', img: cdn('/location/1.webp'),   link: '/localizacion' },
]

export default function Home() {
  return (
    <Box className="home-root">
      {/* HERO */}
      <motion.section
        className="home-hero"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <div className="hero-left">
          <Typography variant="h3" component="h2" className="home-title">
            Bienvenido al Mundo de <span>Los Simpsons</span>
          </Typography>
          <Typography variant="h6" className="home-subtitle">
            Explora personajes, episodios y locaciones de la serie animada más famosa del mundo.
          </Typography>
          <div className="hero-note">Usa el menú o las tarjetas para navegar por las secciones.</div>
        </div>
        <div className="hero-right">
          <div className="donut">🍩</div>
          <div className="cloud cloud-a" />
          <div className="cloud cloud-b" />
        </div>
      </motion.section>

      {/* TARJETAS */}
      <motion.section
        className="home-highlights"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } } }}
      >
        <Grid container spacing={2}>
          {highlights.map((item, idx) => (
            <Grid item xs={12} sm={6} md={4} key={idx}>
              <AnimatedCard
                component={Link}
                to={item.link}
                className="home-card clickable"
                elevation={3}
                delay={idx * 0.05}
              >
                <AnimatedMedia
                  component="img"
                  image={item.img}
                  alt={item.title}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = `${import.meta.env.BASE_URL}placeholder.png` }}
                  sx={{ aspectRatio: '4 / 3', width: '100%', objectFit: 'cover', backgroundColor: 'var(--card-bg)' }}
                  zoom={1.06}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight={700} gutterBottom>{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                </CardContent>
              </AnimatedCard>
            </Grid>
          ))}
        </Grid>
      </motion.section>
      <motion.section
        className="home-quote"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
      >
        <blockquote>“Intentar es el primer paso hacia el fracaso.” — <span>Homero Simpson</span></blockquote>
      </motion.section>
    </Box>
  )
}
