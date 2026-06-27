import { AnimatePresence, motion } from 'framer-motion'
import {
  AlertTriangle,
  ShieldCheck,
  Truck,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { translations, type AppLanguage } from '../lib/i18n'

import type { ShippingInfo, VaultCard } from './VaultDrawer'

type ShippingConfirmModalProps = {
  language: AppLanguage
  card: VaultCard | null
  onClose: () => void
  onConfirm: (shippingInfo: ShippingInfo) => void
}

const initialShippingInfo: ShippingInfo = {
  fullName: '',
  phone: '',
  email: '',
  address: '',
  postcode: '',
  city: '',
  state: '',
  remark: '',
}

export default function ShippingConfirmModal({
  language,
  card,
  onClose,
  onConfirm,
}: ShippingConfirmModalProps) {
  const t = translations[language]
  const [shippingInfo, setShippingInfo] =
    useState<ShippingInfo>(initialShippingInfo)

  useEffect(() => {
    if (!card) return

    setShippingInfo(card.shippingInfo ?? initialShippingInfo)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [card, onClose])

  if (!card) return null

  const updateField = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo((currentInfo) => ({
      ...currentInfo,
      [field]: value,
    }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    onConfirm({
      ...shippingInfo,
      fullName: shippingInfo.fullName.trim(),
      phone: shippingInfo.phone.trim(),
      email: shippingInfo.email.trim(),
      address: shippingInfo.address.trim(),
      postcode: shippingInfo.postcode.trim(),
      city: shippingInfo.city.trim(),
      state: shippingInfo.state.trim(),
      remark: shippingInfo.remark?.trim() ?? '',
    })
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999999] flex items-center justify-center overflow-y-auto bg-black/85 px-4 py-6 backdrop-blur-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.form
          onSubmit={handleSubmit}
          className="hud-panel hud-corners relative w-full max-w-5xl rounded-[2rem] p-6"
          initial={{ scale: 0.92, y: 24 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.92, y: 24 }}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={t.cancel}
            className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-cyan-300/40 bg-slate-950/95 text-cyan-100 shadow-[0_0_35px_rgba(34,211,238,0.35)] transition hover:scale-105 hover:bg-cyan-300/10"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="border-b border-cyan-300/10 pb-5 pr-14">
            <div className="mb-3 flex items-center gap-2">
              <Truck className="h-5 w-5 text-cyan-300" />
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-300">
                {t.shippingAddressForm}
              </p>
            </div>

            <h2 className="text-3xl font-black text-white">
              {t.requestPhysicalShipping}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              {t.shippingFormDesc}
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
            <div>
              <div className="hud-rarity-glow flex min-h-[280px] items-center justify-center overflow-hidden rounded-3xl border border-cyan-300/15 bg-black/60 p-3">
                <img
                  src={card.image}
                  alt={card.name}
                  className="max-h-[260px] w-auto object-contain"
                />
              </div>

              <div className="mt-4 rounded-2xl border border-cyan-300/10 bg-cyan-300/[0.04] p-4">
                <p className="text-sm font-black text-white">{card.name}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-cyan-300">
                  {card.rarity} · {card.grade}
                </p>
                <p className="mt-3 text-xs text-slate-400">
                  {t.source}: {card.sourcePack}
                </p>
              </div>
            </div>

            <div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                    {t.fullName}
                  </span>
                  <input
                    required
                    value={shippingInfo.fullName}
                    onChange={(event) =>
                      updateField('fullName', event.target.value)
                    }
                    className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
                    placeholder={t.recipientName}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                    {t.phone}
                  </span>
                  <input
                    required
                    value={shippingInfo.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
                    placeholder={t.phoneNumberPlaceholder}
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                    {t.email}
                  </span>
                  <input
                    required
                    type="email"
                    value={shippingInfo.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
                    placeholder={t.emailAddress}
                  />
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                    {t.shippingAddress}
                  </span>
                  <textarea
                    required
                    value={shippingInfo.address}
                    onChange={(event) =>
                      updateField('address', event.target.value)
                    }
                    rows={3}
                    className="w-full resize-none rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
                    placeholder={t.fullShippingAddress}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                    {t.postcode}
                  </span>
                  <input
                    required
                    value={shippingInfo.postcode}
                    onChange={(event) =>
                      updateField('postcode', event.target.value)
                    }
                    className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
                    placeholder={t.postcode}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                    {t.city}
                  </span>
                  <input
                    required
                    value={shippingInfo.city}
                    onChange={(event) => updateField('city', event.target.value)}
                    className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
                    placeholder={t.city}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                    {t.state}
                  </span>
                  <input
                    required
                    value={shippingInfo.state}
                    onChange={(event) => updateField('state', event.target.value)}
                    className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
                    placeholder={t.state}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-black uppercase tracking-[0.22em] text-cyan-300">
                    {t.remark}
                  </span>
                  <input
                    value={shippingInfo.remark ?? ''}
                    onChange={(event) => updateField('remark', event.target.value)}
                    className="w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
                    placeholder={t.optionalNote}
                  />
                </label>
              </div>

              <div className="mt-5 rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-4">
                <div className="mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-300" />
                  <p className="text-xs uppercase tracking-[0.25em] text-amber-300">
                    {t.important}
                  </p>
                </div>

                <p className="text-sm leading-6 text-slate-300">
                  {t.shippingImportant}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-cyan-300/30 bg-cyan-300/10 px-6 py-4 font-black text-cyan-200 transition hover:scale-[1.02] hover:bg-cyan-300/20"
            >
              {t.cancel}
            </button>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-400 px-6 py-4 font-black text-black shadow-[0_0_40px_rgba(34,211,238,0.28)] transition hover:scale-[1.02]"
            >
              <ShieldCheck className="h-5 w-5" />
              {t.confirmShippingRequest}
            </button>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  )
}
