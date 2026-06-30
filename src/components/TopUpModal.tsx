import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  CreditCard,
  Gem,
  Sparkles,
  Wallet,
  X,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { translations, type AppLanguage, type Translation } from '../lib/i18n'
import { createStripeTopUpCheckoutSession } from '../lib/paymentClient'
import {
  DEFAULT_TOP_UP_PACKAGE_ID,
  TOP_UP_PACKAGES,
  type TopUpPackage,
  type TopUpPackageId,
} from '../lib/topUpPackages'

type TopUpModalProps = {
  isOpen: boolean
  language: AppLanguage
  onClose: () => void
  onTopUp?: (points: number) => void
}

const packageIconMap = {
  gem: Gem,
  spark: Sparkles,
  wallet: Wallet,
  zap: Zap,
}

const formatPoints = (value: number) => value.toLocaleString()
const formatPrice = (value: number) => `RM${value.toLocaleString()}`

const getPackageLabel = (topUpPackage: TopUpPackage, t: Translation) => {
  return t[topUpPackage.labelKey]
}

const getBadgeLabel = (topUpPackage: TopUpPackage, t: Translation) => {
  if (!topUpPackage.badgeKey) return null

  return t[topUpPackage.badgeKey]
}

export default function TopUpModal({
  isOpen,
  language,
  onClose,
}: TopUpModalProps) {
  const t = translations[language]
  const [selectedPackageId, setSelectedPackageId] =
    useState<TopUpPackageId>(DEFAULT_TOP_UP_PACKAGE_ID)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')

  const selectedPackage = useMemo(() => {
    return (
      TOP_UP_PACKAGES.find((item) => item.id === selectedPackageId) ??
      TOP_UP_PACKAGES[0]
    )
  }, [selectedPackageId])

  useEffect(() => {
    if (!isOpen) return

    setCheckoutError('')
    setIsRedirecting(false)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleConfirm = async () => {
    if (isRedirecting) return

    try {
      setCheckoutError('')
      setIsRedirecting(true)

      const checkoutUrl = await createStripeTopUpCheckoutSession(selectedPackage.id)
      window.location.href = checkoutUrl
    } catch (error) {
      console.error(error)
      setCheckoutError(t.stripeTopUpError)
      setIsRedirecting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[1000000] flex items-end justify-center bg-black/78 px-0 py-0 backdrop-blur-xl sm:items-center sm:px-4 sm:py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative flex h-[86svh] w-full max-w-[540px] flex-col overflow-hidden rounded-t-[2rem] border border-orange-300/25 bg-[#120906] text-white shadow-[0_-30px_120px_rgba(249,115,22,0.22)] sm:h-auto sm:max-h-[88vh] sm:rounded-[2rem]"
            initial={{ y: 80, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 80, scale: 0.98 }}
            transition={{ type: 'spring', damping: 26, stiffness: 260 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(249,115,22,0.28),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.06),transparent_28%)]" />

            <div className="relative z-10 flex h-12 shrink-0 items-center justify-center border-b border-white/8">
              <div className="absolute top-3 h-1 w-14 rounded-full bg-white/25" />
              <button
                type="button"
                onClick={onClose}
                aria-label={t.cancel}
                className="absolute right-4 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative z-10 flex-1 overflow-y-auto px-4 pb-4">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-orange-200/80">
                  {t.walletTopUp}
                </p>
                <h2 className="mt-1 text-3xl font-black tracking-tight">
                  {t.topUp}
                </h2>
                <p className="mt-1 text-xs text-orange-100/60">
                  {t.topUpSubtitle}
                </p>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {TOP_UP_PACKAGES.map((item) => {
                  const isSelected = item.id === selectedPackageId
                  const Icon = packageIconMap[item.icon]
                  const badgeLabel = getBadgeLabel(item, t)

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setSelectedPackageId(item.id)}
                      className={`relative min-h-[134px] rounded-2xl border p-2.5 text-center transition active:scale-95 ${
                        isSelected
                          ? 'border-orange-200 bg-orange-300/16 shadow-[0_0_32px_rgba(249,115,22,0.22)]'
                          : 'border-orange-200/28 bg-white/[0.045]'
                      }`}
                    >
                      {badgeLabel && (
                        <span className="absolute -top-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-orange-400 px-2 py-0.5 text-[8px] font-black uppercase tracking-[0.12em] text-black">
                          {badgeLabel}
                        </span>
                      )}

                      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl border border-orange-200/20 bg-black/25">
                        <Icon className="h-5 w-5 text-orange-200" />
                      </div>

                      <p className="mt-1.5 text-[11px] font-black text-white">
                        {getPackageLabel(item, t)}
                      </p>

                      <p className="mt-1 text-xl font-black text-orange-300">
                        {formatPoints(item.points)}
                      </p>

                      <p className="mt-1 rounded-full border border-orange-200/18 bg-orange-200/8 px-1 py-0.5 text-[10px] font-black text-orange-100/85">
                        {item.bonusPoints > 0
                          ? `+${formatPoints(item.bonusPoints)} ${t.bonus}`
                          : item.bonusPoints === 0
                            ? t.receive
                            : t.selectPackage}
                      </p>

                      <p className="mt-2 text-sm font-black text-white">
                        {formatPrice(item.amountMyr)}
                      </p>
                    </button>
                  )
                })}
              </div>

              <button
                type="button"
                className="mt-3 flex w-full items-center justify-between rounded-2xl border border-orange-200/28 bg-white/[0.06] px-4 py-3 text-left"
              >
                <div>
                  <p className="text-lg font-black text-white">{t.customAmount}</p>
                  <p className="text-xs text-orange-100/55">{t.minAmount}</p>
                </div>
                <Gem className="h-8 w-8 text-orange-300" />
              </button>

              <div className="mt-3 rounded-2xl border border-orange-200/18 bg-black/20 p-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.24em] text-orange-100/45">
                      {t.selectedPackage}
                    </p>
                    <p className="mt-1 text-lg font-black text-white">
                      {getPackageLabel(selectedPackage, t)} · {formatPrice(selectedPackage.amountMyr)}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-100/45">
                      {t.receive}
                    </p>
                    <p className="mt-1 text-lg font-black text-orange-200">
                      {formatPoints(selectedPackage.points)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-xl border border-emerald-300/18 bg-emerald-300/10 px-3 py-2 text-xs font-black text-emerald-200">
                  <CheckCircle2 className="mr-1 inline h-4 w-4" />
                  {t.stripeCheckoutNotice}
                </div>

                {checkoutError && (
                  <div className="mt-3 rounded-xl border border-rose-300/20 bg-rose-300/10 px-3 py-2 text-xs font-black text-rose-200">
                    {checkoutError}
                  </div>
                )}
              </div>
            </div>

            <div className="relative z-10 shrink-0 border-t border-white/8 bg-[#120906]/95 px-4 pb-[calc(14px+env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl">
              <button
                type="button"
                data-audio-silent="true"
                disabled={isRedirecting}
                onClick={handleConfirm}
                className={`flex w-full items-center justify-center gap-2 rounded-full px-5 py-4 text-sm font-black uppercase tracking-[0.12em] text-black shadow-[0_16px_38px_rgba(249,115,22,0.32)] transition ${
                  isRedirecting
                    ? 'cursor-wait bg-slate-500 text-slate-900'
                    : 'bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-300'
                }`}
              >
                <CreditCard className="h-5 w-5" />
                {isRedirecting ? t.redirectingToStripe : t.continueToStripe}
              </button>

              <p className="mt-2 text-center text-[10px] text-orange-100/45">
                {t.processingFeeNotice}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
