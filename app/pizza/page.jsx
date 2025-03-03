"use client"
import Header from "../../components/ui/header";
import { useState, useCallback, useMemo, useEffect } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, Filter, ChevronUp } from "lucide-react";
import { pizzas } from "../data/pizzas";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
    const router = useRouter();
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [filterVegetarian, setFilterVegetarian] = useState(false);
    const [filterBase, setFilterBase] = useState("all"); // all, Tomate, Crème
    const [sortBy, setSortBy] = useState("default"); // default, price-asc, price-desc
    const [isLoading, setIsLoading] = useState(true);
    const [addedToCartId, setAddedToCartId] = useState(null);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [activeImageId, setActiveImageId] = useState(null);
    
    // Simuler un chargement initial
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 800);
        
        return () => clearTimeout(timer);
    }, []);
    
    // Détecter le défilement pour afficher le bouton de retour en haut
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 300);
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Fonction pour remonter en haut de la page
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };
    
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
    
    // Fonction pour rediriger vers la page de checkout
    const goToCheckout = useCallback(() => {
        if (cart.length > 0) {
            router.push('/pizza/checkout');
        }
    }, [cart, router]);
    
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
                    {/* Contenu principal ici */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl transition-all duration-300"
                    >
                        <h2 className="text-4xl font-bold text-white mb-8 text-center">Nos Délicieuses Pizzas</h2>
                        
                        {/* Filtres et tri */}
                        <div className="flex flex-wrap justify-between items-center mb-8 gap-4 bg-black/20 p-4 rounded-xl backdrop-blur-sm">
                            <div className="flex flex-wrap items-center gap-3">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setFilterVegetarian(!filterVegetarian)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-300 ${
                                        filterVegetarian 
                                            ? 'bg-green-600 text-white shadow-lg' 
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                                >
                                    <Filter size={16} />
                                    {filterVegetarian ? 'Végétariennes uniquement' : 'Toutes les pizzas'}
                                </motion.button>
                                
                                <div className="flex items-center gap-2">
                                    <span className="text-white">Base:</span>
                                    <select 
                                        value={filterBase}
                                        onChange={(e) => setFilterBase(e.target.value)}
                                        className="bg-white/20 text-white border border-white/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 hover:bg-white/30"
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
                                    className="bg-white/20 text-white border border-white/30 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 hover:bg-white/30"
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
                                <motion.div 
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="grid grid-cols-1 md:grid-cols-2 gap-8"
                                >
                                    {filteredPizzas.map((pizza) => (
                                        <motion.div 
                                            key={pizza.id} 
                                            variants={itemVariants}
                                            className={`bg-white/20 backdrop-blur-md rounded-xl overflow-hidden border border-white/30 shadow-xl transition-all duration-300 hover:shadow-2xl ${
                                                addedToCartId === pizza.id ? 'ring-2 ring-yellow-400' : ''
                                            }`}
                                        >
                                            <div 
                                                className="relative h-80 overflow-hidden cursor-pointer"
                                                onMouseEnter={() => setActiveImageId(pizza.id)}
                                                onMouseLeave={() => setActiveImageId(null)}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10"></div>
                                                <motion.img 
                                                    src={pizza.image} 
                                                    alt={pizza.name} 
                                                    className="w-full h-full object-cover brightness-110 contrast-110 saturate-110"
                                                    initial={{ scale: 1 }}
                                                    animate={{ 
                                                        scale: activeImageId === pizza.id ? 1.15 : 1,
                                                        filter: activeImageId === pizza.id ? 'brightness(1.2) contrast(1.1) saturate(1.2)' : 'brightness(1.1) contrast(1.1) saturate(1.1)'
                                                    }}
                                                    transition={{ duration: 0.7, ease: "easeOut" }}
                                                    onError={(e) => {
                                                        e.target.src = "/pizza/default-pizza.jpg";
                                                    }}
                                                />
                                                <div className={`absolute inset-0 transition-all duration-500 ${activeImageId === pizza.id ? 'bg-black/0' : 'bg-black/10'}`}></div>
                                                <motion.div 
                                                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent h-24 z-15"
                                                    initial={{ opacity: 0.7 }}
                                                    animate={{ opacity: activeImageId === pizza.id ? 0.9 : 0.7 }}
                                                    transition={{ duration: 0.3 }}
                                                ></motion.div>
                                                <motion.h3 
                                                    className="absolute bottom-4 left-4 text-white font-bold text-2xl z-20 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                                                    initial={{ y: 0 }}
                                                    animate={{ y: activeImageId === pizza.id ? -5 : 0 }}
                                                    transition={{ duration: 0.3 }}
                                                >{pizza.name}</motion.h3>
                                                <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                                                    {pizza.vegetarienne && (
                                                        <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full transition-all duration-300 hover:bg-green-600 shadow-md">
                                                            Végétarien
                                                        </span>
                                                    )}
                                                    <span className={`text-white text-xs font-bold px-3 py-1 rounded-full transition-all duration-300 shadow-md ${
                                                        pizza.base === "Tomate" 
                                                            ? "bg-red-500 hover:bg-red-600" 
                                                            : "bg-yellow-500 hover:bg-yellow-600"
                                                    }`}>
                                                        Base {pizza.base}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="p-5">
                                                <p className="text-white text-sm mb-4 leading-relaxed">{pizza.description}</p>
                                                <div className="mb-4">
                                                    <h4 className="text-white text-sm font-semibold mb-2">Ingrédients:</h4>
                                                    <p className="text-white/80 text-sm">{pizza.ingredients.join(", ")}</p>
                                                </div>
                                                <div className="flex justify-between items-center mt-4">
                                                    <span className="text-white font-bold text-2xl">{pizza.price.toFixed(2)} €</span>
                                                    <motion.button 
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => addToCart(pizza)}
                                                        className={`${addedToCartId === pizza.id ? 'bg-green-600' : 'bg-red-600 hover:bg-red-700'} text-white px-5 py-2 rounded-lg transition-all duration-300 shadow-lg flex items-center gap-2`}
                                                    >
                                                        <ShoppingCart size={18} />
                                                        {addedToCartId === pizza.id ? 'Ajouté !' : 'Ajouter'}
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                                
                                {filteredPizzas.length === 0 && (
                                    <div className="text-center py-10 animate-fade-in">
                                        <p className="text-white text-xl">Aucune pizza ne correspond à vos critères.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </motion.div>
                </div>
                
                {/* Bouton de retour en haut */}
                <AnimatePresence>
                    {showScrollTop && (
                        <motion.button
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 20 }}
                            onClick={scrollToTop}
                            className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-lg hover:bg-white/30 transition-all duration-300 border border-white/30"
                            aria-label="Retour en haut"
                        >
                            <ChevronUp size={24} />
                        </motion.button>
                    )}
                </AnimatePresence>
                
                {/* Panier fixe */}
                <div className={`fixed bottom-4 right-4 z-50 transition-all duration-500 ${isCartOpen ? 'w-96' : 'w-16'}`}>
                    {/* Bouton du panier */}
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleCart}
                        className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl hover:bg-red-700 transition-all duration-300"
                        aria-label="Panier"
                    >
                        <div className="relative">
                            <ShoppingCart size={24} className={`transition-transform duration-300 ${isCartOpen ? 'rotate-12' : ''}`} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-yellow-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce shadow-md">
                                    {totalItems}
                                </span>
                            )}
                        </div>
                    </motion.button>
                    
                    {/* Contenu du panier */}
                    <AnimatePresence>
                        {isCartOpen && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden mb-16 border border-white/20"
                            >
                                <div className="bg-gradient-to-r from-red-700 to-red-600 text-white p-4 flex justify-between items-center">
                                    <h3 className="font-bold text-lg">Votre Panier</h3>
                                    <motion.button 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={toggleCart} 
                                        className="text-white hover:text-gray-200 transition-colors"
                                    >
                                        <X size={20} />
                                    </motion.button>
                                </div>
                                
                                <div className="max-h-96 overflow-y-auto p-4">
                                    {cart.length === 0 ? (
                                        <p className="text-white text-center py-6 italic">Votre panier est vide</p>
                                    ) : (
                                        <ul className="divide-y divide-white/10">
                                            {cart.map((item) => (
                                                <motion.li 
                                                    key={item.id} 
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="py-3 flex justify-between items-center hover:bg-white/10 transition-colors rounded-md px-3"
                                                >
                                                    <div>
                                                        <h4 className="font-medium text-white">{item.name}</h4>
                                                        <p className="text-sm text-white/80">{(item.price * item.quantity).toFixed(2)} €</p>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <motion.button 
                                                            whileHover={{ scale: 1.2 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => updateQuantity(item.id, -1)}
                                                            disabled={item.quantity <= 1}
                                                            className="text-white/80 hover:text-red-400 disabled:opacity-50 transition-colors"
                                                            aria-label="Diminuer la quantité"
                                                        >
                                                            <Minus size={16} />
                                                        </motion.button>
                                                        <span className="w-6 text-center text-white">{item.quantity}</span>
                                                        <motion.button 
                                                            whileHover={{ scale: 1.2 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => updateQuantity(item.id, 1)}
                                                            className="text-white/80 hover:text-green-400 transition-colors"
                                                            aria-label="Augmenter la quantité"
                                                        >
                                                            <Plus size={16} />
                                                        </motion.button>
                                                        <motion.button 
                                                            whileHover={{ scale: 1.2 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="text-white/80 hover:text-red-400 ml-2 transition-colors"
                                                            aria-label="Supprimer du panier"
                                                        >
                                                            <Trash2 size={16} />
                                                        </motion.button>
                                                    </div>
                                                </motion.li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                
                                {cart.length > 0 && (
                                    <div className="border-t border-white/20 p-4">
                                        <div className="flex justify-between font-bold mb-4 text-white">
                                            <span>Total:</span>
                                            <span>{calculateTotal()} €</span>
                                        </div>
                                        <motion.button 
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={goToCheckout}
                                            className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3 rounded-lg hover:from-red-700 hover:to-red-600 transition-all duration-300 shadow-lg font-medium"
                                        >
                                            Commander
                                        </motion.button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    )
}   