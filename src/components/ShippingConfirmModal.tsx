import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, PackageOpen, ShieldCheck, Truck, X } from 'lucide-react'
import { type FormEvent, useEffect, useState } from 'react'

import { translations, type AppLanguage } from '../lib/i18n'
import { getLocalizedCardGrade, getLocalizedCardRarity, type ShippingInfo, type VaultCard } from './VaultDrawer'

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

  const inputClass =
    'h-12 w-full rounded-2xl border border-cyan-300/20 bg-black/40 px-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60'
  const labelClass =
    'mb-1.5 block text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300'

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999999] flex items-end justify-center bg-black/85 px-3 pb-3 pt-6 backdrop-blur-xl sm:items-center sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.form
          onSubmit={handleSubmit}
          className="hud-panel hud-corners flex max-h-[92svh] w-full max-w-md flex-col overflow-hidden rounded-[1.45rem]"
          initial={{ y: 80, scale: 0.98 }}
          animate={{ y: 0, scale: 1 }}
          exit={{ y: 80, scale: 0.98 }}
          transition={{ type: 'spring', damping: 26, stiffness: 260 }}
        >
          <div className="flex shrink-0 items-start justify-between gap-3 border-b border-cyan-300/10 px-4 py-4">
            <div className="min-w-0">
              <div className="mb-1.5 flex items-center gap-2">
                <Truck className="h-4 w-4 text-cyan-300" />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
                  {t.shippingAddressForm}
                </p>
              </div>

              <h2 className="text-xl font-black leading-tight text-white">
                {t.requestPhysicalShipping}
              </h2>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label={t.cancel}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cyan-300/25 bg-slate-950/95 text-cyan-100"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <div className="grid grid-cols-[92px_1fr] gap-3 rounded-2xl border border-cyan-300/12 bg-cyan-300/[0.035] p-3">
              <div className="hud-rarity-glow flex h-[126px] items-center justify-center overflow-hidden rounded-2xl border border-cyan-300/15 bg-black/55 p-2">
                <img
                  src={card.image}
                  alt={card.name}
                  className="max-h-[118px] w-auto object-contain"
                />
              </div>

              <div className="min-w-0 self-center">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-amber-200">
                    {getLocalizedCardRarity(card.rarity, t)}
                  </span>
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest text-cyan-200">
                    {getLocalizedCardGrade(card.grade, t)}
                  </span>
                </div>

                <h3 className="truncate text-lg font-black text-white">{card.name}</h3>

                <div className="mt-2 flex items-start gap-1.5 text-xs leading-4 text-slate-400">
                  <PackageOpen className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-300" />
                  <span className="line-clamp-2">{card.sourcePack}</span>
                </div>
              </div>
            </div>

            <p className="mt-3 rounded-2xl border border-amber-300/15 bg-amber-300/[0.055] px-3 py-2 text-xs leading-5 text-amber-100/85">
              {t.shippingFormDesc}
            </p>

            <div className="mt-4 grid gap-3">
              <label className="block">
                <span className={labelClass}>{t.fullName}</span>
                <input
                  required
                  value={shippingInfo.fullName}
                  onChange={(event) => updateField('fullName', event.target.value)}
                  className={inputClass}
                  placeholder={t.recipientName}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className={labelClass}>{t.phone}</span>
                  <input
                    required
                    value={shippingInfo.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    className={inputClass}
                    placeholder={t.phoneNumberPlaceholder}
                  />
                </label>

                <label className="block">
                  <span className={labelClass}>{t.email}</span>
                  <input
                    required
                    type="email"
                    value={shippingInfo.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    className={inputClass}
                    placeholder={t.emailAddress}
                  />
                </label>
              </div>

              <label className="block">
                <span className={labelClass}>{t.shippingAddress}</span>
                <textarea
                  required
                  value={shippingInfo.address}
                  onChange={(event) => updateField('address', event.target.value)}
                  rows={3}
                  className="min-h-[86px] w-full resize-none rounded-2xl border border-cyan-300/20 bg-black/40 px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60"
                  placeholder={t.fullShippingAddress}
                />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className={labelClass}>{t.postcode}</span>
                  <input
                    required
                    value={shippingInfo.postcode}
                    onChange={(event) => updateField('postcode', event.target.value)}
                    className={inputClass}
                    placeholder={t.postcode}
                  />
                </label>

                <label className="block">
                  <span className={labelClass}>{t.city}</span>
                  <input
                    required
                    value={shippingInfo.city}
                    onChange={(event) => updateField('city', event.target.value)}
                    className={inputClass}
                    placeholder={t.city}
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className={labelClass}>{t.state}</span>
                  <input
                    required
                    value={shippingInfo.state}
                    onChange={(event) => updateField('state', event.target.value)}
                    className={inputClass}
                    placeholder={t.state}
                  />
                </label>

                <label className="block">
                  <span className={labelClass}>{t.remark}</span>
                  <input
                    value={shippingInfo.remark ?? ''}
                    onChange={(event) => updateField('remark', event.target.value)}
                    className={inputClass}
                    placeholder={t.optionalNote}
                  />
                </label>
              </div>
            </div>

            <div className="mt-3 rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-3">
              <div className="mb-1.5 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-300" />
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-300">
                  {t.important}
                </p>
              </div>

              <p className="text-xs leading-5 text-slate-300">
                {t.shippingImportant}
              </p>
            </div>
          </div>

          <div className="shrink-0 border-t border-white/10 bg-[#07111f]/95 p-3">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-4 py-3 text-sm font-black text-cyan-200"
              >
                {t.cancel}
              </button>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-400 px-4 py-3 text-sm font-black text-black shadow-[0_0_30px_rgba(34,211,238,0.24)]"
              >
                <ShieldCheck className="h-4 w-4" />
                {t.confirmShippingRequest}
              </button>
            </div>
          </div>
        </motion.form>
      </motion.div>
    </AnimatePresence>
  )
}
