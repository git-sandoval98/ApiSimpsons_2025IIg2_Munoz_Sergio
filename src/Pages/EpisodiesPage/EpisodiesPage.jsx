import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box, Grid, Card, CardContent, CardMedia, Typography,
  Pagination, Alert, TextField, InputAdornment,
  FormControl, InputLabel, Select, MenuItem, Button, Stack
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
const SEASON_UI_PAGE_SIZE = 12   
const FETCH_BATCH = 5        
const SEASON_OPTIONS_MAX = 50   

export default function EpisodiesPage() {
  const [page, setPage] = useState(1)
  const [items, setItems] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  const [season, setSeason] = useState('')  
  const [seasonData, setSeasonData] = useState({})
  const [seasonLoading, setSeasonLoading] = useState(false)
  const [seasonDone, setSeasonDone] = useState(false)
  const [seasonUiPage, setSeasonUiPage] = useState(1)
  const fetchedUntilRef = useRef(0) 

  const placeholder = `${import.meta.env.BASE_URL}placeholder.png`

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim().toLowerCase()), 300)
    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    if (season) return
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
  }, [page, season])

  async function fetchSeasonBatch(targetSeason) {

    setSeasonLoading(true)
    try {
      const start = fetchedUntilRef.current + 1
      const end = Math.min(start + FETCH_BATCH - 1, totalPages || 999)

      const collected = []
      let knownTotal = totalPages

      for (let p = start; p <= end; p++) {
        const res = await fetch(`https://thesimpsonsapi.com/api/episodes?page=${p}`, { cache:'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (!knownTotal) {
          knownTotal = Number(json?.pages) || Math.ceil((Number(json?.count)||0) / API_PAGE_SIZE) || 1
          setTotalPages(knownTotal)
        }

        const data = Array.isArray(json?.results) ? json.results : []
        collected.push(...data.filter(ep => String(ep?.season) === String(targetSeason)))
        fetchedUntilRef.current = p
      }

      setSeasonData(prev => ({
        ...prev,
        [targetSeason]: [...(prev[targetSeason] || []), ...collected]
      }))

      if (fetchedUntilRef.current >= (knownTotal || fetchedUntilRef.current)) {
        setSeasonDone(true)
      }
    } catch (e) {
      console.error(e)
      setErr('Error al cargar episodios por temporada')
    } finally {
      setSeasonLoading(false)
    }
  }

  useEffect(() => {
    if (!season) {
      setSeasonData({})
      setSeasonLoading(false)
      setSeasonDone(false)
      setSeasonUiPage(1)
      fetchedUntilRef.current = 0
      return
    }
    setSeasonData({})
    setSeasonUiPage(1)
    setSeasonDone(false)
    fetchedUntilRef.current = 0
    fetchSeasonBatch(season)
  }, [season])

  const listToRender = useMemo(() => {
    const base = season
      ? (seasonData[season] || [])
      : items
    if (!debouncedQuery) return base
    return base.filter(ep => (ep.name || '').toLowerCase().includes(debouncedQuery))
  }, [season, seasonData, items, debouncedQuery])

  const seasonTotalUiPages = season
    ? Math.max(1, Math.ceil(listToRender.length / SEASON_UI_PAGE_SIZE))
    : 1

  const pagedList = useMemo(() => {
    if (!season) return listToRender
    const start = (seasonUiPage - 1) * SEASON_UI_PAGE_SIZE
    return listToRender.slice(start, start + SEASON_UI_PAGE_SIZE)
  }, [season, listToRender, seasonUiPage])

  if (!season && loading) return <Loader label="Cargando episodios..." />
  if (season && seasonLoading && !(seasonData[season]?.length)) {
    return <Loader label={`Buscando episodios de la temporada ${season}...`} />
  }
  if (err) return <Box p={3}><Alert severity="error">{err}</Alert></Box>

  return (
    <Box p={2} width="100%">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        gap={2}
        mb={2}
      >
        <Typography variant="h5" fontWeight="bold">Episodios</Typography>

        <Stack direction="row" gap={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="season-label">Temporada</InputLabel>
            <Select
              labelId="season-label"
              label="Temporada"
              value={season}
              onChange={(e)=> { setSeason(e.target.value); setQuery('') }}
            >
              <MenuItem value="">Todas</MenuItem>
              {Array.from({ length: SEASON_OPTIONS_MAX }, (_, i) => i + 1).map(n => (
                <MenuItem key={n} value={String(n)}>{`Temporada ${n}`}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
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
        </Stack>
      </Stack>

      {listToRender.length === 0 ? (
        <Alert severity="info">
          {season ? `No se encontraron episodios en la temporada ${season} para esta búsqueda.` : 'No hay resultados para esta página.'}
        </Alert>
      ) : (
        <Grid container spacing={2}>
          {pagedList.map(ep => {
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
        {!season ? (
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
            shape="rounded"
            sx={{ '& ul':{ display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'center' } }}
          />
        ) : (
          <Pagination
            count={seasonTotalUiPages}
            page={seasonUiPage}
            onChange={(_, v) => window.scrollTo({ top: 0, behavior: 'smooth' }) || setSeasonUiPage(v)}
            color="primary"
            shape="rounded"
            sx={{ '& ul':{ display:'flex', flexDirection:'row', flexWrap:'wrap', justifyContent:'center' } }}
          />
        )}
      </Box>

      {season && !seasonDone && (
        <Box mt={2} display="flex" justifyContent="center">
          <Button
            variant="outlined"
            onClick={() => fetchSeasonBatch(season)}
            disabled={seasonLoading}
          >
            {seasonLoading ? 'Cargando…' : 'Cargar más resultados'}
          </Button>
        </Box>
      )}
    </Box>
  )
}
