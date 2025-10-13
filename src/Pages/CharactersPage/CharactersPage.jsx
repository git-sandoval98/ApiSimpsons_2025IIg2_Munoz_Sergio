import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box, Grid, Card, CardContent, CardMedia,
  Typography, Pagination, CircularProgress, Alert
} from '@mui/material'
import { keyframes } from '@emotion/react'

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
`

function cdnUrl(imagePath, kind = 'character', size = 500) {
  if (!imagePath) return ''
  let p = String(imagePath).trim()
  if (/^https?:\/\//i.test(p)) return p
  if (!p.includes('/')) p = `/${kind}/${p}`
  if (!p.startsWith('/')) p = '/' + p
  return `https://cdn.thesimpsonsapi.com/${size}${p}`
}

function resolveCharacterImage(ch) {
  const candidates = [
    ch?.portrait_path,
    ch?.portrait,
    ch?.image,
    ch?.imageUrl,
    ch?.image_url,
    ch?.images?.portrait,
  ].filter(Boolean)
  if (!candidates.length) return ''
  return cdnUrl(candidates[0], 'character', 500)
}

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
        setLoading(true)
        setErr('')
        const res = await fetch(`https://thesimpsonsapi.com/api/characters?page=${apiPage}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (cancel) return

        const data =
          Array.isArray(json) ? json :
          Array.isArray(json?.data) ? json.data :
          Array.isArray(json?.results) ? json.results :
          []

        setItemsApi(data)

        const apiPages =
          Number(json?.total_pages) ||
          (Number(json?.total) ? Math.ceil(Number(json.total) / 20) : null) ||
          60
        setTotalPagesApi(apiPages)

        const totalItems = Number(json?.total) || (apiPages * 20) 
        const uiPages = Math.max(1, Math.ceil(totalItems / UI_PAGE_SIZE))
        setTotalUiPages(uiPages)
      } catch (e) {
        if (cancel) return
        console.error('Error characters:', e)
        setErr('Error al cargar personajes (¿bloqueador o API caída?)')
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

  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    )
  }

  if (err) {
    return <Box p={3}><Alert severity="error">{err}</Alert></Box>
  }

  if (!itemsUi.length) {
    return (
      <Box p={3}><Alert severity="warning">
        No llegaron personajes en esta página.
      </Alert></Box>
    )
  }

  return (
    <Box p={2} width="100%">
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Personajes
      </Typography>

      <Grid container spacing={2}>
        {itemsUi.map((ch, idx) => {
          const img = resolveCharacterImage(ch)
          const id = ch.id ?? ch._id ?? ''

          return (
            <Grid
              item
              key={id || ch.name}
              xs={12} sm={6} md={4} lg={3}
              sx={{
                animation: `${fadeInUp} .4s ease both`,
                animationDelay: `${idx * 40}ms`,
              }}
            >
              <Card
                elevation={2}
                sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                <CardMedia
                  component="img"
                  sx={{
                    aspectRatio: '4 / 3',
                    width: '100%',
                    objectFit: 'contain',
                    backgroundColor: 'background.paper'
                  }}
                  image={img || placeholder}
                  alt={ch.name}
                  loading="lazy"
                  onError={(e) => { e.currentTarget.src = placeholder }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">{ch.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {ch.occupation || 'Ocupación desconocida'}
                  </Typography>
                  <Box mt={1}>
                    <Typography variant="caption" color={ch.status === 'Deceased' ? 'error.main' : 'success.main'}>
                      {ch.status || 'Desconocido'}
                    </Typography>
                  </Box>
                  <Box mt={2}>
                    <Typography
                      component={Link}
                      to={`/personaje/${id}`}
                      sx={{ textDecoration: 'none', color: 'primary.main', fontWeight: 600 }}
                    >
                      Ver detalles →
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
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
          sx={{
            '& ul': {
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              flexWrap: 'wrap',
            },
          }}
        />
      </Box>
    </Box>
  )
}
