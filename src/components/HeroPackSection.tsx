import { useRef, useState, type KeyboardEvent, type MouseEvent as ReactMouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type PanInfo,
} from "framer-motion";
import {
  ChevronRight,
  Grab,
  Sparkles,
} from "lucide-react";

import { pokemonRealCardPool } from "../data/cardPool";

type HeroPackSectionProps = {
  packImage: string;
  packName?: string;
  walletBalance: number;
  totalRemaining: number;
  totalSupply: number;
  raffleTickets: number;
  vaultCount: number;
  onStartOpening: () => void;
  onHowItWorks: () => void;
  onTopUp: () => void;
  onOpenVault: () => void;
};

const heroRevealCards = [
  pokemonRealCardPool.find((card) => card.name.toLowerCase().includes("mew")),
  pokemonRealCardPool.find((card) => card.name.toLowerCase().includes("charizard ex")),
  pokemonRealCardPool.find((card) => card.name.toLowerCase().includes("arceus")),
].filter(Boolean) as typeof pokemonRealCardPool;

const revealFallbackCards = pokemonRealCardPool.slice(0, 3);

export default function HeroPackSection({
  packImage,
  packName = "Evolving Skies Featured Pack",
  onStartOpening,
  onHowItWorks,
}: HeroPackSectionProps) {
  const packStageRef = useRef<HTMLDivElement | null>(null);
  const [isPackOpened, setIsPackOpened] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 130, damping: 18 });
  const smoothY = useSpring(mouseY, { stiffness: 130, damping: 18 });

  const rotateY = useTransform(smoothX, [-220, 220], [-10, 10]);
  const rotateX = useTransform(smoothY, [-220, 220], [8, -8]);
  const translateX = useTransform(smoothX, [-220, 220], [-10, 10]);
  const translateY = useTransform(smoothY, [-220, 220], [-8, 8]);

  const revealCards =
    heroRevealCards.length >= 3 ? heroRevealCards.slice(0, 3) : revealFallbackCards;

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const rect = packStageRef.current?.getBoundingClientRect();
    if (!rect) return;

    mouseX.set(event.clientX - rect.left - rect.width / 2);
    mouseY.set(event.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const openPack = () => {
    setIsPackOpened(true);
  };

  const resetPack = () => {
    setIsPackOpened(false);
  };

  const handleTopSealDragEnd = (_: globalThis.MouseEvent | globalThis.TouchEvent | globalThis.PointerEvent, info: PanInfo) => {
    if (info.offset.x > 88 || info.velocity.x > 560) {
      openPack();
      return;
    }

    resetPack();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isPackOpened) resetPack();
      else openPack();
    }
  };

  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-[#07111f]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[760px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-[150px]" />
        <div className="absolute right-[8%] top-[14%] h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-[130px]" />
        <div className="absolute left-[10%] bottom-[8%] h-[340px] w-[340px] rounded-full bg-emerald-400/8 blur-[120px]" />
      </div>

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto grid min-h-[620px] max-w-[1440px] grid-cols-1 gap-8 px-5 pb-8 pt-8 lg:min-h-[720px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-12 lg:px-12 lg:pb-20 lg:pt-16 xl:px-16">
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-black uppercase tracking-[0.24em] text-emerald-300">
            <Sparkles className="h-4 w-4" />
            Real cards. Shipped to you.
          </div>

          <h1 className="max-w-[760px] text-4xl font-black uppercase leading-[0.95] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl xl:text-8xl">
            Open iconic packs online.
            <br />
            Pull the real cards.
          </h1>

          <p className="mt-4 max-w-[650px] text-sm leading-6 text-slate-300 sm:mt-6 sm:text-xl sm:leading-8">
            Hold the top seal, drag it to the right, peel the pack open, and watch
            three cards jump out instantly.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 sm:mt-8 sm:gap-4">
            <button
              type="button"
              onClick={onStartOpening}
              className="group flex items-center gap-2 rounded-2xl bg-emerald-400 px-8 py-4 text-base font-black text-black shadow-[0_0_45px_rgba(74,222,128,0.22)] transition hover:scale-[1.02] hover:bg-emerald-300"
            >
              Start Opening
              <ChevronRight className="h-5 w-5 transition group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={onHowItWorks}
              className="rounded-2xl border border-white/10 bg-white/10 px-8 py-4 text-base font-black text-white transition hover:scale-[1.02] hover:bg-white/15"
            >
              How It Works
            </button>
          </div>

          <div className="mt-6 flex flex-wrap gap-2 sm:mt-10 sm:gap-3">
            {["Fair odds", "Authentic cards", "Vault · Sell · Ship"].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-slate-300"
              >
                {item}
              </div>
            ))}
          </div>


        </motion.div>

        <div className="relative flex items-center justify-center py-10 lg:py-0">
          <div className="absolute top-[2%] z-20 rounded-full border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-100 backdrop-blur sm:top-[6%] sm:px-5 sm:text-xl">
            {isPackOpened ? "3 Cards Revealed" : "Hold Top · Drag Right"}
          </div>

          <div
            ref={packStageRef}
            role="button"
            tabIndex={0}
            aria-label={`Drag top seal to open ${packName}`}
            aria-pressed={isPackOpened}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onKeyDown={handleKeyDown}
            className="relative z-10 select-none [perspective:1600px]"
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                x: translateX,
                y: translateY,
                transformStyle: "preserve-3d",
              }}
              className="relative h-[440px] w-[340px] max-w-[92vw] sm:h-[620px] sm:w-[600px]"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[3rem] bg-gradient-to-br from-cyan-400/20 via-blue-500/10 to-emerald-400/10 blur-3xl" />
              <div className="pointer-events-none absolute left-1/2 top-[58%] h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/15 blur-[88px]" />

              <motion.div
                animate={{
                  y: isPackOpened ? 90 : 0,
                  scale: isPackOpened ? 0.7 : 1,
                  rotate: isPackOpened ? -8 : 0,
                  opacity: isPackOpened ? 0 : 1,
                  filter: isPackOpened ? "blur(8px)" : "blur(0px)",
                }}
                transition={{ type: "spring", stiffness: 125, damping: 17 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <img
                  src={packImage}
                  alt={packName}
                  className="h-[370px] w-auto object-contain drop-shadow-[0_45px_130px_rgba(139,92,246,0.34)] sm:h-[575px]"
                  draggable={false}
                />
                <div className="pointer-events-none absolute left-1/2 top-[45%] h-24 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-2xl" />
              </motion.div>

              {!isPackOpened && (
                <motion.div
                  drag="x"
                  dragConstraints={{ left: 0, right: 160 }}
                  dragElastic={0.08}
                  onDragEnd={handleTopSealDragEnd}
                  animate={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 140, damping: 16 }}
                  className="absolute left-1/2 top-[80px] z-40 flex -translate-x-1/2 cursor-grab items-center justify-center active:cursor-grabbing sm:top-[104px]"
                >
                  <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/55 px-4 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[0_0_24px_rgba(34,211,238,0.22)] backdrop-blur-md">
                    <Grab className="h-4 w-4 text-cyan-200" />
                    Drag →
                  </div>
                </motion.div>
              )}

              {isPackOpened && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0"
                >
                  <div className="pointer-events-none absolute left-1/2 top-[150px] z-20 h-72 w-[520px] -translate-x-1/2 rounded-full bg-yellow-200/35 blur-[86px]" />

                  {revealCards.map((card, index) => {
                    const positions = [
                      { x: -215, y: 36, rotate: -16, z: 22 },
                      { x: 0, y: -8, rotate: 0, z: 30 },
                      { x: 215, y: 36, rotate: 16, z: 22 },
                    ];
                    const position = positions[index] ?? positions[1];

                    return (
                      <motion.div
                        key={card.id}
                        initial={{ opacity: 0, x: 0, y: 60, rotate: 0, scale: 0.62 }}
                        animate={{
                          opacity: 1,
                          x: position.x,
                          y: position.y,
                          rotate: position.rotate,
                          scale: index === 1 ? 1.05 : 0.94,
                        }}
                        transition={{
                          delay: 0.18 + index * 0.1,
                          type: "spring",
                          stiffness: 115,
                          damping: 14,
                        }}
                        className="absolute top-[120px] left-1/2 z-30 -ml-[90px] w-[180px] rounded-2xl border border-white/20 bg-black/45 p-2 shadow-[0_25px_70px_rgba(0,0,0,0.55)] backdrop-blur"
                        style={{ zIndex: position.z }}
                      >
                        <div className="overflow-hidden rounded-xl bg-slate-950">
                          <img
                            src={card.image}
                            alt={card.name}
                            className="h-[252px] w-full object-cover"
                          />
                        </div>
                        <div className="mt-2 rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-center">
                          <p className="truncate text-xs font-black text-white">
                            {card.name}
                          </p>
                          <p className="mt-0.5 truncate text-[10px] font-bold text-cyan-200">
                            {card.rarity}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}

                  <motion.button
                    type="button"
                    onClick={resetPack}
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 }}
                    className="absolute bottom-0 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-amber-200/25 bg-black/55 px-5 py-3 text-sm font-black text-amber-100 shadow-[0_0_35px_rgba(250,204,21,0.18)] backdrop-blur transition hover:scale-[1.03]"
                  >
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    Reset Pack
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </div>

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[18%] top-[20%] h-2 w-2 rounded-full bg-cyan-300/70" />
            <div className="absolute right-[16%] top-[28%] h-2.5 w-2.5 rounded-full bg-emerald-300/60" />
            <div className="absolute right-[25%] bottom-[22%] h-2 w-2 rounded-full bg-sky-300/60" />
            <div className="absolute left-[30%] bottom-[18%] h-1.5 w-1.5 rounded-full bg-white/70" />
          </div>
        </div>
      </div>
    </section>
  );
}
