import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Box, Typography, Button, CardContent, CircularProgress, Alert } from '@mui/material'
import AnimatedCard from '../../Components/Animated/AnimatedCard'
import AnimatedMedia from '../../Components/Animated/AnimatedMedia'
import { resolveImage } from '../../services/simpsonsApi'

export default function EpisodeDetail() {
  const { id } = useParams()
  const [episode, setEpisode] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const placeholder = `${import.meta.env.BASE_URL}placeholder.png`

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        setLoading(true); setErr('')
        const res = await fetch(`https://thesimpsonsapi.com/api/episodes/${id}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (cancel) return
        setEpisode(json)
      } catch (e) {
        if (cancel) return
        console.error(e)
        setErr('Error al cargar el episodio.')
      } finally {
        if (!cancel) setLoading(false)
      }
    })()
    return () => { cancel = true }
  }, [id])

  if (loading) return <Box p={3} display="flex" justifyContent="center"><CircularProgress /></Box>
  if (err) return <Box p={3}><Alert severity="error">{err}</Alert></Box>
  if (!episode) return <Box p={3}><Alert severity="warning">Episodio no encontrado.</Alert></Box>

  const img = resolveImage(episode, 'episode', 1280) || placeholder
  const airdate = episode.airdate ? new Date(episode.airdate).toLocaleDateString() : 'Fecha desconocida'

  return (
    <Box p={3} display="flex" justifyContent="center">
      <AnimatedCard sx={{ maxWidth: 900, width: '100%', boxShadow: 4 }}>
        <AnimatedMedia
          component="img"
          image={img}
          alt={episode.name}
          onError={(e) => { e.currentTarget.src = placeholder }}
          loading="lazy"
          sx={{ width: '100%', objectFit: 'cover', aspectRatio: '16 / 9' }}
          zoom={1.01}
        />
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>{episode.name}</Typography>
          <Typography variant="body1" color="text.secondary">Temporada {episode.season}, Episodio {episode.episode_number}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Emitido el: {airdate}</Typography>
          {episode.synopsis && <Typography variant="body1" sx={{ mt: 2 }}>{episode.synopsis}</Typography>}
          <Box mt={3}>
            <Button variant="contained" color="primary" component={Link} to="/episodios">← Volver a episodios</Button>
          </Box>
        </CardContent>
      </AnimatedCard>
    </Box>
  )
}
