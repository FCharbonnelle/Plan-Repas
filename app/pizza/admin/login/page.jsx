"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../../components/ui/header";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, LogIn, AlertCircle } from "lucide-react";

export default function AdminLogin() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        
        // Simuler un délai pour l'authentification
        setTimeout(() => {
            if (password === "1234") {
                // Stocker l'état d'authentification dans localStorage
                localStorage.setItem("pizzaAdminAuth", "true");
                // Rediriger vers le dashboard admin
                router.push("/pizza/admin/dashboard");
            } else {
                setError("Mot de passe incorrect");
                setIsLoading(false);
            }
        }, 800);
    };
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow relative" style={{ 
                backgroundImage: "url('/pizza/ardoise.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed"
            }}>
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"></div>
                <div className="container mx-auto relative z-10 py-8 px-4 flex items-center justify-center min-h-[calc(100vh-200px)]">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl transition-all duration-300 max-w-md w-full"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.back()}
                                className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                <span>Retour</span>
                            </motion.button>
                        </div>
                        
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-20 h-20 bg-gray-800/80 rounded-full flex items-center justify-center mb-6 shadow-lg">
                                <Lock size={40} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2 text-center">Back-Office</h2>
                            <p className="text-white/80 text-center">Veuillez vous authentifier pour accéder au back-office</p>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 flex items-center gap-2 text-white"
                                >
                                    <AlertCircle size={18} />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                            
                            <div>
                                <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                                    Mot de passe
                                </label>
                                <input 
                                    type="password" 
                                    id="password" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                    placeholder="Entrez le mot de passe"
                                    required
                                />
                            </div>
                            
                            <motion.button 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-gradient-to-r from-gray-700 to-gray-900 text-white py-3 rounded-lg transition-all duration-300 shadow-lg font-medium flex items-center justify-center ${isLoading ? 'opacity-70' : 'hover:from-gray-800 hover:to-black'}`}
                            >
                                {isLoading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                                ) : (
                                    <>
                                        <LogIn size={18} className="mr-2" />
                                        Se connecter
                                    </>
                                )}
                            </motion.button>
                        </form>
                    </motion.div>
                </div>
            </main>
        </div>
    );
} 