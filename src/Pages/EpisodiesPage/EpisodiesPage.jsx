import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box, Grid, Card, CardContent, CardMedia, Typography,
  Pagination, Alert, TextField, InputAdornment
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import Loader from '../../Components/Loader/Loader'

function cdnUrl(imagePath, kind = 'episode', size = 500) {
  if (!imagePath) return ''
  let p = String(imagePath).trim()
  if (/^https?:\/\//i.test(p)) return p
  if (!p.includes('/')) p = `/${kind}/${p}`
  if (!p.startsWith('/')) p = '/' + p
  return `https://cdn.thesimpsonsapi.com/${size}${p}`
}
function resolveEpisodeImage(ep, size = 500) {
  const candidates = [ep?.image_path, ep?.image, ep?.imageUrl, ep?.image_url].filter(Boolean)
  if (!candidates.length) return ''
  return cdnUrl(candidates[0], 'episode', size)
}

const API_PAGE_SIZE = 20

export default function EpisodiesPage() {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const placeholder = `${import.meta.env.BASE_URL}placeholder.png`

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 300)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        setLoading(true); setErr('')
        const res = await fetch(`https://thesimpsonsapi.com/api/episodes?page=${page}`, { cache:'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (cancel) return

        const data = Array.isArray(json?.results) ? json.results : []
        setItems(data)

        const pages = Number(json?.pages) || Math.ceil((Number(json?.count)||0) / API_PAGE_SIZE) || 1
        setTotalPages(pages)
      } catch (e) {
        if (cancel) return
        console.error(e)
        setErr('Error al cargar episodios')
      } finally {
        if (!cancel) setLoading(false)
      }
    })()
    return () => { cancel = true }
  }, [page])

  const filtered = useMemo(() => {
    if (!debouncedQuery) return items
    return items.filter(ep => (ep.name || '').toLowerCase().includes(debouncedQuery))
  }, [items, debouncedQuery])

  if (loading) return <Loader label="Cargando episodios..." />

  if (err) return <Box p={3}><Alert severity="error">{err}</Alert></Box>

  return (
    <Box p={2} width="100%">
      <Typography variant="h5" fontWeight="bold" align='center' mb={2}>Episodios</Typography>

      <Box mb={2} maxWidth={420}>
        <TextField
          fullWidth
          size="small"
          label="Buscar episodio…"
          value={query}
          onChange={(e)=> setQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon/>
              </InputAdornment>
            )
          }}
        />
      </Box>

      {filtered.length === 0 ? (
        <Alert severity="info">No hay resultados para esta página.</Alert>
      ) : (
        <Grid container spacing={2}>
          {filtered.map(ep => {
            const img = resolveEpisodeImage(ep, 500) || placeholder
            return (
              <Grid item key={ep.id} xs={12} md={6}>
                <Card elevation={2}>
                  <CardMedia
                    component="img"
                    image={img}
                    alt={ep.name}
                    loading="lazy"
                    onError={(e)=> { e.currentTarget.src = placeholder }}
                    sx={{ aspectRatio:{ xs:'4 / 3', sm:'16 / 9' }, objectFit:'cover' }}
                  />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">{ep.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Temporada {ep.season} · Ep {ep.episode_number}
                    </Typography>
                    <Box mt={1}>
                      <Typography component={Link} to={`/episodio/${ep.id}`}
                        sx={{ textDecoration:'none', color:'primary.main', fontWeight:600 }}>
                        Ver detalles →
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      )}

      <Box mt={4} width="100%" display="flex" justifyContent="center">
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, v) => setPage(v)}
          color="primary"
          shape="rounded"
          sx={{ '& ul':{ display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'center' } }}
        />
      </Box>
    </Box>
  )
}
