"use client"
import Header from "../../components/ui/header";
import { useState, useCallback, useMemo, useEffect } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, Filter } from "lucide-react";
import { pizzas } from "../data/pizzas";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [filterVegetarian, setFilterVegetarian] = useState(false);
    const [filterBase, setFilterBase] = useState("all"); // all, Tomate, Crème
    const [sortBy, setSortBy] = useState("default"); // default, price-asc, price-desc
    const [isLoading, setIsLoading] = useState(true);
    const [addedToCartId, setAddedToCartId] = useState(null);
    
    // Simuler un chargement initial
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        
        return () => clearTimeout(timer);
    }, []);
    
    // Persister le panier dans le localStorage
    useEffect(() => {
        // Sauvegarder le panier dans localStorage
        if (cart.length > 0) {
            localStorage.setItem('pizzaCart', JSON.stringify(cart));
        }
    }, [cart]);
    
    // Récupérer le panier du localStorage au chargement
    useEffect(() => {
        const savedCart = localStorage.getItem('pizzaCart');
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (e) {
                console.error("Erreur lors du chargement du panier:", e);
            }
        }
    }, []);
    
    const toggleCart = useCallback(() => {
        setIsCartOpen(prev => !prev);
    }, []);
    
    const addToCart = useCallback((pizza) => {
        setAddedToCartId(pizza.id);
        
        setTimeout(() => {
            setAddedToCartId(null);
        }, 1000);
        
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === pizza.id);
            
            if (existingItem) {
                return prevCart.map(item => 
                    item.id === pizza.id 
                        ? { ...item, quantity: item.quantity + 1 } 
                        : item
                );
            } else {
                return [...prevCart, { ...pizza, quantity: 1 }];
            }
        });
        
        // Ouvrir automatiquement le panier lors de l'ajout
        if (!isCartOpen) {
            setIsCartOpen(true);
        }
    }, [isCartOpen]);
    
    const removeFromCart = useCallback((id) => {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    }, []);
    
    const updateQuantity = useCallback((id, change) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === id) {
                const newQuantity = item.quantity + change;
                return newQuantity > 0 
                    ? { ...item, quantity: newQuantity }
                    : item;
            }
            return item;
        }));
    }, []);
    
    const calculateTotal = useCallback(() => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    }, [cart]);
    
    const totalItems = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);
    
    // Filtrer et trier les pizzas (memoized pour éviter des recalculs inutiles)
    const filteredPizzas = useMemo(() => {
        return pizzas
            .filter(pizza => !filterVegetarian || pizza.vegetarienne)
            .filter(pizza => filterBase === "all" || pizza.base === filterBase)
            .sort((a, b) => {
                if (sortBy === "price-asc") return a.price - b.price;
                if (sortBy === "price-desc") return b.price - a.price;
                return 0; // default: ne pas trier
            });
    }, [filterVegetarian, filterBase, sortBy]);

    // Fonction pour rediriger vers la page de checkout
    const goToCheckout = useCallback(() => {
        if (cart.length > 0) {
            router.push('/pizza/checkout');
        }
    }, [cart, router]);

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
                    {/* Contenu principal ici */}
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl transition-all duration-300">
                        <h2 className="text-3xl font-bold text-white mb-6 text-center">Nos Délicieuses Pizzas</h2>
                        
                        {/* Filtres et tri */}
                        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <button 
                                    onClick={() => setFilterVegetarian(!filterVegetarian)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
                                        filterVegetarian 
                                            ? 'bg-green-600 text-white shadow-lg scale-105' 
                                            : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105'
                                    }`}
                                >
                                    <Filter size={16} />
                                    {filterVegetarian ? 'Végétariennes uniquement' : 'Toutes les pizzas'}
                                </button>
                                
                                <div className="flex items-center gap-2">
                                    <span className="text-white">Base:</span>
                                    <select 
                                        value={filterBase}
                                        onChange={(e) => setFilterBase(e.target.value)}
                                        className="bg-white/20 text-white border border-white/30 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 hover:bg-white/30"
                                    >
                                        <option value="all">Toutes</option>
                                        <option value="Tomate">Tomate</option>
                                        <option value="Crème">Crème</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-white">Trier par:</span>
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-white/20 text-white border border-white/30 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 hover:bg-white/30"
                                >
                                    <option value="default">Par défaut</option>
                                    <option value="price-asc">Prix croissant</option>
                                    <option value="price-desc">Prix décroissant</option>
                                </select>
                            </div>
                        </div>
                        
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredPizzas.map((pizza) => (
                                        <div 
                                            key={pizza.id} 
                                            className={`bg-white/20 backdrop-blur-md rounded-lg overflow-hidden border border-white/30 shadow-lg transition-all duration-300 hover:shadow-xl ${
                                                addedToCartId === pizza.id ? 'scale-105 ring-2 ring-yellow-400' : 'hover:scale-105'
                                            }`}
                                        >
                                            <div className="relative h-48 overflow-hidden">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                                                <img 
                                                    src={pizza.image} 
                                                    alt={pizza.name} 
                                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                                    onError={(e) => {
                                                        e.target.src = "/pizza/default-pizza.jpg";
                                                    }}
                                                />
                                                <h3 className="absolute bottom-2 left-3 text-white font-bold text-xl z-20">{pizza.name}</h3>
                                                <div className="absolute top-2 right-2 flex flex-col gap-2 z-20">
                                                    {pizza.vegetarienne && (
                                                        <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full transition-all duration-300 hover:bg-green-600">
                                                            Végétarien
                                                        </span>
                                                    )}
                                                    <span className={`text-white text-xs font-bold px-2 py-1 rounded-full transition-all duration-300 ${
                                                        pizza.base === "Tomate" 
                                                            ? "bg-red-500 hover:bg-red-600" 
                                                            : "bg-yellow-500 hover:bg-yellow-600"
                                                    }`}>
                                                        Base {pizza.base}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-white text-sm mb-3">{pizza.description}</p>
                                                <div className="mb-3">
                                                    <h4 className="text-white text-sm font-semibold mb-1">Ingrédients:</h4>
                                                    <p className="text-white/80 text-sm">{pizza.ingredients.join(", ")}</p>
                                                </div>
                                                <div className="flex justify-between items-center mt-4">
                                                    <span className="text-white font-bold text-xl">{pizza.price.toFixed(2)} €</span>
                                                    <button 
                                                        onClick={() => addToCart(pizza)}
                                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2"
                                                    >
                                                        <ShoppingCart size={16} />
                                                        {addedToCartId === pizza.id ? 'Ajouté !' : 'Ajouter'}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {filteredPizzas.length === 0 && (
                                    <div className="text-center py-10 animate-fade-in">
                                        <p className="text-white text-xl">Aucune pizza ne correspond à vos critères.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
                
                {/* Panier fixe */}
                <div className={`fixed bottom-4 right-4 z-50 transition-all duration-500 ${isCartOpen ? 'w-80' : 'w-16'}`}>
                    {/* Bouton du panier */}
                    <button 
                        onClick={toggleCart}
                        className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-700 transition-all duration-300 hover:scale-110 active:scale-95"
                        aria-label="Panier"
                    >
                        <div className="relative">
                            <ShoppingCart size={24} className={`transition-transform duration-300 ${isCartOpen ? 'rotate-12' : ''}`} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-yellow-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                                    {totalItems}
                                </span>
                            )}
                        </div>
                    </button>
                    
                    {/* Contenu du panier */}
                    {isCartOpen && (
                        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-16 animate-slide-up">
                            <div className="bg-red-600 text-white p-3 flex justify-between items-center">
                                <h3 className="font-bold">Votre Panier</h3>
                                <button onClick={toggleCart} className="text-white hover:text-gray-200 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="max-h-80 overflow-y-auto p-3">
                                {cart.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">Votre panier est vide</p>
                                ) : (
                                    <ul className="divide-y divide-gray-200">
                                        {cart.map((item) => (
                                            <li key={item.id} className="py-3 flex justify-between items-center hover:bg-gray-50 transition-colors rounded-md px-2">
                                                <div>
                                                    <h4 className="font-medium">{item.name}</h4>
                                                    <p className="text-sm text-gray-600">{(item.price * item.quantity).toFixed(2)} €</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        disabled={item.quantity <= 1}
                                                        className="text-gray-500 hover:text-red-600 disabled:opacity-50 transition-colors"
                                                        aria-label="Diminuer la quantité"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="w-6 text-center">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="text-gray-500 hover:text-green-600 transition-colors"
                                                        aria-label="Augmenter la quantité"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-500 hover:text-red-600 ml-2 transition-colors"
                                                        aria-label="Supprimer du panier"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            
                            {cart.length > 0 && (
                                <div className="border-t border-gray-200 p-3">
                                    <div className="flex justify-between font-bold mb-4">
                                        <span>Total:</span>
                                        <span>{calculateTotal()} €</span>
                                    </div>
                                    <button 
                                        onClick={goToCheckout}
                                        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-all duration-300 hover:shadow-lg active:scale-95"
                                    >
                                        Commander
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}   