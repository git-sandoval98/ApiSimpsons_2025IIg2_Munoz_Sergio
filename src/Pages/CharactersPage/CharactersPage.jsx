import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Box, Grid, CardContent, Typography, Pagination, CircularProgress, Alert } from '@mui/material'
import AnimatedCard from '../../Components/Animated/AnimatedCard'
import AnimatedMedia from '../../Components/Animated/AnimatedMedia'
import { resolveImage } from '../../services/simpsonsApi'

const UI_PAGE_SIZE = 10

export default function CharactersPage() {
  const [uiPage, setUiPage] = useState(1)
  const [apiPage, setApiPage] = useState(1)
  const [itemsApi, setItemsApi] = useState([])
  const [totalPagesApi, setTotalPagesApi] = useState(1)
  const [totalUiPages, setTotalUiPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const placeholder = `${import.meta.env.BASE_URL}placeholder.png`

  useEffect(() => {
    const neededApiPage = Math.floor((uiPage - 1) / 2) + 1
    if (neededApiPage !== apiPage) setApiPage(neededApiPage)
  }, [uiPage])

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        setLoading(true); setErr('')
        const res = await fetch(`https://thesimpsonsapi.com/api/characters?page=${apiPage}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (cancel) return

        const data = Array.isArray(json) ? json
          : Array.isArray(json?.data) ? json.data
          : Array.isArray(json?.results) ? json.results
          : []

        setItemsApi(data)

        const apiPages = Number(json?.pages) || Number(json?.total_pages) ||
          (Number(json?.count) ? Math.ceil(Number(json.count) / 20) : 60)
        setTotalPagesApi(apiPages)

        const totalItems = Number(json?.count) || (apiPages * 20)
        setTotalUiPages(Math.max(1, Math.ceil(totalItems / UI_PAGE_SIZE)))
      } catch (e) {
        if (cancel) return
        console.error(e)
        setErr('Error al cargar personajes (¿bloqueador o API caída?).')
      } finally {
        if (!cancel) setLoading(false)
      }
    })()
    return () => { cancel = true }
  }, [apiPage])

  const itemsUi = useMemo(() => {
    const halfIndex = ((uiPage - 1) % 2)
    const start = halfIndex * UI_PAGE_SIZE
    return itemsApi.slice(start, start + UI_PAGE_SIZE)
  }, [itemsApi, uiPage])

  if (loading) return <Box p={3} display="flex" justifyContent="center"><CircularProgress /></Box>
  if (err) return <Box p={3}><Alert severity="error">{err}</Alert></Box>
  if (!itemsUi.length) return <Box p={3}><Alert severity="warning">No llegaron personajes en esta página.</Alert></Box>

  return (
    <Box p={2} width="100%">
      <Typography variant="h5" fontWeight="bold" mb={2}>Personajes</Typography>

      <Grid container spacing={2}>
        {itemsUi.map((ch, idx) => {
          const img = resolveImage(ch, 'character', 500)
          const id = ch.id ?? ch._id ?? ''
          return (
            <Grid item key={id || ch.name} xs={12} sm={6} md={4} lg={3}>
              <AnimatedCard elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }} delay={idx * 0.03}>
                <AnimatedMedia
                  component="img"
                  sx={{ aspectRatio: '4 / 3', width: '100%', objectFit: 'contain', backgroundColor: 'background.paper' }}
                  image={img || placeholder}
                  alt={ch.name}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = placeholder }}
                  zoom={1.02}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">{ch.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{ch.occupation || 'Ocupación desconocida'}</Typography>
                  <Box mt={1}>
                    <Typography variant="caption" color={ch.status === 'Deceased' ? 'error.main' : 'success.main'}>
                      {ch.status || 'Desconocido'}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography component={Link} to={`/personaje/${id}`} sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 600 }}>
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
        <Pagination
          count={totalUiPages}
          page={uiPage}
          onChange={(_, v) => setUiPage(v)}
          color="primary"
          size="medium"
          shape="rounded"
          sx={{ '& ul': { display: 'flex', flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap' } }}
        />
      </Box>
    </Box>
  )
}

