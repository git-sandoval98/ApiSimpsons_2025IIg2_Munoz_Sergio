import { Link } from 'react-router-dom'
import { Box, Typography, Button } from '@mui/material'
import { motion } from 'framer-motion'

const homerImg = `${import.meta.env.BASE_URL}homer-confused.png`

export default function NotFound() {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.6 }}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        textAlign: 'center',
        background: 'linear-gradient(to bottom, #fff8e1, #ffe082)',
        borderRadius: 3,
        p: 4,
        mx: 'auto',
        maxWidth: 600,
        boxShadow: '0px 6px 25px rgba(0,0,0,0.2)',
      }}
    >
      <motion.div
        initial={{ rotate: -10, scale: 0.8 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <img
          src={homerImg}
          alt="Homer Confundido"
          style={{
            width: '200px',
            borderRadius: '50%',
            marginBottom: '1rem',
            boxShadow: '0 0 20px rgba(0,0,0,0.2)',
          }}
          onError={(e) => {
            e.currentTarget.src =
              'https://upload.wikimedia.org/wikipedia/en/0/02/Homer_Simpson_2006.png'
          }}
        />
      </motion.div>

      <Typography variant="h2" color="error" fontWeight="bold">
        Error 404
      </Typography>
      <Typography variant="h5" fontWeight="bold" mt={1}>
        ¡D'oh! Página no encontrada
      </Typography>
      <Typography variant="body1" color="text.secondary" mt={1}>
        Lo sentimos, parece que Homero se comió esta página.
      </Typography>

      <Button
        component={Link}
        to="/"
        variant="contained"
        sx={{
          mt: 3,
          backgroundColor: '#1976d2',
          color: 'white',
          borderRadius: '2rem',
          px: 4,
          py: 1,
          fontWeight: 'bold',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          '&:hover': {
            backgroundColor: '#1565c0',
            transform: 'scale(1.05)',
            transition: 'all 0.2s ease-in-out',
          },
        }}
      >
        🍩 Volver al inicio
      </Button>
    </Box>
  )
}
