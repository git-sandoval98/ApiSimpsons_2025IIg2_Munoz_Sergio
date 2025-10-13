import { forwardRef } from 'react'
import { Card } from '@mui/material'
import { motion, useReducedMotion } from 'framer-motion'

const MotionCard = motion(Card)

const AnimatedCard = forwardRef(function AnimatedCard(
  { children, delay = 0, whileHoverScale = 1.015, whileTapScale = 0.99, ...props }, ref
) {
  const prefersReduced = useReducedMotion()

  const variants = prefersReduced
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }

  return (
    <MotionCard
      ref={ref}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.25, ease: 'easeOut', delay }}
      whileHover={!prefersReduced ? { scale: whileHoverScale, boxShadow: '0 12px 28px rgba(0,0,0,.14)' } : {}}
      whileTap={!prefersReduced ? { scale: whileTapScale } : {}}
      style={{ willChange: 'transform' }}
      {...props}
    >
      {children}
    </MotionCard>
  )
})

export default AnimatedCard
