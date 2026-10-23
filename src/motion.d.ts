// Type declarations for motion/react
// framer-motion v12 doesn't ship with .d.ts files in dist,
// so we need to manually declare the types we use.

import "motion/react";

declare module "motion/react" {
  export interface AnimatePresenceProps {
    children?: React.ReactNode;
    mode?: "sync" | "wait" | "popLayout";
    initial?: boolean;
    onExitComplete?: () => void;
    presenceAffectsLayout?: boolean;
    custom?: unknown;
  }

  export const AnimatePresence: React.FC<AnimatePresenceProps>;
}
