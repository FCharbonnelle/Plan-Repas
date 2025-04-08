"use client"
import Link from 'next/link';
import { motion } from 'framer-motion';

function Header() {
    return (
        <header className="relative overflow-hidden bg-cover bg-center h-72 m-4 rounded-2xl border-2 border-yellow-500/50 shadow-2xl" 
                style={{ backgroundImage: "url('/images/headerDAL.webp')" }}>
            {/* Effets lumineux d'arrière-plan */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/30 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-500/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-red-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center h-full">
                <Link href="/pizza" className="block">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-black/40 p-8 rounded-2xl backdrop-blur-md border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.3)] cursor-pointer"
                    >
                        <h1 className="text-5xl md:text-7xl font-extrabold text-white text-center tracking-wider mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] font-serif">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-red-500 to-yellow-300 animate-text">
                                Pizza Di Mama
                            </span>
                        </h1>
                        <p className="text-white text-xl md:text-2xl italic opacity-90 text-center font-light tracking-wide">
                            Les meilleures pizzas de la ville
                        </p>
                    </motion.div>
                </Link>
            </div>
        </header>
    )
}

export default function header() {
    return (
        <div>
            <Header />
        </div>
    )
}
