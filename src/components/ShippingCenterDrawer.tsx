import { AnimatePresence, motion } from 'framer-motion'
import {
  CheckCircle2,
  ChevronLeft,
  Edit3,
  Home,
  MapPin,
  PackageOpen,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'

import type { ShippingInfo, ShippingStatus, VaultCard } from './VaultDrawer'

type ShippingCenterDrawerProps = {
  isOpen: boolean
  cards: VaultCard[]
  onClose: () => void
}

type ShippingTab = 'requests' | 'addresses'

type SavedShippingAddress = ShippingInfo & {
  id: string
  label?: string
  addressLine1?: string
  addressLine2?: string
  isPrimary?: boolean
  createdAt?: string
}

type AddressFormState = {
  fullName: string
  phone: string
  email: string
  state: string
  city: string
  addressLine1: string
  addressLine2: string
  postcode: string
  remark: string
  isPrimary: boolean
}

const SHIPPING_ADDRESS_STORAGE_KEY = 'tcg-platform-shipping-addresses-v1'

const emptyAddressForm: AddressFormState = {
  fullName: '',
  phone: '',
  email: '',
  state: '',
  city: '',
  addressLine1: '',
  addressLine2: '',
  postcode: '',
  remark: '',
  isPrimary: true,
}

const shippingStatusSteps: ShippingStatus[] = [
  'Shipping Requested',
  'Preparing',
  'Shipped',
  'Delivered',
]

function safeParseAddresses() {
  if (typeof window === 'undefined') return []

  try {
    const parsedValue = JSON.parse(
      window.localStorage.getItem(SHIPPING_ADDRESS_STORAGE_KEY) ?? '[]',
    )

    return Array.isArray(parsedValue) ? (parsedValue as SavedShippingAddress[]) : []
  } catch {
    return []
  }
}

function getAddressSummary(address: SavedShippingAddress) {
  return [address.addressLine1 || address.address, address.addressLine2]
    .filter(Boolean)
    .join(', ')
}

function getCitySummary(address: ShippingInfo) {
  return [address.postcode, address.city, address.state].filter(Boolean).join(' ')
}

function getStatusStyle(status: ShippingStatus) {
  if (status === 'Delivered') {
    return 'border-emerald-300/25 bg-emerald-300/12 text-emerald-200'
  }

  if (status === 'Shipped') {
    return 'border-amber-300/25 bg-amber-300/12 text-amber-200'
  }

  if (status === 'Preparing') {
    return 'border-cyan-300/25 bg-cyan-300/12 text-cyan-200'
  }

  return 'border-purple-300/25 bg-purple-300/12 text-purple-200'
}

function getStatusProgress(status: ShippingStatus) {
  const index = shippingStatusSteps.indexOf(status)
  return Math.max(index, 0)
}

function createAddressFromForm(form: AddressFormState, existingId?: string): SavedShippingAddress {
  const addressLine1 = form.addressLine1.trim()
  const addressLine2 = form.addressLine2.trim()

  return {
    id: existingId ?? `addr-${Date.now()}`,
    fullName: form.fullName.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    state: form.state.trim(),
    city: form.city.trim(),
    postcode: form.postcode.trim(),
    addressLine1,
    addressLine2,
    address: [addressLine1, addressLine2].filter(Boolean).join(', '),
    remark: form.remark.trim(),
    isPrimary: form.isPrimary,
    createdAt: new Date().toISOString(),
  }
}

function createFormFromAddress(address: SavedShippingAddress): AddressFormState {
  return {
    fullName: address.fullName,
    phone: address.phone,
    email: address.email,
    state: address.state,
    city: address.city,
    postcode: address.postcode,
    addressLine1: address.addressLine1 ?? address.address,
    addressLine2: address.addressLine2 ?? '',
    remark: address.remark ?? '',
    isPrimary: Boolean(address.isPrimary),
  }
}

export default function ShippingCenterDrawer({
  isOpen,
  cards,
  onClose,
}: ShippingCenterDrawerProps) {
  const [activeTab, setActiveTab] = useState<ShippingTab>('requests')
  const [addresses, setAddresses] = useState<SavedShippingAddress[]>(() =>
    safeParseAddresses(),
  )
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressForm, setAddressForm] =
    useState<AddressFormState>(emptyAddressForm)

  const shippingCards = useMemo(
    () =>
      cards.filter((card) =>
        ['Shipping Requested', 'Preparing', 'Shipped', 'Delivered'].includes(
          card.status,
        ),
      ),
    [cards],
  )

  const activeRequests = shippingCards.filter(
    (card) => card.status !== 'Delivered',
  ).length

  const deliveredRequests = shippingCards.filter(
    (card) => card.status === 'Delivered',
  ).length

  const primaryAddress = addresses.find((address) => address.isPrimary)

  useEffect(() => {
    if (!isOpen) return

    setAddresses(safeParseAddresses())

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

  useEffect(() => {
    if (typeof window === 'undefined') return

    window.localStorage.setItem(
      SHIPPING_ADDRESS_STORAGE_KEY,
      JSON.stringify(addresses),
    )
  }, [addresses])

  const openAddForm = () => {
    setEditingAddressId(null)
    setAddressForm({
      ...emptyAddressForm,
      isPrimary: addresses.length === 0,
    })
    setIsFormOpen(true)
  }

  const openEditForm = (address: SavedShippingAddress) => {
    setEditingAddressId(address.id)
    setAddressForm(createFormFromAddress(address))
    setIsFormOpen(true)
  }

  const saveAddress = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextAddress = createAddressFromForm(
      addressForm,
      editingAddressId ?? undefined,
    )

    setAddresses((currentAddresses) => {
      const shouldMakePrimary =
        nextAddress.isPrimary || currentAddresses.length === 0

      const normalizedAddress = {
        ...nextAddress,
        isPrimary: shouldMakePrimary,
      }

      if (editingAddressId) {
        return currentAddresses.map((address) => {
          if (address.id === editingAddressId) {
            return normalizedAddress
          }

          return shouldMakePrimary ? { ...address, isPrimary: false } : address
        })
      }

      return [
        ...currentAddresses.map((address) =>
          shouldMakePrimary ? { ...address, isPrimary: false } : address,
        ),
        normalizedAddress,
      ]
    })

    setIsFormOpen(false)
    setEditingAddressId(null)
    setAddressForm(emptyAddressForm)
    setActiveTab('addresses')
  }

  const deleteAddress = (addressId: string) => {
    setAddresses((currentAddresses) => {
      const nextAddresses = currentAddresses.filter(
        (address) => address.id !== addressId,
      )

      if (nextAddresses.length === 0) return []

      if (!nextAddresses.some((address) => address.isPrimary)) {
        const [firstAddress, ...remainingAddresses] = nextAddresses

        return [{ ...firstAddress, isPrimary: true }, ...remainingAddresses]
      }

      return nextAddresses
    })
  }

  const makePrimary = (addressId: string) => {
    setAddresses((currentAddresses) =>
      currentAddresses.map((address) => ({
        ...address,
        isPrimary: address.id === addressId,
      })),
    )
  }

  const updateFormField = (
    field: keyof AddressFormState,
    value: string | boolean,
  ) => {
    setAddressForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[999999] overflow-hidden bg-[#020611] text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.18),transparent_32%),radial-gradient(circle_at_80%_5%,rgba(168,85,247,0.16),transparent_30%),linear-gradient(180deg,rgba(8,13,28,0.98),rgba(3,7,18,1))]" />

        <motion.div
          className="relative flex h-full flex-col"
          initial={{ y: 28 }}
          animate={{ y: 0 }}
          exit={{ y: 28 }}
        >
          <header className="shrink-0 border-b border-white/10 bg-black/35 px-4 pb-3 pt-[max(env(safe-area-inset-top),1rem)] backdrop-blur-2xl">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close shipping center"
                className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-slate-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="min-w-0 flex-1 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-300">
                  Player Shipping
                </p>
                <h2 className="truncate text-xl font-black">Shipping Center</h2>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="grid h-11 w-11 place-items-center rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <div className="rounded-2xl border border-purple-300/15 bg-purple-300/[0.07] p-3">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-purple-200">
                  Active
                </p>
                <p className="mt-1 text-xl font-black">{activeRequests}</p>
              </div>

              <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.07] p-3">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-cyan-200">
                  Addresses
                </p>
                <p className="mt-1 text-xl font-black">{addresses.length}</p>
              </div>

              <div className="rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.07] p-3">
                <p className="text-[9px] font-black uppercase tracking-[0.22em] text-emerald-200">
                  Delivered
                </p>
                <p className="mt-1 text-xl font-black">{deliveredRequests}</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-1">
              {([
                ['requests', 'Requests'],
                ['addresses', 'Addresses'],
              ] as const).map(([tabId, label]) => (
                <button
                  key={tabId}
                  type="button"
                  onClick={() => setActiveTab(tabId)}
                  className={`rounded-xl px-3 py-2.5 text-xs font-black uppercase tracking-[0.16em] transition ${
                    activeTab === tabId
                      ? 'bg-cyan-300 text-black shadow-[0_0_24px_rgba(34,211,238,0.25)]'
                      : 'text-slate-400'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-4">
            {activeTab === 'requests' && (
              <section>
                {shippingCards.length === 0 ? (
                  <div className="grid min-h-[55vh] place-items-center rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
                    <div>
                      <div className="mx-auto grid h-20 w-20 place-items-center rounded-[2rem] border border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-200">
                        <PackageOpen className="h-9 w-9" />
                      </div>
                      <h3 className="mt-5 text-2xl font-black">
                        No shipping requests yet
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Request shipping from cards in My Vault. Your request,
                        tracking and delivery status will show here.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {shippingCards.map((card) => {
                      const progress = getStatusProgress(card.status)
                      const shippingInfo = card.shippingInfo

                      return (
                        <article
                          key={card.id}
                          className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-3 shadow-[0_18px_45px_rgba(0,0,0,0.28)]"
                        >
                          <div className="flex gap-3">
                            <div className="grid h-20 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl border border-cyan-300/15 bg-black/40">
                              <img
                                src={card.image}
                                alt={card.name}
                                className="h-full w-full object-contain p-1"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <h3 className="truncate text-sm font-black">
                                    {card.name}
                                  </h3>
                                  <p className="mt-1 truncate text-[11px] font-bold text-slate-400">
                                    {card.sourcePack}
                                  </p>
                                </div>

                                <span
                                  className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-black ${getStatusStyle(
                                    card.status,
                                  )}`}
                                >
                                  {card.status}
                                </span>
                              </div>

                              <div className="mt-3 grid grid-cols-4 gap-1">
                                {shippingStatusSteps.map((step, index) => (
                                  <div
                                    key={step}
                                    className={`h-1.5 rounded-full ${
                                      index <= progress
                                        ? 'bg-cyan-300'
                                        : 'bg-white/10'
                                    }`}
                                  />
                                ))}
                              </div>

                              <div className="mt-3 rounded-2xl border border-white/10 bg-black/20 p-2 text-[11px] leading-5 text-slate-300">
                                <p className="flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 text-cyan-200" />
                                  {shippingInfo
                                    ? `${shippingInfo.city || 'City'}, ${
                                        shippingInfo.state || 'State'
                                      }`
                                    : 'Address pending'}
                                </p>
                                <p className="mt-1 text-slate-500">
                                  {card.shippingRequestedAt
                                    ? `Requested ${card.shippingRequestedAt}`
                                    : 'Request created'}
                                </p>
                                {shippingInfo?.trackingNumber && (
                                  <p className="mt-1 font-black text-amber-200">
                                    Tracking: {shippingInfo.trackingNumber}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </article>
                      )
                    })}
                  </div>
                )}
              </section>
            )}

            {activeTab === 'addresses' && (
              <section>
                {addresses.length === 0 ? (
                  <div className="grid min-h-[55vh] place-items-center rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 text-center">
                    <div>
                      <div className="mx-auto grid h-20 w-20 place-items-center rounded-[2rem] border border-amber-300/20 bg-amber-300/[0.08] text-amber-200">
                        <MapPin className="h-9 w-9" />
                      </div>
                      <h3 className="mt-5 text-2xl font-black">
                        No address saved yet
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Add your first shipping address to request physical card
                        delivery from My Vault.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {primaryAddress && (
                      <div className="rounded-[1.35rem] border border-amber-300/20 bg-amber-300/[0.08] p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-amber-200">
                          Primary address
                        </p>
                        <p className="mt-2 text-sm font-black text-white">
                          {primaryAddress.fullName} · {primaryAddress.phone}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-300">
                          {getAddressSummary(primaryAddress)}
                          <br />
                          {getCitySummary(primaryAddress)}
                        </p>
                      </div>
                    )}

                    {addresses.map((address) => (
                      <article
                        key={address.id}
                        className="rounded-[1.5rem] border border-white/10 bg-white/[0.055] p-4"
                      >
                        <div className="flex items-start gap-3">
                          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-200">
                            <Home className="h-5 w-5" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="truncate text-sm font-black">
                                {address.fullName}
                              </h3>
                              {address.isPrimary && (
                                <span className="rounded-full bg-amber-300 px-2.5 py-1 text-[10px] font-black text-black">
                                  Primary
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-xs font-bold text-cyan-100">
                              {address.phone}
                            </p>
                            <p className="mt-2 text-xs leading-5 text-slate-400">
                              {getAddressSummary(address)}
                              <br />
                              {getCitySummary(address)}
                            </p>

                            <div className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-3">
                              <button
                                type="button"
                                onClick={() => makePrimary(address.id)}
                                className={`flex items-center gap-1.5 text-xs font-black ${
                                  address.isPrimary
                                    ? 'text-amber-200'
                                    : 'text-slate-400'
                                }`}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                                Make Primary
                              </button>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => openEditForm(address)}
                                  className="grid h-9 w-9 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-slate-200"
                                >
                                  <Edit3 className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteAddress(address.id)}
                                  className="grid h-9 w-9 place-items-center rounded-full border border-red-300/20 bg-red-300/[0.08] text-red-200"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}
          </main>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020611] via-[#020611]/95 to-transparent px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-10">
            <button
              type="button"
              onClick={openAddForm}
              className="pointer-events-auto flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 px-5 py-4 text-sm font-black text-black shadow-[0_0_34px_rgba(251,191,36,0.25)]"
            >
              <Plus className="h-5 w-5" />
              Add Address
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {isFormOpen && (
            <motion.form
              onSubmit={saveAddress}
              className="absolute inset-0 z-10 flex flex-col bg-[#020611] text-white"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            >
              <div className="border-b border-white/10 bg-black/35 px-4 pb-3 pt-[max(env(safe-area-inset-top),1rem)] backdrop-blur-2xl">
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-slate-200"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <h3 className="text-lg font-black">
                    {editingAddressId ? 'Edit Address' : 'Shipping Address'}
                  </h3>

                  <div className="h-11 w-11" />
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-5">
                <div className="space-y-4">
                  {[
                    ['fullName', 'Full name'],
                    ['state', 'State'],
                    ['city', 'City'],
                    ['addressLine1', 'Address Line 01'],
                    ['addressLine2', 'Address Line 02'],
                    ['postcode', 'Postcode'],
                    ['phone', 'Phone Number'],
                    ['email', 'Email (optional)'],
                  ].map(([field, placeholder]) => (
                    <label key={field} className="block">
                      <input
                        required={
                          !['addressLine2', 'email'].includes(field)
                        }
                        type={field === 'email' ? 'email' : 'text'}
                        value={
                          addressForm[field as keyof AddressFormState] as string
                        }
                        onChange={(event) =>
                          updateFormField(
                            field as keyof AddressFormState,
                            event.target.value,
                          )
                        }
                        className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-4 text-base font-bold text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
                        placeholder={placeholder}
                      />
                    </label>
                  ))}

                  <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.055] px-4 py-4">
                    <span className="text-sm font-black text-white">
                      Make Primary
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateFormField('isPrimary', !addressForm.isPrimary)
                      }
                      className={`relative h-8 w-14 rounded-full transition ${
                        addressForm.isPrimary ? 'bg-amber-300' : 'bg-white/12'
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                          addressForm.isPrimary ? 'left-7' : 'left-1'
                        }`}
                      />
                    </button>
                  </label>
                </div>
              </div>

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#020611] via-[#020611]/95 to-transparent px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-10">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 px-5 py-4 text-sm font-black text-black shadow-[0_0_34px_rgba(251,191,36,0.25)]"
                >
                  <ShieldCheck className="h-5 w-5" />
                  {editingAddressId ? 'Save Address' : 'Add Address'}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}
