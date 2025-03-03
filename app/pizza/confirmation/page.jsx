"use client"
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../../components/ui/header";
import { CheckCircle } from "lucide-react";

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
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl transition-all duration-300 max-w-3xl mx-auto">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle size={50} className="text-white" />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2 text-center">Commande confirmée !</h2>
                            <p className="text-white text-center">Merci pour votre commande. Votre pizza est en préparation.</p>
                        </div>
                        
                        {order ? (
                            <div className="space-y-6">
                                <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30">
                                    <h3 className="text-xl font-bold text-white mb-4">Détails de la commande</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-white"><span className="font-semibold">Numéro de commande:</span> #{order.id}</p>
                                            <p className="text-white"><span className="font-semibold">Date:</span> {formatDate(order.date)}</p>
                                            <p className="text-white"><span className="font-semibold">Total:</span> {(parseFloat(order.total) + 2.50).toFixed(2)} €</p>
                                            <p className="text-white"><span className="font-semibold">Méthode de paiement:</span> {order.customer.paymentMethod === 'card' ? 'Carte bancaire' : 'Espèces à la livraison'}</p>
                                        </div>
                                        <div>
                                            <p className="text-white"><span className="font-semibold">Nom:</span> {order.customer.firstName} {order.customer.lastName}</p>
                                            <p className="text-white"><span className="font-semibold">Adresse:</span> {order.customer.address}</p>
                                            <p className="text-white"><span className="font-semibold">Ville:</span> {order.customer.postalCode} {order.customer.city}</p>
                                            <p className="text-white"><span className="font-semibold">Email:</span> {order.customer.email}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 border border-white/30">
                                    <h3 className="text-xl font-bold text-white mb-4">Récapitulatif de votre commande</h3>
                                    <ul className="divide-y divide-white/20">
                                        {order.items.map((item) => (
                                            <li key={item.id} className="py-3 flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-medium text-white">{item.name}</h4>
                                                    <p className="text-sm text-white/80">{item.quantity} x {item.price.toFixed(2)} €</p>
                                                </div>
                                                <p className="text-white font-bold">{(item.price * item.quantity).toFixed(2)} €</p>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="border-t border-white/20 mt-4 pt-4">
                                        <div className="flex justify-between font-bold text-white mb-2">
                                            <span>Sous-total:</span>
                                            <span>{order.total} €</span>
                                        </div>
                                        <div className="flex justify-between text-white mb-2">
                                            <span>Frais de livraison:</span>
                                            <span>2.50 €</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-white text-xl mt-4">
                                            <span>Total:</span>
                                            <span>{(parseFloat(order.total) + 2.50).toFixed(2)} €</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex justify-center mt-6">
                                    <button 
                                        onClick={() => router.push('/pizza')}
                                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md transition-all duration-300 hover:shadow-lg active:scale-95"
                                    >
                                        Retour à l'accueil
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center items-center py-10">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
} 