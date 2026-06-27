import { AnimatePresence, motion } from 'framer-motion'
import { Headphones, Volume2, VolumeX } from 'lucide-react'

type AudioGateModalProps = {
  isOpen: boolean
  onEnterWithSound: () => void
  onContinueMuted: () => void
}

export default function AudioGateModal({
  isOpen,
  onEnterWithSound,
  onContinueMuted,
}: AudioGateModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000050] flex items-end justify-center bg-black/72 px-4 pb-5 pt-8 backdrop-blur-xl sm:items-center sm:pb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-cyan-300/20 bg-[#07111f]/95 p-5 text-white shadow-[0_28px_120px_rgba(34,211,238,0.20)] ring-1 ring-white/10"
            initial={{ y: 28, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 28, scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_90%_20%,rgba(168,85,247,0.22),transparent_32%),linear-gradient(135deg,rgba(15,23,42,0.82),rgba(3,7,18,0.98))]" />
            <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-cyan-300/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-purple-400/10 blur-2xl" />

            <div className="relative z-10">
              <div className="mb-4 flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-2xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-100 shadow-[0_0_30px_rgba(34,211,238,0.22)]">
                  <Headphones className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">
                    Audio Experience
                  </p>
                  <h2 className="mt-1 text-2xl font-black leading-tight text-white">
                    Enter With Sound
                  </h2>
                </div>
              </div>

              <p className="text-sm leading-6 text-slate-300">
                Enable lobby music, button clicks, pack opening effects, card flip sounds, rare hit effects and auction bid feedback for the full TCG demo experience.
              </p>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.055] p-4">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.07] px-2 py-3">
                    <Volume2 className="mx-auto h-5 w-5 text-cyan-200" />
                    <p className="mt-1.5 text-[10px] font-black text-slate-300">BGM</p>
                  </div>
                  <div className="rounded-2xl border border-purple-300/15 bg-purple-300/[0.07] px-2 py-3">
                    <Volume2 className="mx-auto h-5 w-5 text-purple-200" />
                    <p className="mt-1.5 text-[10px] font-black text-slate-300">SFX</p>
                  </div>
                  <div className="rounded-2xl border border-yellow-300/15 bg-yellow-300/[0.07] px-2 py-3">
                    <Volume2 className="mx-auto h-5 w-5 text-yellow-200" />
                    <p className="mt-1.5 text-[10px] font-black text-slate-300">Rare Hit</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={onEnterWithSound}
                  data-audio-silent="true"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-500 px-5 py-4 text-sm font-black text-black shadow-[0_18px_45px_rgba(34,211,238,0.18)]"
                >
                  <Volume2 className="h-5 w-5" />
                  Enter With Sound
                </button>

                <button
                  type="button"
                  onClick={onContinueMuted}
                  data-audio-silent="true"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-black/25 px-5 py-3.5 text-sm font-black text-slate-300"
                >
                  <VolumeX className="h-5 w-5" />
                  Continue Muted
                </button>
              </div>

              <p className="mt-4 text-center text-[11px] leading-5 text-slate-500">
                Browsers only allow sound after a player taps. You can change this later in Account.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
