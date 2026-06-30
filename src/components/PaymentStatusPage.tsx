import { CheckCircle2, XCircle } from 'lucide-react'
import {
  loadStoredLanguage,
  translations,
} from '../lib/i18n'

type PaymentStatusPageProps = {
  status: 'success' | 'cancel'
}

export default function PaymentStatusPage({ status }: PaymentStatusPageProps) {
  const language = loadStoredLanguage()
  const t = translations[language]
  const isSuccess = status === 'success'

  return (
    <main className="min-h-screen bg-[#030712] px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[70vh] max-w-md items-center justify-center">
        <div className="w-full rounded-[1.6rem] border border-cyan-300/16 bg-[#07111f]/95 p-6 text-center shadow-[0_24px_90px_rgba(0,0,0,0.45)]">
          <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border ${
            isSuccess
              ? 'border-emerald-300/25 bg-emerald-300/10 text-emerald-300'
              : 'border-amber-300/25 bg-amber-300/10 text-amber-300'
          }`}>
            {isSuccess ? <CheckCircle2 className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
          </div>

          <p className="mt-5 text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">
            Stripe Checkout
          </p>
          <h1 className="mt-2 text-2xl font-black text-white">
            {isSuccess ? t.paymentSuccessTitle : t.paymentCancelTitle}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            {isSuccess ? t.paymentSuccessDesc : t.paymentCancelDesc}
          </p>

          <a
            href="/"
            className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-300 to-purple-400 px-5 py-3 text-sm font-black text-black"
          >
            {t.returnToApp}
          </a>
        </div>
      </div>
    </main>
  )
}
