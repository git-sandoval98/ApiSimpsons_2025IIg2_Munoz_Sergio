import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {Box, Typography, Chip, Card, CardMedia, CardContent, CircularProgress, Alert, Button, Divider} from '@mui/material'

function cdnUrl(imagePath, kind = 'character', size = 1280) {
  if (!imagePath) return ''
  let p = String(imagePath).trim()

  if (/^https?:\/\//i.test(p)) return p

  if (!p.includes('/')) p = `/${kind}/${p}`

  if (!p.startsWith('/')) p = '/' + p
  return `https://cdn.thesimpsonsapi.com/${size}${p}`
}

function resolveCharacterImage(ch, size = 1280) {
  const candidates = [
    ch?.portrait_path,
    ch?.portrait,
    ch?.image,
    ch?.imageUrl,
    ch?.image_url,
    ch?.images?.portrait,
  ].filter(Boolean)
  if (!candidates.length) return ''
  return cdnUrl(candidates[0], 'character', size)
}

export default function CharacterDetail() {
  const { id } = useParams()
  const [ch, setCh] = useState(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const placeholder = `${import.meta.env.BASE_URL}placeholder.png`

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        setLoading(true)
        setErr('')
        const res = await fetch(`https://thesimpsonsapi.com/api/characters/${id}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const json = await res.json()
        if (cancel) return

        setCh(json)
      } catch (e) {
        if (cancel) return
        console.error('Error character by id:', e)
        setErr('No se pudo cargar el personaje')
      } finally {
        if (!cancel) setLoading(false)
      }
    })()
    return () => { cancel = true }
  }, [id])

  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    )
  }

  if (err) {
    return (
      <Box p={3}>
        <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>
        <Button component={Link} to="/personajes" variant="outlined">← Volver a personajes</Button>
      </Box>
    )
  }

  if (!ch) return null

  const img = resolveCharacterImage(ch, 1280) || placeholder

  return (
    <Box p={2}>
      <Button component={Link} to="/personajes" variant="outlined" sx={{ mb: 2 }}>
        ← Volver a personajes
      </Button>

      <Card sx={{ maxWidth: 1000, mx: 'auto' }}>
        <CardMedia
          component="img"
          height="420"
          image={img}
          alt={ch.name}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = placeholder }}
        />
        <CardContent>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {ch.name}
          </Typography>

          <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
            {ch.status && <Chip label={ch.status} color={ch.status === 'Deceased' ? 'error' : 'success'} />}
            {ch.gender && <Chip label={ch.gender} />}
            {typeof ch.age === 'number' && <Chip label={`Edad: ${ch.age}`} />}
          </Box>

          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            {ch.occupation || 'Ocupación desconocida'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {Array.isArray(ch.phrases) && ch.phrases.length > 0 && (
            <>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Frases célebres</Typography>
              <ul style={{ marginTop: 8, paddingLeft: 18 }}>
                {ch.phrases.slice(0, 8).map((p, i) => (
                  <li key={i}><Typography variant="body2">“{p}”</Typography></li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
