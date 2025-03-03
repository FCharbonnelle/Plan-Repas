"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../../components/ui/header";
import { motion, AnimatePresence } from "framer-motion";
import { 
    ShoppingBag, 
    Clock, 
    CheckCircle, 
    Truck, 
    LogOut, 
    ChevronDown, 
    ChevronUp, 
    History, 
    AlertTriangle,
    Search
} from "lucide-react";

// États possibles pour une commande
const ORDER_STATES = [
    { id: "ordered", label: "Commandée", icon: ShoppingBag, color: "bg-blue-500" },
    { id: "preparing", label: "En préparation", icon: Clock, color: "bg-yellow-500" },
    { id: "ready", label: "Prête", icon: CheckCircle, color: "bg-green-500" },
    { id: "delivered", label: "Livrée", icon: Truck, color: "bg-purple-500" }
];

export default function AdminDashboard() {
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    
    // Vérifier l'authentification
    useEffect(() => {
        const isAuthenticated = localStorage.getItem("pizzaAdminAuth") === "true";
        if (!isAuthenticated) {
            router.push("/pizza/admin/login");
            return;
        }
        
        // Charger les commandes depuis localStorage
        loadOrders();
    }, [router]);
    
    const loadOrders = () => {
        setIsLoading(true);
        setTimeout(() => {
            try {
                const savedOrders = JSON.parse(localStorage.getItem("pizzaOrders") || "[]");
                
                // Ajouter un état par défaut aux commandes si elles n'en ont pas
                const ordersWithState = savedOrders.map(order => ({
                    ...order,
                    state: order.state || "ordered"
                }));
                
                // Trier les commandes par date (les plus récentes d'abord)
                ordersWithState.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                setOrders(ordersWithState);
            } catch (error) {
                console.error("Erreur lors du chargement des commandes:", error);
                setOrders([]);
            } finally {
                setIsLoading(false);
            }
        }, 800);
    };
    
    const updateOrderState = (orderId, newState) => {
        const updatedOrders = orders.map(order => 
            order.id === orderId 
                ? { ...order, state: newState } 
                : order
        );
        
        setOrders(updatedOrders);
        localStorage.setItem("pizzaOrders", JSON.stringify(updatedOrders));
    };
    
    const handleLogout = () => {
        localStorage.removeItem("pizzaAdminAuth");
        router.push("/pizza");
    };
    
    const toggleOrderExpand = (orderId) => {
        setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
    };
    
    const toggleHistory = () => {
        setShowHistory(!showHistory);
    };
    
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
    
    // Obtenir l'icône correspondant à l'état
    const getStateIcon = (stateId) => {
        const state = ORDER_STATES.find(s => s.id === stateId);
        if (!state) return <ShoppingBag size={24} className="text-white" />;
        
        const IconComponent = state.icon;
        return <IconComponent size={24} className="text-white" />;
    };
    
    // Obtenir la couleur correspondant à l'état
    const getStateColor = (stateId) => {
        const state = ORDER_STATES.find(s => s.id === stateId);
        return state ? state.color : "bg-gray-500";
    };
    
    // Filtrer les commandes en fonction de l'historique et de la recherche
    const filteredOrders = orders.filter(order => {
        // Filtrer par historique
        if (!showHistory && order.state === "delivered") {
            return false;
        }
        
        // Filtrer par recherche
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            return (
                order.id.toLowerCase().includes(searchLower) ||
                order.customer.firstName.toLowerCase().includes(searchLower) ||
                order.customer.lastName.toLowerCase().includes(searchLower) ||
                order.items.some(item => item.name.toLowerCase().includes(searchLower))
            );
        }
        
        return true;
    });
    
    // Obtenir le nombre de commandes par état
    const getOrderCountByState = (state) => {
        return orders.filter(order => order.state === state).length;
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
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl transition-all duration-300"
                    >
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div>
                                <h2 className="text-3xl font-bold text-white">Back-Office</h2>
                                <p className="text-white/70">Gestion des commandes</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={toggleHistory}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                                        showHistory 
                                            ? 'bg-purple-600 text-white' 
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                                >
                                    <History size={18} />
                                    {showHistory ? 'Masquer l\'historique' : 'Voir l\'historique'}
                                </motion.button>
                                
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-300"
                                >
                                    <LogOut size={18} />
                                    Déconnexion
                                </motion.button>
                            </div>
                        </div>
                        
                        {/* Statistiques */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {ORDER_STATES.map((state) => {
                                const StateIcon = state.icon;
                                return (
                                    <div 
                                        key={state.id}
                                        className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 ${state.color} rounded-full flex items-center justify-center`}>
                                                <StateIcon size={20} className="text-white" />
                                            </div>
                                            <div>
                                                <p className="text-white/70 text-sm">{state.label}</p>
                                                <p className="text-white font-bold text-xl">{getOrderCountByState(state.id)}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        
                        {/* Barre de recherche */}
                        <div className="mb-6">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Rechercher une commande..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white/10 border border-white/30 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={18} />
                            </div>
                        </div>
                        
                        {/* Liste des commandes */}
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : filteredOrders.length > 0 ? (
                            <div className="space-y-4">
                                {filteredOrders.map((order) => {
                                    const StateIcon = ORDER_STATES.find(s => s.id === order.state)?.icon || ShoppingBag;
                                    return (
                                        <motion.div 
                                            key={order.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={`bg-white/20 backdrop-blur-sm rounded-xl border overflow-hidden transition-all duration-300 ${
                                                expandedOrderId === order.id 
                                                    ? 'border-white/40 shadow-lg' 
                                                    : 'border-white/20'
                                            }`}
                                        >
                                            {/* En-tête de la commande */}
                                            <div 
                                                className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer"
                                                onClick={() => toggleOrderExpand(order.id)}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="flex-shrink-0">
                                                        <div className={`w-12 h-12 ${getStateColor(order.state)} rounded-full flex items-center justify-center`}>
                                                            <StateIcon size={24} className="text-white" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-white font-bold text-lg">Commande #{order.id}</h3>
                                                        <p className="text-white/70">{formatDate(order.date)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="text-right">
                                                        <p className="text-white">{order.customer.firstName} {order.customer.lastName}</p>
                                                        <p className="text-white/70">{(parseFloat(order.total) + 2.50).toFixed(2)} €</p>
                                                    </div>
                                                    <div className="text-white">
                                                        {expandedOrderId === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {/* Détails de la commande */}
                                            <AnimatePresence>
                                                {expandedOrderId === order.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="border-t border-white/20 p-4">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                                                {/* Informations client */}
                                                                <div>
                                                                    <h4 className="text-white font-semibold mb-3">Informations client</h4>
                                                                    <div className="space-y-2 text-white/80">
                                                                        <p><span className="text-white/60">Nom:</span> {order.customer.firstName} {order.customer.lastName}</p>
                                                                        <p><span className="text-white/60">Email:</span> {order.customer.email}</p>
                                                                        <p><span className="text-white/60">Téléphone:</span> {order.customer.phone}</p>
                                                                        <p><span className="text-white/60">Adresse:</span> {order.customer.address}, {order.customer.postalCode} {order.customer.city}</p>
                                                                        <p><span className="text-white/60">Paiement:</span> {order.customer.paymentMethod === 'card' ? 'Carte bancaire' : 'Espèces à la livraison'}</p>
                                                                    </div>
                                                                </div>
                                                                
                                                                {/* Articles commandés */}
                                                                <div>
                                                                    <h4 className="text-white font-semibold mb-3">Articles commandés</h4>
                                                                    <ul className="space-y-2">
                                                                        {order.items.map((item) => (
                                                                            <li key={item.id} className="flex justify-between text-white/80">
                                                                                <span>{item.quantity}x {item.name}</span>
                                                                                <span>{(item.price * item.quantity).toFixed(2)} €</span>
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                    <div className="border-t border-white/20 mt-3 pt-3">
                                                                        <div className="flex justify-between text-white/80">
                                                                            <span>Sous-total:</span>
                                                                            <span>{order.total} €</span>
                                                                        </div>
                                                                        <div className="flex justify-between text-white/80">
                                                                            <span>Livraison:</span>
                                                                            <span>2.50 €</span>
                                                                        </div>
                                                                        <div className="flex justify-between text-white font-bold mt-2">
                                                                            <span>Total:</span>
                                                                            <span>{(parseFloat(order.total) + 2.50).toFixed(2)} €</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            
                                                            {/* Gestion de l'état */}
                                                            <div className="border-t border-white/20 pt-4">
                                                                <h4 className="text-white font-semibold mb-3">État de la commande</h4>
                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                                    {ORDER_STATES.map((state) => {
                                                                        const StateIcon = state.icon;
                                                                        return (
                                                                            <button
                                                                                key={state.id}
                                                                                onClick={() => updateOrderState(order.id, state.id)}
                                                                                className={`flex items-center justify-center gap-2 p-3 rounded-lg transition-all duration-300 ${
                                                                                    order.state === state.id
                                                                                        ? `${state.color} text-white font-medium`
                                                                                        : 'bg-white/10 text-white hover:bg-white/20'
                                                                                }`}
                                                                            >
                                                                                <StateIcon size={16} />
                                                                                {state.label}
                                                                            </button>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
                                <div className="flex justify-center mb-4">
                                    <AlertTriangle size={48} className="text-yellow-500" />
                                </div>
                                <h3 className="text-white text-xl font-bold mb-2">Aucune commande trouvée</h3>
                                <p className="text-white/70">
                                    {searchTerm 
                                        ? "Aucune commande ne correspond à votre recherche." 
                                        : showHistory 
                                            ? "Aucune commande n'a été passée." 
                                            : "Aucune commande active. Activez l'historique pour voir les commandes livrées."}
                                </p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </main>
        </div>
    );
} 