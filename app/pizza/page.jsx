"use client"
import Header from "../../components/ui/header";
import { useState } from "react";
import { ShoppingCart, X, Plus, Minus, Trash2, Filter } from "lucide-react";
import { pizzas } from "../data/pizzas";

export default function Page() {
    const [cart, setCart] = useState([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [filterVegetarian, setFilterVegetarian] = useState(false);
    const [sortBy, setSortBy] = useState("default"); // default, price-asc, price-desc
    
    const toggleCart = () => {
        setIsCartOpen(!isCartOpen);
    };
    
    const addToCart = (pizza) => {
        const existingItem = cart.find(item => item.id === pizza.id);
        
        if (existingItem) {
            setCart(cart.map(item => 
                item.id === pizza.id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
            ));
        } else {
            setCart([...cart, { ...pizza, quantity: 1 }]);
        }
        
        // Ouvrir automatiquement le panier lors de l'ajout
        if (!isCartOpen) {
            setIsCartOpen(true);
        }
    };
    
    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };
    
    const updateQuantity = (id, change) => {
        setCart(cart.map(item => {
            if (item.id === id) {
                const newQuantity = item.quantity + change;
                return newQuantity > 0 
                    ? { ...item, quantity: newQuantity }
                    : item;
            }
            return item;
        }));
    };
    
    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };
    
    // Filtrer et trier les pizzas
    const filteredPizzas = pizzas
        .filter(pizza => !filterVegetarian || pizza.vegetarienne)
        .sort((a, b) => {
            if (sortBy === "price-asc") return a.price - b.price;
            if (sortBy === "price-desc") return b.price - a.price;
            return 0; // default: ne pas trier
        });

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
                    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-xl">
                        <h2 className="text-3xl font-bold text-white mb-6 text-center">Nos Délicieuses Pizzas</h2>
                        
                        {/* Filtres et tri */}
                        <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                            <div className="flex items-center">
                                <button 
                                    onClick={() => setFilterVegetarian(!filterVegetarian)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                                        filterVegetarian 
                                            ? 'bg-green-600 text-white' 
                                            : 'bg-white/20 text-white hover:bg-white/30'
                                    }`}
                                >
                                    <Filter size={16} />
                                    {filterVegetarian ? 'Végétariennes uniquement' : 'Toutes les pizzas'}
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-2">
                                <span className="text-white">Trier par:</span>
                                <select 
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-white/20 text-white border border-white/30 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-white/50"
                                >
                                    <option value="default">Par défaut</option>
                                    <option value="price-asc">Prix croissant</option>
                                    <option value="price-desc">Prix décroissant</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredPizzas.map((pizza) => (
                                <div key={pizza.id} className="bg-white/20 backdrop-blur-md rounded-lg overflow-hidden border border-white/30 shadow-lg transform hover:scale-105 transition-transform duration-300">
                                    <div className="relative h-48 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                                        <img 
                                            src={pizza.image} 
                                            alt={pizza.name} 
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.src = "/pizza/default-pizza.jpg";
                                            }}
                                        />
                                        <h3 className="absolute bottom-2 left-3 text-white font-bold text-xl z-20">{pizza.name}</h3>
                                        {pizza.vegetarienne && (
                                            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
                                                Végétarien
                                            </span>
                                        )}
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
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                                            >
                                                <ShoppingCart size={16} />
                                                Ajouter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {filteredPizzas.length === 0 && (
                            <div className="text-center py-10">
                                <p className="text-white text-xl">Aucune pizza ne correspond à vos critères.</p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Panier fixe */}
                <div className={`fixed bottom-4 right-4 z-50 transition-all duration-300 ${isCartOpen ? 'w-80' : 'w-16'}`}>
                    {/* Bouton du panier */}
                    <button 
                        onClick={toggleCart}
                        className="absolute bottom-0 right-0 w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg hover:bg-red-700 transition-colors"
                    >
                        <div className="relative">
                            <ShoppingCart size={24} />
                            {cart.length > 0 && (
                                <span className="absolute -top-2 -right-2 bg-yellow-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {cart.reduce((total, item) => total + item.quantity, 0)}
                                </span>
                            )}
                        </div>
                    </button>
                    
                    {/* Contenu du panier */}
                    {isCartOpen && (
                        <div className="bg-white rounded-lg shadow-xl overflow-hidden mb-16 animate-slide-up">
                            <div className="bg-red-600 text-white p-3 flex justify-between items-center">
                                <h3 className="font-bold">Votre Panier</h3>
                                <button onClick={toggleCart} className="text-white hover:text-gray-200">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="max-h-80 overflow-y-auto p-3">
                                {cart.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">Votre panier est vide</p>
                                ) : (
                                    <ul className="divide-y divide-gray-200">
                                        {cart.map((item) => (
                                            <li key={item.id} className="py-3 flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-medium">{item.name}</h4>
                                                    <p className="text-sm text-gray-600">{(item.price * item.quantity).toFixed(2)} €</p>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        disabled={item.quantity <= 1}
                                                        className="text-gray-500 hover:text-red-600 disabled:opacity-50"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="w-6 text-center">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="text-gray-500 hover:text-green-600"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                    <button 
                                                        onClick={() => removeFromCart(item.id)}
                                                        className="text-gray-500 hover:text-red-600 ml-2"
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
                                    <button className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors">
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