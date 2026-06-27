import {
  ArrowDownToLine,
  ArrowUpToLine,
  Bell,
  ChevronRight,
  LifeBuoy,
  LogOut,
  PackageCheck,
  Send,
  Settings,
  Sparkles,
  UserCircle,
  Wallet,
  X,
} from "lucide-react";
import { translations, type AppLanguage } from "../lib/i18n";

type PlayerWalletPanelProps = {
  isOpen: boolean;
  language: AppLanguage;
  onClose: () => void;
  username: string;
  walletBalance: number;
  vaultCount: number;
  raffleTickets: number;
  shipmentCount: number;
  transactionCount: number;
  onTopUp: () => void;
  onOpenVault: () => void;
  onOpenHistory: () => void;
  onOpenDailyReward: () => void;
};

export default function PlayerWalletPanel({
  isOpen,
  language,
  onClose,
  username,
  walletBalance,
  vaultCount,
  raffleTickets,
  shipmentCount,
  transactionCount,
  onTopUp,
  onOpenVault,
  onOpenHistory,
  onOpenDailyReward,
}: PlayerWalletPanelProps) {
  const t = translations[language]

  if (!isOpen) return null;

  const handleTopUp = () => {
    onClose();
    onTopUp();
  };

  const handleVault = () => {
    onClose();
    onOpenVault();
  };

  const handleHistory = () => {
    onClose();
    onOpenHistory();
  };

  const handleDailyReward = () => {
    onClose();
    onOpenDailyReward();
  };

  return (
    <div className="fixed inset-0 z-[100000]">
      <button
        type="button"
        aria-label={t.cancel}
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
      />

      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[430px] flex-col border-l border-white/10 bg-[#0c0b12]/95 text-white shadow-[0_0_120px_rgba(0,0,0,0.85)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgba(34,211,238,0.16),transparent_34%),radial-gradient(circle_at_0%_18%,rgba(168,85,247,0.10),transparent_30%)]" />

        <div className="relative z-10 flex items-center justify-between border-b border-white/8 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-13 w-13 items-center justify-center rounded-2xl border border-purple-300/20 bg-purple-300/10 shadow-[0_0_30px_rgba(168,85,247,0.22)]">
              <img
                src="https://api.dicebear.com/9.x/adventurer/svg?seed=detailedpower3615&radius=50&backgroundColor=8b5cf6"
                alt={username}
                className="h-12 w-12 rounded-2xl object-cover"
              />
              <span className="absolute -right-1 -top-1 h-3.5 w-3.5 rounded-full border-2 border-[#0c0b12] bg-emerald-400" />
            </div>

            <div>
              <p className="text-lg font-black leading-tight">{username}</p>
              <button
                type="button"
                className="mt-0.5 text-sm font-bold text-slate-300 transition hover:text-cyan-200"
              >
                {t.viewProfile}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto px-5 py-5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
                  <Wallet className="h-5 w-5 text-cyan-200" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-200">{t.pointsBalance}</p>
                  <button
                    type="button"
                    onClick={handleHistory}
                    className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-400 transition hover:text-cyan-200"
                  >
                    {t.viewHistory}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-black text-cyan-100">
                  {walletBalance.toLocaleString()}
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                  {t.points}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDailyReward}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 text-sm font-black text-white shadow-[0_0_35px_rgba(59,130,246,0.25)] transition hover:scale-[1.01]"
            >
              <Sparkles className="h-4 w-4" />
              {t.rollDailyPoints}
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                  <UserCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-200">
                    {t.jomluffyzWallet}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {t.walletPanelSubtitle}
                  </p>
                </div>
              </div>
              <p className="text-lg font-black text-white">$0.00 USDC</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleTopUp}
                className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-3 text-sm font-black text-white transition hover:bg-white/15"
              >
                <ArrowUpToLine className="h-4 w-4" />
                {t.add}
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-3 text-sm font-black text-white transition hover:bg-white/15"
              >
                <ArrowDownToLine className="h-4 w-4" />
                {t.withdraw}
              </button>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-3 text-sm font-black text-white transition hover:bg-white/15"
              >
                <Send className="h-4 w-4" />
                {t.transfer}
              </button>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={handleVault}
              className="rounded-2xl border border-cyan-300/15 bg-cyan-300/[0.06] p-4 text-left transition hover:bg-cyan-300/10"
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                {t.myVault}
              </p>
              <p className="mt-2 text-2xl font-black">{vaultCount}</p>
            </button>

            <button
              type="button"
              className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.06] p-4 text-left transition hover:bg-amber-300/10"
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">
                {t.tickets}
              </p>
              <p className="mt-2 text-2xl font-black">{raffleTickets}</p>
            </button>

            <button
              type="button"
              className="rounded-2xl border border-purple-300/15 bg-purple-300/[0.06] p-4 text-left transition hover:bg-purple-300/10"
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-300">
                {t.history}
              </p>
              <p className="mt-2 text-2xl font-black">{transactionCount}</p>
            </button>
          </div>

          <button
            type="button"
            onClick={handleVault}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-black text-white transition hover:bg-white/[0.06]"
          >
            <PackageCheck className="h-4 w-4" />
            {t.shipments}
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
              {shipmentCount}
            </span>
          </button>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-black text-white transition hover:bg-white/[0.06]"
            >
              <LifeBuoy className="h-4 w-4" />
              {t.support}
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-black text-white transition hover:bg-white/[0.06]"
            >
              <Settings className="h-4 w-4" />
              {t.settings}
            </button>
          </div>

          <button
            type="button"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-black text-white transition hover:bg-red-500/10 hover:text-red-200"
          >
            <LogOut className="h-4 w-4" />
            {t.logOut}
          </button>

          <div className="mt-5 rounded-2xl border border-emerald-300/15 bg-emerald-300/[0.05] p-4">
            <div className="flex items-center gap-2 text-emerald-200">
              <Bell className="h-4 w-4" />
              <p className="text-xs font-black uppercase tracking-[0.22em]">
                {t.demoAccount}
              </p>
            </div>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {t.simulatedWalletNotice}
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
