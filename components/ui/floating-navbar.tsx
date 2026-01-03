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
import { Menu, X } from "lucide-react";

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
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (current) => {
    if (typeof current === "number") {
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

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center justify-center space-x-6">
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
                <span className="text-xl">{navItem.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Right Side: Login + Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link
            href="/login"
            className="border text-[10px] sm:text-sm font-bold relative border-red-600/50 text-white px-3 py-1 sm:px-6 sm:py-2 rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.6)]"
          >
            <span>Login</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-red-500 to-transparent h-px" />
          </Link>

          <button
            onClick={() => setOpen(!open)}
            className="text-neutral-200 hover:text-red-500 transition-colors sm:hidden"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="absolute top-full left-0 w-full bg-black/95 border-b border-red-600/30 overflow-hidden sm:hidden"
            >
              <div className="flex flex-col items-center py-6 space-y-6">
                {navItems.map((navItem, idx: number) => {
                  const isActive = pathname === navItem.link || (pathname.startsWith(navItem.link) && navItem.link !== '/');
                  return (
                    <Link
                      key={`mobile-link=${idx}`}
                      href={navItem.link}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "text-lg font-bold zen-dots-regular transition-colors",
                        isActive ? "text-red-500" : "text-neutral-200 hover:text-red-500"
                      )}
                    >
                      {navItem.name}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};