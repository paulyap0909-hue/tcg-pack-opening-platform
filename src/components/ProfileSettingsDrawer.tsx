import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  ChevronRight,
  Gem,
  Globe2,
  LockKeyhole,
  LogOut,
  MapPin,
  Music2,
  Phone,
  RotateCcw,
  ShieldCheck,
  Truck,
  UserCircle,
  Volume2,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'

type ProfileSettingsDrawerProps = {
  isOpen: boolean
  onClose: () => void
  isSoundEnabled: boolean
  onToggleSound: () => void
  onOpenShippingCenter: () => void
  onResetDemoData: () => void
  walletBalance: number
  shippingRequestCount: number
}

type ToggleRowProps = {
  label: string
  description?: string
  enabled: boolean
  onToggle: () => void
  accent?: 'cyan' | 'yellow' | 'purple' | 'emerald'
}

type SettingsRowProps = {
  icon: typeof UserCircle
  title: string
  subtitle?: string
  value?: string
  danger?: boolean
  onClick?: () => void
}

const notificationDefaults = {
  packResult: true,
  auctionBid: true,
  raffleReward: true,
  shippingUpdate: true,
  eventPromo: false,
}

const soundDefaults = {
  backgroundMusic: true,
  soundEffects: true,
  packOpeningSounds: true,
  auctionSounds: true,
}

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
  accent = 'cyan',
}: ToggleRowProps) {
  const colorMap = {
    cyan: 'bg-cyan-300 shadow-[0_0_24px_rgba(103,232,249,0.45)]',
    yellow: 'bg-yellow-300 shadow-[0_0_24px_rgba(250,204,21,0.45)]',
    purple: 'bg-purple-300 shadow-[0_0_24px_rgba(216,180,254,0.45)]',
    emerald: 'bg-emerald-300 shadow-[0_0_24px_rgba(110,231,183,0.45)]',
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between gap-4 border-b border-white/10 px-4 py-3.5 text-left last:border-b-0"
    >
      <span className="min-w-0">
        <span className="block text-sm font-black text-white">{label}</span>
        {description && (
          <span className="mt-0.5 block text-xs leading-5 text-slate-400">
            {description}
          </span>
        )}
      </span>

      <span
        className={`relative h-7 w-12 shrink-0 rounded-full border transition ${
          enabled
            ? 'border-white/15 bg-white/15'
            : 'border-white/10 bg-white/[0.06]'
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full transition ${
            enabled ? `left-6 ${colorMap[accent]}` : 'left-1 bg-slate-500'
          }`}
        />
      </span>
    </button>
  )
}

