import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell,
  Check,
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

import { audioManager } from '../lib/audioManager'
import { languageOptions, translations, type AppLanguage } from '../lib/i18n'

export type PlayerProfile = {
  displayName: string
  username: string
}

type ProfileSaveResult = {
  ok: boolean
  message?: string
}

type ProfileSettingsDrawerProps = {
  isOpen: boolean
  onClose: () => void
  language: AppLanguage
  languageLabel: string
  onChangeLanguage: (language: AppLanguage) => void
  playerProfile: PlayerProfile
  isSoundEnabled: boolean
  onToggleSound: () => void
  onOpenShippingCenter: () => void
  onResetDemoData: () => void
  onSaveProfile: (profile: PlayerProfile) => ProfileSaveResult
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

const getAvatarUrl = (profile: PlayerProfile) => {
  const seed = encodeURIComponent(profile.username || profile.displayName || 'detailedpower3615')
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&radius=50&backgroundColor=8b5cf6`
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
  language,
  languageLabel,
  onChangeLanguage,
  playerProfile,
  isSoundEnabled,
  onToggleSound,
  onOpenShippingCenter,
  onResetDemoData,
  onSaveProfile,
  walletBalance,
  shippingRequestCount,
}: ProfileSettingsDrawerProps) {
  const [notifications, setNotifications] = useState(notificationDefaults)
  const [soundOptions, setSoundOptions] = useState(soundDefaults)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [draftDisplayName, setDraftDisplayName] = useState(playerProfile.displayName)
  const [draftUsername, setDraftUsername] = useState(playerProfile.username)
  const [editError, setEditError] = useState('')
  const t = translations[language]

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isLanguageOpen) {
          setIsLanguageOpen(false)
          return
        }

        if (isEditOpen) {
          setIsEditOpen(false)
          return
        }

        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isEditOpen, isLanguageOpen, isOpen, onClose])

  useEffect(() => {
    if (!isEditOpen) return

    setDraftDisplayName(playerProfile.displayName)
    setDraftUsername(playerProfile.username)
    setEditError('')
  }, [isEditOpen, playerProfile.displayName, playerProfile.username])

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

  const openEditProfile = () => {
    setDraftDisplayName(playerProfile.displayName)
    setDraftUsername(playerProfile.username)
    setEditError('')
    setIsEditOpen(true)
  }

  const handleChooseLanguage = (nextLanguage: AppLanguage) => {
    onChangeLanguage(nextLanguage)
    setIsLanguageOpen(false)
  }

  const handleSaveProfile = () => {
    const saveResult = onSaveProfile({
      displayName: draftDisplayName,
      username: draftUsername,
    })

    if (!saveResult.ok) {
      setEditError(saveResult.message ?? 'Unable to save profile.')
      return
    }

    setEditError('')
    setIsEditOpen(false)
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
                    {t.playerProfile}
                  </p>
                  <h2 className="text-xl font-black tracking-tight text-white">
                    {t.accountSettings}
                  </h2>
                </div>

                <div className="h-11 w-11" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-28 pt-4 [-webkit-overflow-scrolling:touch]">
              <div className="overflow-hidden rounded-[1.6rem] border border-cyan-300/18 bg-cyan-300/[0.06] p-4 shadow-[0_22px_70px_rgba(34,211,238,0.12)]">
                <div className="flex items-center gap-3">
                  <img
                    src={getAvatarUrl(playerProfile)}
                    alt={playerProfile.displayName}
                    className="h-16 w-16 shrink-0 rounded-3xl border border-purple-300/25 bg-purple-300/10 shadow-[0_0_32px_rgba(168,85,247,0.26)]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-lg font-black text-white">
                      {playerProfile.displayName}
                    </p>
                    <p className="mt-0.5 truncate text-xs font-semibold text-slate-400">
                      @{playerProfile.username} · Level 01
                    </p>
                    <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-cyan-300/20 bg-cyan-300/[0.08] px-2.5 py-1 text-xs font-black text-cyan-200">
                      <Gem className="h-3.5 w-3.5" />
                      {walletBalance.toLocaleString()} points
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={openEditProfile}
                  className="mt-4 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-black text-white"
                >
                  {t.editProfile}
                </button>
              </div>

              <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045]">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <Bell className="h-5 w-5 text-yellow-200" />
                  <p className="text-sm font-black text-white">{t.notifications}</p>
                </div>

                <ToggleRow
                  label={t.packOpeningResult}
                  description={t.packOpeningResultDesc}
                  enabled={notifications.packResult}
                  onToggle={() => toggleNotification('packResult')}
                  accent="yellow"
                />
                <ToggleRow
                  label={t.auctionBidUpdates}
                  description={t.auctionBidUpdatesDesc}
                  enabled={notifications.auctionBid}
                  onToggle={() => toggleNotification('auctionBid')}
                  accent="yellow"
                />
                <ToggleRow
                  label={t.raffleRewards}
                  enabled={notifications.raffleReward}
                  onToggle={() => toggleNotification('raffleReward')}
                  accent="purple"
                />
                <ToggleRow
                  label={t.shippingUpdates}
                  enabled={notifications.shippingUpdate}
                  onToggle={() => toggleNotification('shippingUpdate')}
                  accent="cyan"
                />
                <ToggleRow
                  label={t.promotionsEvents}
                  enabled={notifications.eventPromo}
                  onToggle={() => toggleNotification('eventPromo')}
                  accent="emerald"
                />
              </div>

              <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045]">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <Music2 className="h-5 w-5 text-cyan-200" />
                  <p className="text-sm font-black text-white">{t.soundMusic}</p>
                </div>

                <ToggleRow
                  label={t.masterSound}
                  description={t.masterSoundDesc}
                  enabled={isSoundEnabled}
                  onToggle={handleMainSoundToggle}
                  accent="cyan"
                />
                <ToggleRow
                  label={t.backgroundMusic}
                  enabled={isSoundEnabled && soundOptions.backgroundMusic}
                  onToggle={() => toggleSoundOption('backgroundMusic')}
                  accent="cyan"
                />
                <ToggleRow
                  label={t.soundEffects}
                  enabled={isSoundEnabled && soundOptions.soundEffects}
                  onToggle={() => toggleSoundOption('soundEffects')}
                  accent="purple"
                />
                <ToggleRow
                  label={t.packOpeningSounds}
                  enabled={isSoundEnabled && soundOptions.packOpeningSounds}
                  onToggle={() => toggleSoundOption('packOpeningSounds')}
                  accent="yellow"
                />
                <ToggleRow
                  label={t.auctionSounds}
                  enabled={isSoundEnabled && soundOptions.auctionSounds}
                  onToggle={() => toggleSoundOption('auctionSounds')}
                  accent="emerald"
                />
              </div>

              <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-cyan-300/14 bg-cyan-300/[0.045]">
                <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                  <Volume2 className="h-5 w-5 text-cyan-200" />
                  <p className="text-sm font-black text-white">{t.audioTest}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 px-4 py-3">
                  <button
                    type="button"
                    data-audio-silent="true"
                    onClick={() => audioManager.playSfx('bidClick', { throttleMs: 0, volume: 0.85 })}
                    className="rounded-2xl border border-yellow-300/18 bg-yellow-300/[0.07] px-3 py-3 text-xs font-black text-yellow-100"
                  >
                    {t.testBid}
                  </button>
                  <button
                    type="button"
                    data-audio-silent="true"
                    onClick={() => audioManager.playSfx('success', { throttleMs: 0, volume: 0.9 })}
                    className="rounded-2xl border border-emerald-300/18 bg-emerald-300/[0.07] px-3 py-3 text-xs font-black text-emerald-100"
                  >
                    {t.testSuccess}
                  </button>
                  <button
                    type="button"
                    data-audio-silent="true"
                    onClick={() => void audioManager.playBgm('lobby')}
                    className="rounded-2xl border border-purple-300/18 bg-purple-300/[0.07] px-3 py-3 text-xs font-black text-purple-100"
                  >
                    {t.testBgm}
                  </button>
                  <button
                    type="button"
                    data-audio-silent="true"
                    onClick={() => void audioManager.playBgm('pokemon')}
                    className="rounded-2xl border border-yellow-300/18 bg-yellow-300/[0.07] px-3 py-3 text-xs font-black text-yellow-100"
                  >
                    Pokémon
                  </button>
                  <button
                    type="button"
                    data-audio-silent="true"
                    onClick={() => void audioManager.playBgm('onePiece')}
                    className="rounded-2xl border border-red-300/18 bg-red-300/[0.07] px-3 py-3 text-xs font-black text-red-100"
                  >
                    One Piece
                  </button>
                  <button
                    type="button"
                    data-audio-silent="true"
                    onClick={() => {
                      audioManager.resetAudioSettings()
                      onToggleSound()
                    }}
                    className="rounded-2xl border border-red-300/18 bg-red-300/[0.07] px-3 py-3 text-xs font-black text-red-100"
                  >
                    {t.resetAudio}
                  </button>
                </div>
              </div>

              <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045]">
                <SettingsRow
                  icon={Phone}
                  title={t.phoneNumber}
                  subtitle={t.phoneNumberDesc}
                  value="Not linked"
                />
                <SettingsRow
                  icon={ShieldCheck}
                  title={t.accountVerification}
                  subtitle={t.accountVerificationDesc}
                  value="Demo"
                />
                <SettingsRow
                  icon={LockKeyhole}
                  title={t.changePassword}
                  subtitle={t.changePasswordDesc}
                  value="Soon"
                />
              </div>

              <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045]">
                <SettingsRow
                  icon={Truck}
                  title={t.shippingCenter}
                  subtitle={`${shippingRequestCount} active request${shippingRequestCount === 1 ? '' : 's'}`}
                  value="Manage"
                  onClick={onOpenShippingCenter}
                />
                <SettingsRow
                  icon={MapPin}
                  title={t.shippingRegion}
                  subtitle="Physical card delivery region."
                  value="Malaysia"
                />
                <SettingsRow
                  icon={Globe2}
                  title={t.language}
                  value={languageLabel}
                  onClick={() => setIsLanguageOpen(true)}
                />
                <SettingsRow
                  icon={Volume2}
                  title={t.displayMode}
                  value="Dark"
                />
              </div>

              <div className="mt-4 overflow-hidden rounded-[1.35rem] border border-white/10 bg-white/[0.045]">
                <SettingsRow
                  icon={UserCircle}
                  title={t.version}
                  value="V 1.0.0"
                />
                <SettingsRow
                  icon={RotateCcw}
                  title={t.resetDemoData}
                  subtitle={t.resetDemoDataDesc}
                  danger
                  onClick={onResetDemoData}
                />
                <SettingsRow
                  icon={LogOut}
                  title={t.logoutDemo}
                  subtitle={t.logoutDemoDesc}
                />
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {isEditOpen && (
              <motion.div
                className="absolute inset-0 z-30 flex items-end justify-center bg-black/55 px-4 pb-4 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-full max-w-md overflow-hidden rounded-[1.6rem] border border-cyan-300/18 bg-[#07111f] text-white shadow-[0_-20px_80px_rgba(34,211,238,0.18)]"
                  initial={{ y: 80, scale: 0.98 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: 80, scale: 0.98 }}
                  transition={{ type: 'spring', damping: 26, stiffness: 260 }}
                >
                  <div className="border-b border-white/10 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-200">
                          {t.profile}
                        </p>
                        <h3 className="mt-1 text-xl font-black text-white">
                          {t.editProfile}
                        </h3>
                      </div>

                      <button
                        type="button"
                        onClick={() => setIsEditOpen(false)}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.07]"
                        aria-label="Close edit profile"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="px-4 py-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-purple-300/15 bg-purple-300/[0.06] p-3">
                      <img
                        src={getAvatarUrl({
                          displayName: draftDisplayName || playerProfile.displayName,
                          username: draftUsername || playerProfile.username,
                        })}
                        alt="Profile preview"
                        className="h-14 w-14 rounded-2xl border border-purple-300/25 bg-purple-300/10"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-base font-black text-white">
                          {draftDisplayName || playerProfile.displayName}
                        </p>
                        <p className="truncate text-xs font-semibold text-slate-400">
                          @{draftUsername || playerProfile.username}
                        </p>
                      </div>
                    </div>

                    <label className="mt-4 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      {t.displayName}
                    </label>
                    <input
                      value={draftDisplayName}
                      onChange={(event) => setDraftDisplayName(event.target.value)}
                      maxLength={20}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40"
                      placeholder={t.displayName}
                    />

                    <label className="mt-4 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                      {t.username}
                    </label>
                    <input
                      value={draftUsername}
                      onChange={(event) => setDraftUsername(event.target.value.replace(/\s+/g, '').toLowerCase())}
                      maxLength={20}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm font-bold text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/40"
                      placeholder={t.username}
                    />

                    {editError && (
                      <div className="mt-3 rounded-2xl border border-red-300/20 bg-red-300/10 px-3 py-2 text-xs font-bold text-red-200">
                        {editError}
                      </div>
                    )}

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditOpen(false)}
                        className="rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-3 text-sm font-black text-slate-200"
                      >
                        {t.cancel}
                      </button>
                      <button
                        type="button"
                        data-audio-silent="true"
                        onClick={handleSaveProfile}
                        className="rounded-2xl bg-gradient-to-r from-cyan-300 to-blue-500 px-4 py-3 text-sm font-black text-black shadow-[0_14px_32px_rgba(34,211,238,0.24)]"
                      >
                        {t.saveChanges}
                      </button>
                    </div>

                    <p className="mt-3 text-center text-[10px] leading-4 text-slate-500">
                      Username supports 3–20 characters: letters, numbers, dash and underscore.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isLanguageOpen && (
              <motion.div
                className="absolute inset-0 z-40 flex items-end justify-center bg-black/55 px-4 pb-4 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-full max-w-md overflow-hidden rounded-[1.6rem] border border-cyan-300/18 bg-[#07111f] text-white shadow-[0_-20px_80px_rgba(34,211,238,0.18)]"
                  initial={{ y: 80, scale: 0.98 }}
                  animate={{ y: 0, scale: 1 }}
                  exit={{ y: 80, scale: 0.98 }}
                  transition={{ type: 'spring', damping: 26, stiffness: 260 }}
                >
                  <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.26em] text-cyan-200">
                        {t.language}
                      </p>
                      <h3 className="mt-1 text-xl font-black text-white">
                        {t.chooseLanguage}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsLanguageOpen(false)}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.07]"
                      aria-label="Close language picker"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="p-4">
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                      {languageOptions.map((option) => {
                        const isSelected = language === option.code

                        return (
                          <button
                            key={option.code}
                            type="button"
                            onClick={() => handleChooseLanguage(option.code)}
                            className="flex w-full items-center justify-between border-b border-white/10 px-4 py-4 text-left last:border-b-0"
                          >
                            <div>
                              <p className="text-sm font-black text-white">
                                {option.nativeLabel}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-slate-500">
                                {option.label}
                              </p>
                            </div>

                            {isSelected && (
                              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-300 text-black">
                                <Check className="h-4 w-4" />
                              </span>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
