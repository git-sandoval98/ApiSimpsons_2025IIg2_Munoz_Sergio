import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Grid, CardContent, Typography, Pagination, CircularProgress, Alert } from '@mui/material'
import AnimatedCard from '../../Components/Animated/AnimatedCard'
import AnimatedMedia from '../../Components/Animated/AnimatedMedia'
import { resolveImage } from '../../services/simpsonsApi'

export default function EpisodiesPage() {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState([])
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const placeholder = `${import.meta.env.BASE_URL}placeholder.png`

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        setLoading(true); setErr('')
        const res = await fetch(`https://thesimpsonsapi.com/api/episodes?page=${page}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (cancel) return

        const data = Array.isArray(json?.results) ? json.results : Array.isArray(json) ? json : []
        setItems(data)
        const p = Number(json?.pages) || Number(json?.total_pages) || (Number(json?.count) ? Math.ceil(json.count / 20) : 39)
        setPages(p)
      } catch (e) {
        if (cancel) return
        console.error(e)
        setErr('Error al cargar episodios.')
      } finally {
        if (!cancel) setLoading(false)
      }
    })()
    return () => { cancel = true }
  }, [page])

  if (loading) return <Box p={3} display="flex" justifyContent="center"><CircularProgress /></Box>
  if (err) return <Box p={3}><Alert severity="error">{err}</Alert></Box>

  return (
    <Box p={2} width="100%">
      <Typography variant="h5" fontWeight="bold" mb={2}>Episodios</Typography>

      <Grid container spacing={2}>
        {items.map((ep, idx) => {
          const img = resolveImage(ep, 'episode', 500)
          const airdate = ep.airdate ? new Date(ep.airdate).toLocaleDateString() : 'Fecha desconocida'
          return (
            <Grid item key={ep.id} xs={12} md={6}>
              <AnimatedCard elevation={2} delay={idx * 0.03}>
                <AnimatedMedia
                  component="img"
                  image={img || placeholder}
                  alt={ep.name}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = placeholder }}
                  sx={{ width: '100%', objectFit: 'cover', aspectRatio: '16 / 9' }}
                  zoom={1.03}
                />
                <CardContent>
                  <Typography variant="h6" fontWeight={700}>{ep.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Temporada {ep.season} · Ep {ep.episode_number}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">Emitido el: {airdate}</Typography>
                  <Box mt={1.2}>
                    <Typography component={Link} to={`/episodio/${ep.id}`} sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 600 }}>
                      Ver detalles →
                    </Typography>
                  </Box>
                </CardContent>
              </AnimatedCard>
            </Grid>
          )
        })}
      </Grid>

      <Box mt={4} width="100%" display="flex" justifyContent="center">
        <Pagination count={pages} page={page} onChange={(_, v) => setPage(v)} color="primary" shape="rounded" />
      </Box>
    </Box>
  )
}


