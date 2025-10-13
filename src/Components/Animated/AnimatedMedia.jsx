import { motion, useReducedMotion } from 'framer-motion'
import { CardMedia } from '@mui/material'

const MotionMedia = motion(CardMedia)

export default function AnimatedMedia({ zoom = 1.04, ...props }) {
  const prefersReduced = useReducedMotion()
  return (
    <div style={{ overflow: 'hidden' }}>
      <MotionMedia
        {...props}
        initial={{ scale: 1 }}
        whileHover={!prefersReduced ? { scale: zoom } : {}}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        style={{ willChange: 'transform' }}
      />
    </div>
  )
}
