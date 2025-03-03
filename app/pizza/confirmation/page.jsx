"use client"
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../../components/ui/header";
import { CheckCircle, ArrowLeft, ShoppingBag, MapPin, Phone, Mail, Calendar, CreditCard, Banknote, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function Confirmation() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState(null);
    
    useEffect(() => {
        if (!orderId) {
            router.push('/pizza');
            return;
        }
        
        // Récupérer la commande depuis localStorage
        const savedOrders = JSON.parse(localStorage.getItem('pizzaOrders') || '[]');
        const foundOrder = savedOrders.find(o => o.id === orderId);
        
        if (foundOrder) {
            setOrder(foundOrder);
        } else {
            router.push('/pizza');
        }
    }, [orderId, router]);
    
    // Formater la date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };
    
    // Fonction pour naviguer vers la page d'authentification du back-office
    const goToBackOffice = () => {
        router.push('/pizza/admin/login');
    };
    
    // Variants pour les animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { 
                staggerChildren: 0.1
            }
        }
    };
    
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { 
            y: 0, 
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
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
                <div className="container mx-auto relative z-10 py-8 px-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl transition-all duration-300 max-w-4xl mx-auto"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/pizza')}
                                className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                <span>Retour à l'accueil</span>
                            </motion.button>
                            
                            <div className="w-24"></div> {/* Spacer pour centrer le titre */}
                        </div>
                        
                        <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col items-center mb-8"
                        >
                            <motion.div 
                                variants={itemVariants}
                                className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6 shadow-lg"
                            >
                                <CheckCircle size={60} className="text-white" />
                            </motion.div>
                            <motion.h2 
                                variants={itemVariants}
                                className="text-4xl font-bold text-white mb-3 text-center"
                            >
                                Commande confirmée !
                            </motion.h2>
                            <motion.p 
                                variants={itemVariants}
                                className="text-white text-center text-lg"
                            >
                                Merci pour votre commande. Votre pizza est en préparation.
                            </motion.p>
                            <motion.div 
                                variants={itemVariants}
                                className="mt-4 bg-white/20 px-6 py-2 rounded-full backdrop-blur-sm"
                            >
                                <p className="text-white font-medium">Commande #{order?.id}</p>
                            </motion.div>
                        </motion.div>
                        
                        {order ? (
                            <div className="space-y-8">
                                <motion.div 
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-lg"
                                >
                                    <motion.h3 
                                        variants={itemVariants}
                                        className="text-xl font-bold text-white mb-6 flex items-center"
                                    >
                                        <ShoppingBag size={20} className="mr-2" />
                                        Détails de la commande
                                    </motion.h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <motion.div variants={itemVariants} className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <Calendar size={18} className="text-white mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-white/70 text-sm">Date de commande</p>
                                                    <p className="text-white font-medium">{formatDate(order.date)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                {order.customer.paymentMethod === 'card' ? (
                                                    <CreditCard size={18} className="text-white mt-0.5 flex-shrink-0" />
                                                ) : (
                                                    <Banknote size={18} className="text-white mt-0.5 flex-shrink-0" />
                                                )}
                                                <div>
                                                    <p className="text-white/70 text-sm">Méthode de paiement</p>
                                                    <p className="text-white font-medium">
                                                        {order.customer.paymentMethod === 'card' ? 'Carte bancaire' : 'Espèces à la livraison'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <ShoppingBag size={18} className="text-white mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-white/70 text-sm">Total</p>
                                                    <p className="text-white font-medium text-lg">{(parseFloat(order.total) + 2.50).toFixed(2)} €</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                        <motion.div variants={itemVariants} className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <MapPin size={18} className="text-white mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-white/70 text-sm">Adresse de livraison</p>
                                                    <p className="text-white font-medium">{order.customer.firstName} {order.customer.lastName}</p>
                                                    <p className="text-white">{order.customer.address}</p>
                                                    <p className="text-white">{order.customer.postalCode} {order.customer.city}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Phone size={18} className="text-white mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-white/70 text-sm">Téléphone</p>
                                                    <p className="text-white font-medium">{order.customer.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <Mail size={18} className="text-white mt-0.5 flex-shrink-0" />
                                                <div>
                                                    <p className="text-white/70 text-sm">Email</p>
                                                    <p className="text-white font-medium">{order.customer.email}</p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </motion.div>
                                
                                <motion.div 
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-lg"
                                >
                                    <motion.h3 
                                        variants={itemVariants}
                                        className="text-xl font-bold text-white mb-6 flex items-center"
                                    >
                                        <ShoppingBag size={20} className="mr-2" />
                                        Récapitulatif de votre commande
                                    </motion.h3>
                                    <motion.ul 
                                        variants={containerVariants}
                                        className="divide-y divide-white/20 mb-6"
                                    >
                                        {order.items.map((item) => (
                                            <motion.li 
                                                key={item.id} 
                                                variants={itemVariants}
                                                className="py-4 flex justify-between items-center"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-white/10">
                                                        <img 
                                                            src={item.image} 
                                                            alt={item.name} 
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = "/pizza/default-pizza.jpg";
                                                            }}
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-medium text-white text-lg">{item.name}</h4>
                                                        <p className="text-sm text-white/80">{item.quantity} x {item.price.toFixed(2)} €</p>
                                                    </div>
                                                </div>
                                                <p className="text-white font-bold text-lg">{(item.price * item.quantity).toFixed(2)} €</p>
                                            </motion.li>
                                        ))}
                                    </motion.ul>
                                    <motion.div 
                                        variants={itemVariants}
                                        className="border-t border-white/20 pt-4"
                                    >
                                        <div className="flex justify-between text-white mb-2">
                                            <span>Sous-total:</span>
                                            <span>{order.total} €</span>
                                        </div>
                                        <div className="flex justify-between text-white mb-2">
                                            <span>Frais de livraison:</span>
                                            <span>2.50 €</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-white text-xl mt-4 bg-white/10 p-3 rounded-lg">
                                            <span>Total:</span>
                                            <span>{(parseFloat(order.total) + 2.50).toFixed(2)} €</span>
                                        </div>
                                    </motion.div>
                                </motion.div>
                                
                                <motion.div 
                                    variants={itemVariants}
                                    className="flex justify-center mt-8"
                                >
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => router.push('/pizza')}
                                        className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-3 rounded-lg transition-all duration-300 shadow-lg font-medium"
                                    >
                                        Retour à l'accueil
                                    </motion.button>
                                </motion.div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center py-16">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
                            </div>
                        )}
                    </motion.div>
                </div>
                
                {/* Bouton Back-Office */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToBackOffice}
                    className="fixed bottom-6 right-6 z-50 bg-gray-800/80 backdrop-blur-md text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 border border-white/20 hover:bg-gray-700/80 transition-all duration-300"
                >
                    <Lock size={16} />
                    Back-Office
                </motion.button>
            </main>
        </div>
    );
} 