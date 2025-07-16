"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, FileDown, RefreshCw, Pencil, Trash } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { initialRecipes } from "./data/recipes";
import jsPDF from 'jspdf';

interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string;
}

interface DayPlan {
  day: string;
  selectedRecipe: Recipe | null;
}

interface ShoppingListItemType {
  ingredient: string;
  checked: boolean;
  occurrences: {
    day: string;
    recipe: string;
  }[];
}

interface NewIngredient {
  ingredient: string;
  day: string;
  recipe: string;
}

interface RecipeFormProps {
  recipe: Recipe | null;
  onSave: (recipe: Recipe) => void;
  editMode?: boolean;
}

interface DayCardProps {
  day: string;
  selectedRecipe: Recipe | null;
  recipes: Recipe[];
  onSelectRecipe: (day: string, recipe: Recipe | null) => void;
  onEditRecipe: (recipe: Recipe) => void;
}

interface ShoppingListItemProps {
  item: ShoppingListItemType;
  index: number;
  onToggle: (index: number) => void;
  onIncrement: (index: number) => void;
  onDecrement: (index: number) => void;
  onDelete: (index: number) => void;
}

const DAYS = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
  "Dimanche",
];

const RecipeForm: React.FC<RecipeFormProps> = ({ recipe, onSave, editMode = false }) => {
  const [formData, setFormData] = useState({
    name: recipe?.name || "",
    ingredients: recipe?.ingredients?.join("\n") || "",
    instructions: recipe?.instructions || ""
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.ingredients || !formData.instructions) return;
    
    onSave({
      id: recipe?.id || Date.now().toString(),
      name: formData.name,
      ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
      instructions: formData.instructions
    });
  };

  return (
    <div className="grid gap-5 py-4">
      <div className="grid gap-2">
        <Label htmlFor="name" className="text-indigo-800 font-semibold">
          Nom de la recette
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="ingredients" className="text-indigo-800 font-semibold">
          Ingrédients (un par ligne)
        </Label>
        <Textarea
          id="ingredients"
          value={formData.ingredients}
          onChange={(e) => handleChange("ingredients", e.target.value)}
          className="min-h-[150px] border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="instructions" className="text-indigo-800 font-semibold">
          Instructions
        </Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => handleChange("instructions", e.target.value)}
          className="min-h-[150px] border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <Button 
        onClick={handleSubmit}
        variant="primary"
        rounded="lg"
      >
        {editMode ? "Mettre à jour" : "Sauvegarder"}
      </Button>
    </div>
  );
};

