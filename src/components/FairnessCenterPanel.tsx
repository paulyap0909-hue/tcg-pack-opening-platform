import { motion } from 'framer-motion'
import {
  CheckCircle2,
  Dice5,
  Hash,
  KeyRound,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'

export type FairnessRecord = {
  id: string
  verificationId: string
  packName: string
  cardName: string
  rarity: string
  grade: string
  serverSeedHash: string
  clientSeed: string
  nonce: number
  openedAt: string
  resultSummary: string
  status: 'Verified Demo'
}

type FairnessCenterPanelProps = {
  records: FairnessRecord[]
}

export default function FairnessCenterPanel({
  records,
}: FairnessCenterPanelProps) {
  const latestRecords = records.slice(0, 8)
  const rareRecords = records.filter((record) => {
    const rarity = record.rarity.toLowerCase()

    return rarity.includes('secret') || rarity.includes('super')
  })

  return (
    <section className="mx-auto w-full max-w-7xl px-5 py-8 lg:px-8">
      <motion.div
        className="hud-panel hud-corners overflow-hidden rounded-[2rem] p-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              <p className="hud-label text-sm">Provably Fair Center</p>
            </div>

            <h2 className="text-3xl font-black text-white sm:text-4xl">
              Every pull gets a verification record.
            </h2>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              V1 demo generates a fairness record for every opened card using a
              server seed hash, client seed, nonce, verification ID, and result
              summary. Backend V2 can replace this with real server-side SHA-256
              verification.
            </p>
          </div>

          <div className="grid min-w-[280px] grid-cols-2 gap-3">
            <div className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.04] p-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                Records
              </p>
              <p className="mt-2 text-2xl font-black text-emerald-300">
                {records.length}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-4">
              <p className="text-[10px] uppercase tracking-[0.25em] text-slate-500">
                Rare+
              </p>
              <p className="mt-2 text-2xl font-black text-amber-300">
                {rareRecords.length}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
              <Hash className="h-5 w-5 text-cyan-300" />
            </div>
            <h3 className="font-black text-white">Server Seed Hash</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              The server seed is hidden during opening. The hash is shown first
              so users can later verify the result was not changed.
            </p>
          </div>

          <div className="rounded-2xl border border-purple-300/10 bg-purple-300/[0.04] p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-purple-300/20 bg-purple-300/10">
              <KeyRound className="h-5 w-5 text-purple-300" />
            </div>
            <h3 className="font-black text-white">Client Seed</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              A client seed is paired with the server seed and nonce to produce
              a deterministic result path in the verification flow.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-300/10 bg-amber-300/[0.04] p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10">
              <Dice5 className="h-5 w-5 text-amber-300" />
            </div>
            <h3 className="font-black text-white">Nonce</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Each opening receives a unique nonce, preventing repeated results
              from sharing the same verification signature.
            </p>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-emerald-300/10 bg-black/30 p-4">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-emerald-300">
                Latest Verification Records
              </p>
              <h3 className="mt-1 text-xl font-black text-white">
                Recent Fairness Logs
              </h3>
            </div>
            <Sparkles className="h-5 w-5 text-emerald-300" />
          </div>

          {latestRecords.length === 0 ? (
            <div className="rounded-2xl border border-slate-700/60 bg-slate-950/60 p-6 text-center">
              <p className="text-sm text-slate-400">
                Open a pack to generate your first fairness record.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {latestRecords.map((record, index) => (
                <motion.div
                  key={record.id}
                  className="rounded-2xl border border-emerald-300/10 bg-emerald-300/[0.035] p-4"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.025 }}
                >
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-emerald-300">
                          {record.status}
                        </span>
                        <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-amber-200">
                          {record.rarity}
                        </span>
                      </div>

                      <h4 className="break-words text-base font-black text-white">
                        {record.resultSummary}
                      </h4>

                      <p className="mt-1 break-words text-xs uppercase tracking-[0.2em] text-cyan-300">
                        {record.packName} · {record.openedAt}
                      </p>
                    </div>

                    <div className="rounded-xl border border-cyan-300/10 bg-cyan-300/[0.04] px-3 py-2 text-xs text-cyan-200">
                      {record.verificationId}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-3">
                    <div className="rounded-xl border border-slate-700/60 bg-slate-950/60 p-3">
                      <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-slate-500">
                        Server Seed Hash
                      </p>
                      <p className="break-all text-xs text-slate-300">
                        {record.serverSeedHash}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-700/60 bg-slate-950/60 p-3">
                      <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-slate-500">
                        Client Seed
                      </p>
                      <p className="break-all text-xs text-slate-300">
                        {record.clientSeed}
                      </p>
                    </div>

                    <div className="rounded-xl border border-slate-700/60 bg-slate-950/60 p-3">
                      <p className="mb-1 text-[10px] uppercase tracking-[0.22em] text-slate-500">
                        Nonce
                      </p>
                      <p className="text-xs text-slate-300">
                        {record.nonce}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-5 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-cyan-300" />
            <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
              V1 Scope
            </p>
          </div>
          <p className="text-sm leading-6 text-slate-400">
            This version is a front-end provably fair demo. In Supabase Backend
            Phase, the server seed should be generated and locked server-side,
            then revealed after the opening for public verification.
          </p>
        </div>
      </motion.div>
    </section>
  )
}