function SettingsRow({
  icon: Icon,
  title,
  subtitle,
  value,
  danger,
  onClick,
}: SettingsRowProps) {
  const content = (
    <>
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border ${
          danger
            ? 'border-red-300/20 bg-red-300/10 text-red-200'
            : 'border-cyan-300/16 bg-cyan-300/[0.07] text-cyan-200'
        }`}
      >
        <Icon className="h-5 w-5" />
      </span>

      <span className="min-w-0 flex-1">
        <span
          className={`block text-sm font-black ${
            danger ? 'text-red-200' : 'text-white'
          }`}
        >
          {title}
        </span>
        {subtitle && (
          <span className="mt-0.5 block text-xs leading-5 text-slate-400">
            {subtitle}
          </span>
        )}
      </span>

      {value && (
        <span className="max-w-[110px] truncate text-right text-xs font-black text-slate-400">
          {value}
        </span>
      )}

      {onClick && <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />}
    </>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-3 border-b border-white/10 px-4 py-3.5 text-left last:border-b-0"
      >
        {content}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5 last:border-b-0">
      {content}
    </div>
  )
}

export default function ProfileSettingsDrawer({
  isOpen,
  onClose,
  isSoundEnabled,
  onToggleSound,
  onOpenShippingCenter,
  onResetDemoData,
  walletBalance,
  shippingRequestCount,
}: ProfileSettingsDrawerProps) {
  const [notifications, setNotifications] = useState(notificationDefaults)
  const [soundOptions, setSoundOptions] = useState(soundDefaults)

  useEffect(() => {
    if (!isOpen) return

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

  const toggleNotification = (key: keyof typeof notificationDefaults) => {
    setNotifications((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  const toggleSoundOption = (key: keyof typeof soundDefaults) => {
    setSoundOptions((current) => ({
      ...current,
      [key]: !current[key],
    }))
  }

  const handleMainSoundToggle = () => {
    onToggleSound()
    setSoundOptions((current) => ({
      ...current,
      backgroundMusic: !isSoundEnabled,
      soundEffects: !isSoundEnabled,
      packOpeningSounds: !isSoundEnabled,
      auctionSounds: !isSoundEnabled,
    }))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[999999] bg-[#030712] text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(34,211,238,0.22),transparent_28%),radial-gradient(circle_at_82%_0%,rgba(168,85,247,0.22),transparent_32%),linear-gradient(180deg,#030712,#07111f_48%,#050816)]" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.1] [background-image:linear-gradient(rgba(103,232,249,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(103,232,249,0.18)_1px,transparent_1px)] [background-size:54px_54px]" />

          <motion.div
            className="relative mx-auto flex h-full w-full max-w-md flex-col"
            initial={{ y: 28 }}
            animate={{ y: 0 }}
            exit={{ y: 28 }}
          >
            <div className="sticky top-0 z-20 border-b border-white/10 bg-[#030712]/92 px-4 pb-3 pt-4 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.07] text-white"
                  aria-label="Close account settings"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-200">
                    Player Profile
                  </p>
                  <h2 className="text-xl font-black tracking-tight text-white">
                    Account Settings
                  </h2>
                </div>

                <div className="h-11 w-11" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-28 pt-4 [-webkit-overflow-scrolling:touch]">
              <div className="overflow-hidden rounded-[1.6rem] border border-cyan-300/18 bg-cyan-300/[0.06] p-4 shadow-[0_22px_70px_rgba(34,211,238,0.12)]">
                <div className="flex items-center gap-3">
                  <img
                    src="https://api.dicebear.com/9.x/adventurer/svg?seed=detailedpower3615&radius=50&backgroundColor=8b5cf6"
                    alt="detailedpower3615"
                    className="h-16 w-16 shrink-0 rounded-3xl border border-purple-300/25 bg-purple-300/10 shadow-[0_0_32px_rgba(168,85,247,0.26)]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-black text-white">
                      detailedpower3615
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-400">
                      Demo account · Level 01
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-2.5 py-1 text-xs font-black text-cyan-200">
                      <Gem className="h-3.5 w-3.5" />
                      {walletBalance.toLocaleString()} points
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-black text-white"
                >
                  Edit Profile
                </button>
              </div>

              <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045]">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <Bell className="h-5 w-5 text-yellow-200" />
                  <p className="text-sm font-black text-white">Notifications</p>
                </div>

                <ToggleRow
                  label="Pack Opening Result"
                  description="Rare pull and vault save alerts."
                  enabled={notifications.packResult}
                  onToggle={() => toggleNotification('packResult')}
                  accent="yellow"
                />
                <ToggleRow
                  label="Auction Bid Updates"
                  description="Outbid, winning and ending soon alerts."
                  enabled={notifications.auctionBid}
                  onToggle={() => toggleNotification('auctionBid')}
                  accent="yellow"
                />
                <ToggleRow
                  label="Raffle Rewards"
                  enabled={notifications.raffleReward}
                  onToggle={() => toggleNotification('raffleReward')}
                  accent="purple"
                />
                <ToggleRow
                  label="Shipping Updates"
                  enabled={notifications.shippingUpdate}
                  onToggle={() => toggleNotification('shippingUpdate')}
                  accent="cyan"
                />
                <ToggleRow
                  label="Promotions & Events"
                  enabled={notifications.eventPromo}
                  onToggle={() => toggleNotification('eventPromo')}
                  accent="emerald"
                />
              </div>

              <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045]">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <Music2 className="h-5 w-5 text-cyan-200" />
                  <p className="text-sm font-black text-white">Sound & Music</p>
                </div>

                <ToggleRow
                  label="Master Sound"
                  description="Controls music and all sound effects."
                  enabled={isSoundEnabled}
                  onToggle={handleMainSoundToggle}
                  accent="cyan"
                />
                <ToggleRow
                  label="Background Music"
                  enabled={isSoundEnabled && soundOptions.backgroundMusic}
                  onToggle={() => toggleSoundOption('backgroundMusic')}
                  accent="cyan"
                />
                <ToggleRow
                  label="Sound Effects"
                  enabled={isSoundEnabled && soundOptions.soundEffects}
                  onToggle={() => toggleSoundOption('soundEffects')}
                  accent="purple"
                />
                <ToggleRow
                  label="Pack Opening Sounds"
                  enabled={isSoundEnabled && soundOptions.packOpeningSounds}
                  onToggle={() => toggleSoundOption('packOpeningSounds')}
                  accent="yellow"
                />
                <ToggleRow
                  label="Auction Sounds"
                  enabled={isSoundEnabled && soundOptions.auctionSounds}
                  onToggle={() => toggleSoundOption('auctionSounds')}
                  accent="emerald"
                />
              </div>

              <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045]">
                <SettingsRow
                  icon={Phone}
                  title="Phone Number"
                  subtitle="Verification will be connected in production."
                  value="Not linked"
                />
                <SettingsRow
                  icon={ShieldCheck}
                  title="Account Verification"
                  subtitle="Demo account for boss preview."
                  value="Demo"
                />
                <SettingsRow
                  icon={LockKeyhole}
                  title="Change Password"
                  subtitle="Coming soon with real login."
                  value="Soon"
                />
              </div>

              <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045]">
                <SettingsRow
                  icon={Truck}
                  title="Shipping Center"
                  subtitle={`${shippingRequestCount} active request${shippingRequestCount === 1 ? '' : 's'}`}
                  value="Manage"
                  onClick={onOpenShippingCenter}
                />
                <SettingsRow
                  icon={MapPin}
                  title="Shipping Region"
                  subtitle="Physical card delivery region."
                  value="Malaysia"
                />
                <SettingsRow
                  icon={Globe2}
                  title="Language"
                  value="English"
                />
                <SettingsRow
                  icon={Volume2}
                  title="Display Mode"
                  value="Dark"
                />
              </div>

              <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045]">
                <SettingsRow
                  icon={UserCircle}
                  title="Version"
                  value="V 1.0.0"
                />
                <SettingsRow
                  icon={RotateCcw}
                  title="Reset Demo Data"
                  subtitle="Clears local wallet, vault, packs and history."
                  danger
                  onClick={onResetDemoData}
                />
                <SettingsRow
                  icon={LogOut}
                  title="Logout Demo"
                  subtitle="Demo only. Real auth can be added later."
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
