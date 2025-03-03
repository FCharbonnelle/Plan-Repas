"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/ui/header";
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import { CreditCard, Banknote, ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';

export default function Checkout() {
    const router = useRouter();
    const [cart, setCart] = useState([]);
    const [orderId, setOrderId] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        postalCode: "",
        city: "",
        paymentMethod: "card"
    });
    
    // Charger le panier depuis localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('pizzaCart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
                // Générer un ID de commande unique
                setOrderId(uuidv4().slice(0, 8).toUpperCase());
            } catch (e) {
                console.error("Erreur lors du chargement du panier:", e);
                router.push('/pizza'); // Rediriger vers la page principale en cas d'erreur
            }
        } else {
            // Rediriger si le panier est vide
            router.push('/pizza');
        }
    }, [router]);
    
    // Calculer le total
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };
    
    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    // Soumettre la commande
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        try {
            // Simuler un appel API pour enregistrer la commande
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Créer l'objet de commande
            const order = {
                id: orderId,
                items: cart,
                total: calculateTotal(),
                customer: formData,
                date: new Date().toISOString()
            };
            
            // Enregistrer la commande dans localStorage (dans un vrai projet, ce serait envoyé à une API)
            const savedOrders = JSON.parse(localStorage.getItem('pizzaOrders') || '[]');
            savedOrders.push(order);
            localStorage.setItem('pizzaOrders', JSON.stringify(savedOrders));
            
            // Vider le panier
            localStorage.removeItem('pizzaCart');
            
            // Rediriger vers une page de confirmation
            router.push(`/pizza/confirmation?orderId=${orderId}`);
        } catch (error) {
            console.error("Erreur lors de la soumission de la commande:", error);
            setIsSubmitting(false);
        }
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
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl transition-all duration-300 max-w-6xl mx-auto"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => router.push('/pizza')}
                                className="flex items-center gap-2 text-white hover:text-yellow-300 transition-colors"
                            >
                                <ArrowLeft size={20} />
                                <span>Retour</span>
                            </motion.button>
                            
                            <h2 className="text-3xl md:text-4xl font-bold text-white text-center">Finaliser votre commande</h2>
                            
                            <div className="w-24"></div> {/* Spacer pour centrer le titre */}
                        </div>
                        
                        <div className="flex items-center justify-center mb-4">
                            <div className="flex items-center text-white">
                                <ShoppingBag className="mr-2" size={20} />
                                <p className="text-lg">Commande #{orderId}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Récapitulatif du panier */}
                            <motion.div 
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-lg"
                            >
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                    <ShoppingBag size={20} className="mr-2" />
                                    Votre panier
                                </h3>
                                
                                <div className="max-h-80 overflow-y-auto mb-4 pr-2 custom-scrollbar">
                                    {cart.length > 0 ? (
                                        <ul className="divide-y divide-white/20">
                                            {cart.map((item) => (
                                                <motion.li 
                                                    key={item.id} 
                                                    variants={itemVariants}
                                                    className="py-3 flex justify-between items-center"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-md overflow-hidden bg-white/10">
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
                                                            <h4 className="font-medium text-white">{item.name}</h4>
                                                            <p className="text-sm text-white/80">{item.quantity} x {item.price.toFixed(2)} €</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-white font-bold">{(item.price * item.quantity).toFixed(2)} €</p>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-white text-center py-4">Chargement...</p>
                                    )}
                                </div>
                                
                                <div className="border-t border-white/20 pt-4">
                                    <div className="flex justify-between font-bold text-white mb-2">
                                        <span>Sous-total:</span>
                                        <span>{calculateTotal()} €</span>
                                    </div>
                                    <div className="flex justify-between text-white mb-2">
                                        <span>Frais de livraison:</span>
                                        <span>2.50 €</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-white text-xl mt-4 bg-white/10 p-3 rounded-lg">
                                        <span>Total:</span>
                                        <span>{(parseFloat(calculateTotal()) + 2.50).toFixed(2)} €</span>
                                    </div>
                                </div>
                            </motion.div>
                            
                            {/* Formulaire client */}
                            <motion.div 
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="bg-white/20 backdrop-blur-md rounded-xl p-6 border border-white/30 shadow-lg"
                            >
                                <h3 className="text-xl font-bold text-white mb-4">Vos informations</h3>
                                
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <motion.div variants={itemVariants}>
                                            <label htmlFor="firstName" className="block text-white text-sm font-medium mb-1">Prénom</label>
                                            <input 
                                                type="text" 
                                                id="firstName" 
                                                name="firstName" 
                                                value={formData.firstName} 
                                                onChange={handleChange} 
                                                required 
                                                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                                placeholder="Votre prénom"
                                            />
                                        </motion.div>
                                        <motion.div variants={itemVariants}>
                                            <label htmlFor="lastName" className="block text-white text-sm font-medium mb-1">Nom</label>
                                            <input 
                                                type="text" 
                                                id="lastName" 
                                                name="lastName" 
                                                value={formData.lastName} 
                                                onChange={handleChange} 
                                                required 
                                                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                                placeholder="Votre nom"
                                            />
                                        </motion.div>
                                    </div>
                                    
                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="email" className="block text-white text-sm font-medium mb-1">Email</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            required 
                                            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                            placeholder="votre@email.com"
                                        />
                                    </motion.div>
                                    
                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="phone" className="block text-white text-sm font-medium mb-1">Téléphone</label>
                                        <input 
                                            type="tel" 
                                            id="phone" 
                                            name="phone" 
                                            value={formData.phone} 
                                            onChange={handleChange} 
                                            required 
                                            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                            placeholder="06 12 34 56 78"
                                        />
                                    </motion.div>
                                    
                                    <motion.div variants={itemVariants}>
                                        <label htmlFor="address" className="block text-white text-sm font-medium mb-1">Adresse</label>
                                        <input 
                                            type="text" 
                                            id="address" 
                                            name="address" 
                                            value={formData.address} 
                                            onChange={handleChange} 
                                            required 
                                            className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                            placeholder="123 rue de la Pizza"
                                        />
                                    </motion.div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <motion.div variants={itemVariants}>
                                            <label htmlFor="postalCode" className="block text-white text-sm font-medium mb-1">Code postal</label>
                                            <input 
                                                type="text" 
                                                id="postalCode" 
                                                name="postalCode" 
                                                value={formData.postalCode} 
                                                onChange={handleChange} 
                                                required 
                                                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                                placeholder="75000"
                                            />
                                        </motion.div>
                                        <motion.div variants={itemVariants}>
                                            <label htmlFor="city" className="block text-white text-sm font-medium mb-1">Ville</label>
                                            <input 
                                                type="text" 
                                                id="city" 
                                                name="city" 
                                                value={formData.city} 
                                                onChange={handleChange} 
                                                required 
                                                className="w-full bg-white/10 border border-white/30 rounded-lg px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
                                                placeholder="Paris"
                                            />
                                        </motion.div>
                                    </div>
                                    
                                    <motion.div variants={itemVariants}>
                                        <label className="block text-white text-sm font-medium mb-2">Méthode de paiement</label>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-300 ${formData.paymentMethod === 'card' ? 'bg-red-600 border-white shadow-lg' : 'bg-white/10 border-white/30 hover:bg-white/20'}`}>
                                                <input 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    value="card" 
                                                    checked={formData.paymentMethod === 'card'} 
                                                    onChange={handleChange} 
                                                    className="sr-only"
                                                />
                                                <div className="flex flex-col items-center">
                                                    <CreditCard size={24} className="text-white mb-2" />
                                                    <span className="text-white text-sm">Carte bancaire</span>
                                                </div>
                                            </label>
                                            <label className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-300 ${formData.paymentMethod === 'cash' ? 'bg-red-600 border-white shadow-lg' : 'bg-white/10 border-white/30 hover:bg-white/20'}`}>
                                                <input 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    value="cash" 
                                                    checked={formData.paymentMethod === 'cash'} 
                                                    onChange={handleChange} 
                                                    className="sr-only"
                                                />
                                                <div className="flex flex-col items-center">
                                                    <Banknote size={24} className="text-white mb-2" />
                                                    <span className="text-white text-sm">Espèces à la livraison</span>
                                                </div>
                                            </label>
                                        </div>
                                    </motion.div>
                                    
                                    <motion.div 
                                        variants={itemVariants}
                                        className="pt-4"
                                    >
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className={`w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-lg transition-all duration-300 shadow-lg font-medium flex items-center justify-center ${isSubmitting ? 'opacity-70' : 'hover:from-red-700 hover:to-red-600'}`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Loader2 size={20} className="animate-spin mr-2" />
                                                    Traitement en cours...
                                                </>
                                            ) : (
                                                'Valider et payer'
                                            )}
                                        </button>
                                    </motion.div>
                                </form>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
} 