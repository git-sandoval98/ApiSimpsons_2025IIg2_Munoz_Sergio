import { Box, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        gap: 2,
        background:
          'linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(250,250,250,1) 100%)',
        padding: 3,
      }}
    >
      <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
        Bienvenido al Mundo de Los Simpsons 🍩
      </Typography>

      <Typography variant="h6" color="text.secondary" maxWidth="600px">
        Explora información sobre tus personajes, episodios y locaciones favoritas
        de la serie animada más famosa del mundo.
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, marginTop: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Button
          variant="contained"
          component={Link}
          to="/personajes"
          color="primary"
          sx={{ borderRadius: '20px', paddingX: 3 }}
        >
          Ver Personajes
        </Button>

        <Button
          variant="outlined"
          component={Link}
          to="/episodios"
          color="secondary"
          sx={{ borderRadius: '20px', paddingX: 3 }}
        >
          Ver Episodios
        </Button>

        <Button
          variant="outlined"
          component={Link}
          to="/localizacion"
          color="secondary"
          sx={{ borderRadius: '20px', paddingX: 3 }}
        >
          Ver Localizaciones
        </Button>
      </Box>
    </Box>
  )
}
