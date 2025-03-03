"use client"

function Header() {
    return (
        <header className="relative overflow-hidden bg-cover bg-center h-64 m-4 rounded-2xl border-2 border-yellow-500/50 shadow-xl" 
                style={{ backgroundImage: "url('/images/headerDAL.webp')" }}>
            {/* Effets lumineux d'arrière-plan */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
            </div>
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="container mx-auto px-4 relative z-10 flex flex-col items-center justify-center h-full">
                <div className="bg-black/30 p-6 rounded-xl backdrop-blur-sm border border-white/20 shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white text-center tracking-wider mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-serif">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-red-500 to-yellow-400 animate-text">
                            Pizza Di Mama
                        </span>
                    </h1>
                    <p className="text-white text-xl italic opacity-90 text-center">
                        Les meilleures pizzas de la ville
                    </p>
                </div>
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
