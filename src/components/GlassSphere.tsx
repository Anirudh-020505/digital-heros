import { motion } from "framer-motion";

/**
 * Floating 3D glass sphere — pure CSS/SVG (no WebGL) for instant load.
 * Layered radial gradients create depth; framer-motion provides float on Z.
 */
export function GlassSphere() {
  return (
    <div className="relative mx-auto h-[420px] w-[420px] max-w-full">
      {/* Outer cyan glow halo */}
      <motion.div
        aria-hidden
        className="absolute inset-0 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--cyan-glow) 55%, transparent), transparent 65%)",
        }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Inner emerald core glow */}
      <motion.div
        aria-hidden
        className="absolute inset-10 rounded-full blur-2xl"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklab, var(--emerald-glow) 70%, transparent), transparent 70%)",
        }}
        animate={{ scale: [1.05, 0.95, 1.05], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* The sphere itself */}
      <motion.div
        className="relative h-full w-full"
        animate={{ y: [0, -18, 0], rotateZ: [0, 2, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformPerspective: 1200 }}
      >
        <div
          className="absolute inset-0 rounded-full border border-white/15"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, oklch(1 0 0 / 0.35), oklch(1 0 0 / 0.04) 35%, oklch(0 0 0 / 0.5) 75%), radial-gradient(circle at 70% 80%, color-mix(in oklab, var(--emerald-glow) 45%, transparent), transparent 55%), radial-gradient(circle at 20% 80%, color-mix(in oklab, var(--cyan-glow) 45%, transparent), transparent 55%)",
            backdropFilter: "blur(20px)",
            boxShadow:
              "inset 0 0 60px oklch(1 0 0 / 0.15), inset 0 -30px 80px color-mix(in oklab, var(--cyan-glow) 30%, transparent), 0 30px 80px -10px oklch(0 0 0 / 0.7)",
          }}
        />
        {/* Specular highlight */}
        <div
          className="absolute left-[18%] top-[14%] h-24 w-32 rounded-full blur-md"
          style={{
            background:
              "radial-gradient(ellipse, oklch(1 0 0 / 0.55), transparent 70%)",
          }}
        />
        {/* Equator ring */}
        <motion.div
          className="absolute inset-x-0 top-1/2 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent, color-mix(in oklab, var(--cyan-glow) 80%, transparent), transparent)",
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </motion.div>
    </div>
  );
}
