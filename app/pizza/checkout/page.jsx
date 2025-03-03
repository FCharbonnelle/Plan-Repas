"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/ui/header";
import { v4 as uuidv4 } from 'uuid';

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
    
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow relative" style={{ 
                backgroundImage: "url('/pizza/ardoise.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed"
            }}>
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
                <div className="container mx-auto relative z-10 py-8 px-4">
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl transition-all duration-300">
                        <h2 className="text-3xl font-bold text-white mb-6 text-center">Récapitulatif de votre commande</h2>
                        <p className="text-white text-center mb-6">Commande #{orderId}</p>
                        
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Récapitulatif du panier */}
                            <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30">
                                <h3 className="text-xl font-bold text-white mb-4">Votre panier</h3>
                                
                                <div className="max-h-80 overflow-y-auto mb-4">
                                    {cart.length > 0 ? (
                                        <ul className="divide-y divide-white/20">
                                            {cart.map((item) => (
                                                <li key={item.id} className="py-3 flex justify-between items-center">
                                                    <div>
                                                        <h4 className="font-medium text-white">{item.name}</h4>
                                                        <p className="text-sm text-white/80">{item.quantity} x {item.price.toFixed(2)} €</p>
                                                    </div>
                                                    <p className="text-white font-bold">{(item.price * item.quantity).toFixed(2)} €</p>
                                                </li>
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
                                    <div className="flex justify-between font-bold text-white text-xl mt-4">
                                        <span>Total:</span>
                                        <span>{(parseFloat(calculateTotal()) + 2.50).toFixed(2)} €</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Formulaire client */}
                            <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30">
                                <h3 className="text-xl font-bold text-white mb-4">Vos informations</h3>
                                
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="firstName" className="block text-white text-sm font-medium mb-1">Prénom</label>
                                            <input 
                                                type="text" 
                                                id="firstName" 
                                                name="firstName" 
                                                value={formData.firstName} 
                                                onChange={handleChange} 
                                                required 
                                                className="w-full bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="lastName" className="block text-white text-sm font-medium mb-1">Nom</label>
                                            <input 
                                                type="text" 
                                                id="lastName" 
                                                name="lastName" 
                                                value={formData.lastName} 
                                                onChange={handleChange} 
                                                required 
                                                className="w-full bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="email" className="block text-white text-sm font-medium mb-1">Email</label>
                                        <input 
                                            type="email" 
                                            id="email" 
                                            name="email" 
                                            value={formData.email} 
                                            onChange={handleChange} 
                                            required 
                                            className="w-full bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="phone" className="block text-white text-sm font-medium mb-1">Téléphone</label>
                                        <input 
                                            type="tel" 
                                            id="phone" 
                                            name="phone" 
                                            value={formData.phone} 
                                            onChange={handleChange} 
                                            required 
                                            className="w-full bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="address" className="block text-white text-sm font-medium mb-1">Adresse</label>
                                        <input 
                                            type="text" 
                                            id="address" 
                                            name="address" 
                                            value={formData.address} 
                                            onChange={handleChange} 
                                            required 
                                            className="w-full bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="postalCode" className="block text-white text-sm font-medium mb-1">Code postal</label>
                                            <input 
                                                type="text" 
                                                id="postalCode" 
                                                name="postalCode" 
                                                value={formData.postalCode} 
                                                onChange={handleChange} 
                                                required 
                                                className="w-full bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="city" className="block text-white text-sm font-medium mb-1">Ville</label>
                                            <input 
                                                type="text" 
                                                id="city" 
                                                name="city" 
                                                value={formData.city} 
                                                onChange={handleChange} 
                                                required 
                                                className="w-full bg-white/10 border border-white/30 rounded-md px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-white text-sm font-medium mb-1">Méthode de paiement</label>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <label className={`flex items-center justify-center p-3 border rounded-md cursor-pointer transition-all duration-300 ${formData.paymentMethod === 'card' ? 'bg-red-600 border-white' : 'bg-white/10 border-white/30 hover:bg-white/20'}`}>
                                                <input 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    value="card" 
                                                    checked={formData.paymentMethod === 'card'} 
                                                    onChange={handleChange} 
                                                    className="sr-only"
                                                />
                                                <span className="text-white">Carte bancaire</span>
                                            </label>
                                            <label className={`flex items-center justify-center p-3 border rounded-md cursor-pointer transition-all duration-300 ${formData.paymentMethod === 'cash' ? 'bg-red-600 border-white' : 'bg-white/10 border-white/30 hover:bg-white/20'}`}>
                                                <input 
                                                    type="radio" 
                                                    name="paymentMethod" 
                                                    value="cash" 
                                                    checked={formData.paymentMethod === 'cash'} 
                                                    onChange={handleChange} 
                                                    className="sr-only"
                                                />
                                                <span className="text-white">Espèces à la livraison</span>
                                            </label>
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end mt-6">
                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md transition-all duration-300 hover:shadow-lg active:scale-95 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Traitement en cours...
                                                </>
                                            ) : (
                                                'Valider et payer'
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
} 