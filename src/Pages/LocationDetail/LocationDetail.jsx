import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Box, Typography, Button, CardContent, CircularProgress, Alert } from '@mui/material'
import AnimatedCard from '../../Components/Animated/AnimatedCard'
import AnimatedMedia from '../../Components/Animated/AnimatedMedia'
import { resolveImage } from '../../services/simpsonsApi'

export default function LocationDetail() {
  const { id } = useParams()
  const [location, setLocation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const placeholder = `${import.meta.env.BASE_URL}placeholder.png`

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        setLoading(true); setErr('')
        const res = await fetch(`https://thesimpsonsapi.com/api/locations/${id}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (cancel) return
        setLocation(json)
      } catch (e) {
        if (cancel) return
        console.error(e)
        setErr('Error al cargar el lugar.')
      } finally {
        if (!cancel) setLoading(false)
      }
    })()
    return () => { cancel = true }
  }, [id])

  if (loading) return <Box p={3} display="flex" justifyContent="center"><CircularProgress /></Box>
  if (err) return <Box p={3}><Alert severity="error">{err}</Alert></Box>
  if (!location) return <Box p={3}><Alert severity="warning">Lugar no encontrado.</Alert></Box>

  const img = resolveImage(location, 'location', 1280) || placeholder
  const town = location.town || location.city || 'Springfield'
  const use = location.use ? `· ${location.use}` : ''

  return (
    <Box p={3} display="flex" justifyContent="center">
      <AnimatedCard sx={{ maxWidth: 900, width: '100%', boxShadow: 4 }}>
        <AnimatedMedia
          component="img"
          image={img}
          alt={location.name}
          onError={(e) => { e.currentTarget.src = placeholder }}
          loading="lazy"
          sx={{ width: '100%', objectFit: 'cover', aspectRatio: '4 / 3' }}
          zoom={1.01}
        />
        <CardContent>
          <Typography variant="h5" fontWeight="bold" gutterBottom>{location.name}</Typography>
          <Typography variant="body1" color="text.secondary">{town} {use}</Typography>
          {location.description && <Typography variant="body1" sx={{ mt: 2 }}>{location.description}</Typography>}
          <Box mt={3}>
            <Button variant="contained" color="primary" component={Link} to="/localizacion">← Volver a lugares</Button>
          </Box>
        </CardContent>
      </AnimatedCard>
    </Box>
  )
}
