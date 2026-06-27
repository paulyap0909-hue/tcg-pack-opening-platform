import { motion } from 'framer-motion'

const particles = Array.from({ length: 42 }, (_, index) => {
  const left = (index * 17) % 100
  const top = (index * 31) % 100
  const size = 2 + (index % 4)
  const duration = 5 + (index % 7)
  const delay = (index % 9) * 0.35

  return {
    id: index,
    left,
    top,
    size,
    duration,
    delay,
  }
})

export default function SciFiBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[560px] w-[560px] -translate-x-1/2 rounded-full bg-cyan-500/20 blur-[130px]" />
      <div className="absolute bottom-0 right-0 h-[560px] w-[560px] rounded-full bg-purple-600/20 blur-[150px]" />
      <div className="absolute left-0 top-1/3 h-[420px] w-[420px] rounded-full bg-red-500/10 blur-[130px]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,7,17,0.22)_45%,rgba(5,7,17,0.9)_100%)]" />

      <div className="absolute inset-0 opacity-40">
        <div className="absolute left-[8%] top-[18%] h-px w-[28%] bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent" />
        <div className="absolute right-[6%] top-[32%] h-px w-[34%] bg-gradient-to-r from-transparent via-purple-300/30 to-transparent" />
        <div className="absolute bottom-[22%] left-[15%] h-px w-[45%] bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent" />

        <div className="absolute left-[16%] top-[18%] h-20 w-px bg-gradient-to-b from-cyan-300/30 to-transparent" />
        <div className="absolute right-[24%] top-[32%] h-24 w-px bg-gradient-to-b from-purple-300/25 to-transparent" />
        <div className="absolute bottom-[22%] left-[47%] h-28 w-px bg-gradient-to-b from-cyan-300/20 to-transparent" />
      </div>

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.75)]"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-12, 18, -12],
            opacity: [0.15, 0.85, 0.15],
            scale: [0.8, 1.35, 0.8],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      <motion.div
        className="absolute left-[-20%] top-[45%] h-px w-[140%] bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent"
        animate={{
          x: ['-20%', '20%'],
          opacity: [0, 0.7, 0],
        }}
        transition={{
          duration: 5.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  )
}