const DayCard: React.FC<DayCardProps> = ({ day, selectedRecipe, recipes, onSelectRecipe, onEditRecipe }) => {
  return (
    <Card className="p-4 bg-white/80 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl rounded-xl border-0">
      <h2 className="text-xl font-bold mb-4 gradient-heading pb-2 border-b border-indigo-100/50">
        {day}
      </h2>
      
      {!selectedRecipe ? (
        <Select onValueChange={(value) => {
          const recipe = recipes.find((r) => r.id === value);
          if (recipe) onSelectRecipe(day, recipe);
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Choisir une recette" />
          </SelectTrigger>
          <SelectContent>
            {recipes.map((recipe) => (
              <SelectItem key={recipe.id} value={recipe.id}>
                {recipe.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <div className="h-[500px] flex flex-col">
          <div className="flex-grow space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-lg text-indigo-800">{selectedRecipe.name}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditRecipe(selectedRecipe)}
                className="icon-button"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm">
              <h4 className="font-semibold text-indigo-700 uppercase text-xs tracking-wider mb-2">Ingrédients:</h4>
              <ul className="list-disc pl-4">
                {selectedRecipe.ingredients.map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))}
              </ul>
            </div>
            <div className="text-sm">
              <h4 className="font-semibold text-indigo-700 uppercase text-xs tracking-wider mb-2">Préparation:</h4>
              <p className="whitespace-pre-wrap">{selectedRecipe.instructions}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onSelectRecipe(day, null)}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Changer de recette
          </Button>
        </div>
      )}
    </Card>
  );
};

const ShoppingListItemComponent: React.FC<ShoppingListItemProps> = ({ item, index, onToggle, onIncrement, onDecrement, onDelete }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Checkbox
          checked={item.checked}
          onCheckedChange={() => onToggle(index)}
        />
        <span className={`flex-grow ${item.checked ? "line-through text-gray-400" : ""}`}>
          {item.ingredient}
        </span>
      </div>
      <div className="flex items-center gap-2 ml-8 sm:ml-0">
        <Button
          variant="ghost"
          size="sm"
          rounded="full"
          onClick={() => onDecrement(index)}
          disabled={item.occurrences.length <= 1}
          className="h-8 w-8 p-0"
        >
          <span className="text-lg">-</span>
        </Button>
        <span className="text-sm text-indigo-600 font-medium min-w-[2rem] text-center">
          {item.occurrences.length > 1 ? `×${item.occurrences.length}` : ""}
        </span>
        <Button
          variant="ghost"
          size="sm"
          rounded="full"
          onClick={() => onIncrement(index)}
          className="h-8 w-8 p-0"
        >
          <span className="text-lg">+</span>
        </Button>
      </div>
      <span className="text-sm text-gray-500 whitespace-normal sm:whitespace-nowrap ml-8 sm:ml-0">
        ({item.occurrences.map(o => `${o.day} - ${o.recipe}`).join(", ")})
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDelete(index)}
        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 ml-auto icon-button"
      >
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>(
    DAYS.map((day) => ({ day, selectedRecipe: null }))
  );
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shoppingList, setShoppingList] = useState<ShoppingListItemType[]>([]);
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [newIngredient, setNewIngredient] = useState<NewIngredient>({
    ingredient: '',
    day: DAYS[0],
    recipe: 'Ajout manuel'
  });

  useEffect(() => {
    const savedRecipes = localStorage.getItem("recipes");
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    } else {
      // Initialize with the default recipes if no saved recipes exist
      setRecipes(initialRecipes);
      localStorage.setItem("recipes", JSON.stringify(initialRecipes));
    }
  }, []);

  const openEditDialog = (recipe: Recipe) => {
    setEditingRecipe(recipe);
    setIsDialogOpen(true);
  };

  const handleSaveRecipe = (recipe: Recipe) => {
    let updatedRecipes: Recipe[];
    
    if (editingRecipe) {
      updatedRecipes = recipes.map(r => r.id === recipe.id ? recipe : r);
      
      // Mise à jour du weekPlan
      setWeekPlan(weekPlan.map(plan => 
        plan.selectedRecipe?.id === recipe.id
          ? { ...plan, selectedRecipe: recipe }
          : plan
      ));
    } else {
      updatedRecipes = [...recipes, recipe];
    }
    
    setRecipes(updatedRecipes);
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
    setEditingRecipe(null);
    setIsDialogOpen(false);
  };

  const deleteRecipe = (recipeId: string) => {
    const updatedRecipes = recipes.filter(recipe => recipe.id !== recipeId);
    setRecipes(updatedRecipes);
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
    
    setWeekPlan(weekPlan.map(plan => 
      plan.selectedRecipe?.id === recipeId 
        ? { ...plan, selectedRecipe: null }
        : plan
    ));
  };

  const selectRecipe = (day: string, recipe: Recipe | null) => {
    setWeekPlan(
      weekPlan.map((plan) =>
        plan.day === day ? { ...plan, selectedRecipe: recipe } : plan
      )
    );
  };

  const generateShoppingList = () => {
    const itemsMap = new Map<string, ShoppingListItemType>();
    
    weekPlan.forEach(plan => {
      if (plan.selectedRecipe) {
        plan.selectedRecipe.ingredients.forEach(ingredient => {
          const normalizedIngredient = ingredient.toLowerCase().trim();
          
          if (itemsMap.has(normalizedIngredient)) {
            itemsMap.get(normalizedIngredient)!.occurrences.push({
              day: plan.day,
              recipe: plan.selectedRecipe!.name
            });
          } else {
            itemsMap.set(normalizedIngredient, {
              ingredient: ingredient,
              checked: false,
              occurrences: [{
                day: plan.day,
                recipe: plan.selectedRecipe!.name
              }]
            });
          }
        });
      }
    });

    setShoppingList(Array.from(itemsMap.values()));
    setShowShoppingList(true);
  };

  const toggleIngredientCheck = (index: number) => {
    setShoppingList(list => 
      list.map((item, i) => 
        i === index ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const downloadShoppingList = () => {
    const pdf = new jsPDF();
    
    pdf.setFont("helvetica");
    pdf.setFontSize(20);
    pdf.text("Liste de courses", 20, 20);
    
    pdf.setFontSize(12);
    let y = 40;
    
    shoppingList.forEach((item) => {
      if (y > 270) {
        pdf.addPage();
        y = 20;
      }
      
      const quantity = item.occurrences.length > 1 ? ` ×${item.occurrences.length}` : '';
      const details = `(${item.occurrences.map(o => `${o.day} - ${o.recipe}`).join(", ")})`;
      
      pdf.rect(20, y - 4, 4, 4);
      if (item.checked) {
        pdf.line(20, y - 4, 24, y);
        pdf.line(20, y, 24, y - 4);
      }
      
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(item.checked ? 128 : 0);
      pdf.text(`${item.ingredient}${quantity}`, 26, y);
      
      pdf.setFont("helvetica", "italic");
      pdf.setFontSize(10);
      pdf.text(details, 40, y + 5);
      pdf.setFontSize(12);
      pdf.setTextColor(0);
      
      y += 15;
    });
    
    pdf.save("liste-de-courses.pdf");
  };

  const addCustomIngredient = () => {
    if (!newIngredient.ingredient.trim()) return;
    
    setShoppingList(list => [...list, {
      ingredient: newIngredient.ingredient,
      checked: false,
      occurrences: [{
        day: newIngredient.day,
        recipe: newIngredient.recipe
      }]
    }]);
    
    setNewIngredient({
      ingredient: '',
      day: DAYS[0],
      recipe: 'Ajout manuel'
    });
    setShowAddIngredient(false);
  };

  const incrementIngredient = (index: number) => {
    setShoppingList(list => list.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          occurrences: [...item.occurrences, item.occurrences[0]]
        };
      }
      return item;
    }));
  };

  const decrementIngredient = (index: number) => {
    setShoppingList(list => list.map((item, i) => {
      if (i === index && item.occurrences.length > 1) {
        return {
          ...item,
          occurrences: item.occurrences.slice(0, -1)
        };
      }
      return item;
    }));
  };

  const deleteIngredient = (index: number) => {
    setShoppingList(list => list.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-violet-50">
      <header className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 sm:p-6 shadow-xl backdrop-blur-lg bg-opacity-90 sticky top-0 z-50">
        <div className="w-full max-w-[95%] mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="secondary"
                rounded="lg"
                className="bg-white/90 hover:bg-white text-indigo-600"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter une recette
              </Button>
            </DialogTrigger>
            <DialogContent
              className="sm:max-w-[425px] bg-gradient-to-b from-white to-indigo-50/30 border-2 border-indigo-200"
              disableOutsideClose
              hideCloseButton
            >
              <DialogHeader>
                <DialogTitle className="text-2xl gradient-heading">
                  {editingRecipe ? "Modifier la recette" : "Nouvelle Recette"}
                </DialogTitle>
              </DialogHeader>
              <RecipeForm 
                recipe={editingRecipe} 
                onSave={handleSaveRecipe} 
                editMode={!!editingRecipe}
              />
            </DialogContent>
          </Dialog>
          <h1 className="text-3xl sm:text-4xl font-bold text-white font-serif tracking-wide order-first sm:order-none drop-shadow-md">
            Plan Repas
          </h1>
          <div className="w-full sm:w-[180px]"></div>
        </div>
      </header>

      <main className="w-full max-w-[95%] mx-auto p-2 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-4">
          {weekPlan.map((plan) => (
            <DayCard 
              key={plan.day}
              day={plan.day}
              selectedRecipe={plan.selectedRecipe}
              recipes={recipes}
              onSelectRecipe={selectRecipe}
              onEditRecipe={openEditDialog}
            />
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <Button
            size="lg"
            variant="gradient"
            rounded="lg"
            onClick={generateShoppingList}
          >
            <FileDown className="mr-2 h-5 w-5" />
            Générer la liste de courses
          </Button>
        </div>

        {showShoppingList && (
          <Card className="mt-8 p-6 bg-white/80 backdrop-blur-sm rounded-xl border-0 shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-2xl sm:text-3xl gradient-heading">
                Liste de courses
              </h2>
              <Button
                variant="gradient"
                rounded="lg"
                onClick={downloadShoppingList}
                className="w-full sm:w-auto"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Télécharger en PDF
              </Button>
            </div>
            
            <div className="space-y-3">
              {shoppingList.map((item, index) => (
                <ShoppingListItemComponent 
                  key={index}
                  item={item}
                  index={index}
                  onToggle={toggleIngredientCheck}
                  onIncrement={incrementIngredient}
                  onDecrement={decrementIngredient}
                  onDelete={deleteIngredient}
                />
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-indigo-100/50">
              {showAddIngredient ? (
                <div className="space-y-4 bg-slate-50/50 p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      placeholder="Nouvel ingrédient"
                      value={newIngredient.ingredient}
                      onChange={(e) => setNewIngredient({...newIngredient, ingredient: e.target.value})}
                      className="flex-grow"
                    />
                    <Select value={newIngredient.day} onValueChange={(value) => setNewIngredient({...newIngredient, day: value})}>
                      <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS.map(day => (
                          <SelectItem key={day} value={day}>{day}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={addCustomIngredient} variant="primary" className="flex-1 sm:flex-none">
                      Ajouter
                    </Button>
                    <Button variant="outline" onClick={() => setShowAddIngredient(false)} className="flex-1 sm:flex-none">
                      Annuler
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  variant="gradient"
                  rounded="lg"
                  onClick={() => setShowAddIngredient(true)}
                  className="w-full"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Ajouter un ingrédient
                </Button>
              )}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}