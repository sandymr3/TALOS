"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
}) => {
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    // Check if current is not undefined and is a number
    if (typeof current === "number") {
      // Show navbar after scrolling down 100px
      if (current > 100) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 0,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.3,
          ease: "easeInOut",
        }}
        className={cn(
          "flex w-full fixed top-0 inset-x-0 border-b border-red-600/30 bg-black/90 backdrop-blur-md shadow-[0px_2px_15px_-1px_rgba(220,38,38,0.2)] z-[5000] px-8 py-6 items-center justify-between",
          className
        )}
      >
        <Link href="/" className="font-black text-xl tracking-tighter text-white hover:text-red-500 transition-colors">
          TALOS <span className="text-red-600 zen-dots-regular neon-text-red">5.0</span>
        </Link>

        <div className="flex items-center justify-center space-x-6">
          {navItems.map((navItem, idx: number) => {
            const isActive = pathname === navItem.link || (pathname.startsWith(navItem.link) && navItem.link !== '/');
            return (
              <Link
                key={`link=${idx}`}
                href={navItem.link}
                className={cn(
                  "relative items-center flex space-x-1 transition-colors font-bold zen-dots-regular",
                  isActive ? "text-red-500" : "text-neutral-200 hover:text-red-500"
                )}
              >
                <span className="block sm:hidden">{navItem.icon}</span>
                <span className="hidden sm:block text-xl">{navItem.name}</span>
              </Link>
            );
          })}
        </div>

        <Link
          href="/login"
          className="border text-sm font-bold relative border-red-600/50 text-white px-6 py-2 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]"
        >
          <span>Login</span>
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-red-500 to-transparent h-px" />
        </Link>
      </motion.div>
    </AnimatePresence>
  );
};