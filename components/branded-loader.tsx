"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export default function BrandedLoader() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-lta-purple overflow-hidden text-white">
            {/* Background Motifs */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0,50 Q25,0 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 2" />
                </svg>
            </div>

            <div className="relative flex flex-col items-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1 }}
                    className="relative w-40 h-40 mb-8"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-2 border-white/10 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center p-6 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
                        <Image
                            src="/logo.png"
                            alt="LTA Logo"
                            width={120}
                            height={120}
                            className="object-contain filter brightness-110"
                            priority
                        />
                    </div>
                </motion.div>

                <div className="text-center">
                    <motion.h2
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-2xl font-bold tracking-wider mb-2"
                    >
                        LEADER TRAVEL AGENCY
                    </motion.h2>
                    <motion.div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mx-auto mt-4">
                        <motion.div
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="w-1/2 h-full bg-lta-orange"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
