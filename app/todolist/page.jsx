"use client"
import { useState } from "react";
function Header() {
    return (
        <header className="bg-gradient-to-r from-blue-900 to-indigo-900 py-8 relative overflow-hidden">
            {/* Effets lumineux d'arrière-plan */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-violet-500/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
            </div>
            <div className="container mx-auto px-4 relative">
                <h1 className="text-4xl font-bold text-white text-center tracking-wide animate-glow">
                    To Do List
                </h1>
            </div>
        </header>
    )
}
function List(props) {
    const [editingTask, setEditingTask] = useState(null);
    const [editText, setEditText] = useState("");

    return (
        <div className="container mx-auto px-4 py-8 relative">
            {/* Effet de gradient animé */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-violet-500/5 animate-gradient"></div>
            <ul className="space-y-4 relative">
                {props.taches.map((tache) => (
                    <li key={tache.nom} 
                        className="bg-white/90 backdrop-blur rounded-lg p-4 
                        flex items-center justify-between 
                        transition-all duration-300 
                        hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] 
                        hover:-translate-y-0.5 
                        hover:bg-gradient-to-r hover:from-white hover:to-blue-50">
                        <div className="flex items-center space-x-4 flex-1">
                            <input 
                                type="checkbox" 
                                checked={tache.coche} 
                                onChange={() => props.onToggle(tache.nom)}
                                className="w-5 h-5 rounded border-blue-500 text-blue-600 
                                focus:ring-blue-500 transition-shadow
                                hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                            />
                            {editingTask === tache.nom ? (
                                <input 
                                    type="text"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            props.onEdit(tache.nom, editText);
                                            setEditingTask(null);
                                        }
                                        if (e.key === "Escape") {
                                            setEditingTask(null);
                                        }
                                    }}
                                    className="flex-1 p-2 border border-blue-300 rounded 
                                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                                    shadow-[0_0_10px_rgba(59,130,246,0.1)]
                                    transition-all duration-300"
                                    autoFocus
                                />
                            ) : (
                                <span className={`flex-1 text-lg transition-all duration-300 
                                    ${tache.coche ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                    {tache.nom}
                                </span>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            {!editingTask && (
                                <button 
                                    onClick={() => {
                                        setEditingTask(tache.nom);
                                        setEditText(tache.nom);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded 
                                    transition-all duration-300
                                    hover:bg-blue-700 
                                    hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]
                                    active:transform active:scale-95"
                                >
                                    Modifier
                                </button>
                            )}
                            <button 
                                onClick={() => props.onDelete(tache.nom)}
                                className="px-4 py-2 bg-red-600 text-white rounded 
                                transition-all duration-300
                                hover:bg-red-700 
                                hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]
                                active:transform active:scale-95"
                            >
                                Supprimer
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}
function Addtolist(props) {
    function handleform(e) {
        e.preventDefault();
        props.setTaches(e.target.text.value);
        e.target.reset();
    }

    return (
        <div className="bg-gray-50/80 py-8 relative overflow-hidden">
            {/* Effet de lumière radiale */}
            <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                    w-[600px] h-[200px] bg-gradient-to-r from-blue-500/10 to-violet-500/10 
                    rounded-full blur-[80px] animate-pulse"></div>
            </div>
            <form onSubmit={handleform} className="container mx-auto px-4 max-w-2xl relative">
                <div className="bg-white/90 backdrop-blur rounded-lg p-6
                    transition-all duration-300 
                    hover:shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                    <h2 className="text-2xl font-semibold mb-4 
                        bg-clip-text text-transparent bg-gradient-to-r 
                        from-blue-600 to-violet-600 animate-gradient">
                        Nouvelle tâche
                    </h2>
                    <div className="flex space-x-4">
                        <input
                            type="text"
                            id="new-todo-input"
                            name="text"
                            autoComplete="off"
                            className="flex-1 p-3 border border-blue-300 rounded-lg 
                            transition-all duration-300
                            focus:ring-2 focus:ring-blue-500 focus:border-transparent
                            hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]
                            placeholder-blue-300"
                            placeholder="Entrez une nouvelle tâche..."
                        />
                        <button 
                            type="submit" 
                            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-violet-600 
                            text-white font-semibold rounded-lg 
                            transition-all duration-300
                            hover:from-blue-700 hover:to-violet-700 
                            hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]
                            active:transform active:scale-95"
                        >
                            Ajouter
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default function Todolist() {
    const [taches, setTaches] = useState([
        {
            nom: "Repasser",
            coche: true
        },
    ]);

    function handleAddtaches(tache) {
        setTaches([...taches, {nom: tache, coche: false}]);
    }
    function handleEdit(ancienNom, nouveauNom) {
        setTaches(taches.map(tache => 
            tache.nom === ancienNom
                ? {...tache, nom: nouveauNom}
                : tache
        ));
    }
    function handleDelete(nomTache) {
        setTaches(taches.filter(tache => tache.nom !== nomTache));
    }

    function handleToggle(nomTache) {
        setTaches(taches.map(tache => 
            tache.nom === nomTache 
                ? {...tache, coche: !tache.coche}
                : tache
        ));
    }

    return (
        <div className="min-h-screen bg-gray-100 relative overflow-hidden">
            {/* Effet de particules fluides */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute w-[500px] h-[500px] top-0 -left-48 
                    bg-gradient-to-r from-blue-500/10 to-violet-500/10 
                    rounded-full blur-[100px] mix-blend-multiply 
                    animate-float-slow">
                </div>
                <div className="absolute w-[400px] h-[400px] top-1/4 right-0 
                    bg-gradient-to-l from-indigo-500/10 to-purple-500/10 
                    rounded-full blur-[100px] mix-blend-multiply 
                    animate-float-medium">
                </div>
                <div className="absolute w-[600px] h-[600px] bottom-0 left-1/3 
                    bg-gradient-to-t from-blue-500/10 to-violet-500/10 
                    rounded-full blur-[100px] mix-blend-multiply 
                    animate-float-fast">
                </div>
            </div>

            <Header />
            <main className="py-8 relative z-10">
                <List taches={taches} onToggle={handleToggle} onEdit={handleEdit} onDelete={handleDelete} />
                <Addtolist setTaches={handleAddtaches} />
            </main>
        </div>
    );
}