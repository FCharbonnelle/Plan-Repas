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

interface ShoppingListItem {
  ingredient: string;
  checked: boolean;
  occurrences: {
    day: string;
    recipe: string;
  }[];
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

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [weekPlan, setWeekPlan] = useState<DayPlan[]>(
    DAYS.map((day) => ({ day, selectedRecipe: null }))
  );
  const [newRecipe, setNewRecipe] = useState<Partial<Recipe>>({
    name: "",
    ingredients: [],
    instructions: "",
  });
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shoppingList, setShoppingList] = useState<ShoppingListItem[]>([]);
  const [showShoppingList, setShowShoppingList] = useState(false);

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
    setNewRecipe({
      name: recipe.name,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    });
    setIsDialogOpen(true);
  };

  const saveRecipe = () => {
    if (!newRecipe.name || !newRecipe.ingredients || !newRecipe.instructions) return;
    
    let updatedRecipes: Recipe[];
    
    if (editingRecipe) {
      // Mise à jour de la recette existante
      const updatedRecipe = {
        ...editingRecipe,
        name: newRecipe.name,
        ingredients: newRecipe.ingredients,
        instructions: newRecipe.instructions
      };
      
      updatedRecipes = recipes.map(recipe => 
        recipe.id === editingRecipe.id ? updatedRecipe : recipe
      );
      
      // Mise à jour du weekPlan pour refléter les modifications
      setWeekPlan(weekPlan.map(plan => 
        plan.selectedRecipe?.id === editingRecipe.id
          ? { ...plan, selectedRecipe: updatedRecipe }
          : plan
      ));
    } else {
      // Création d'une nouvelle recette
      const recipe: Recipe = {
        id: Date.now().toString(),
        name: newRecipe.name,
        ingredients: newRecipe.ingredients,
        instructions: newRecipe.instructions,
      };
      updatedRecipes = [...recipes, recipe];
    }
    
    setRecipes(updatedRecipes);
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
    setNewRecipe({ name: "", ingredients: [], instructions: "" });
    setEditingRecipe(null);
    setIsDialogOpen(false);
  };

  const deleteRecipe = (recipeId: string) => {
    const updatedRecipes = recipes.filter(recipe => recipe.id !== recipeId);
    setRecipes(updatedRecipes);
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
    
    // Remove recipe from week plan if it's selected
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
    const itemsMap = new Map<string, ShoppingListItem>();
    
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
    
    // Configuration du PDF
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
      
      // Dessiner la case cochée ou non
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-violet-50">
      <header className="bg-gradient-to-r from-indigo-600 to-violet-600 p-6 shadow-lg">
        <div className="w-full max-w-[98%] mx-auto flex justify-between items-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="secondary" 
                className="bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all"
                onClick={() => {
                  setEditingRecipe(null);
                  setNewRecipe({ name: "", ingredients: [], instructions: "" });
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter une recette
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-white to-indigo-50/30 border-2 border-indigo-200">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-indigo-900">
                  Nouvelle Recette
                </DialogTitle>
              </DialogHeader>
              <div className="grid gap-5 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-indigo-800 font-semibold">
                    Nom de la recette
                  </Label>
                  <Input
                    id="name"
                    value={newRecipe.name}
                    onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                    className="border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ingredients" className="text-indigo-800 font-semibold">
                    Ingrédients (un par ligne)
                  </Label>
                  <Textarea
                    id="ingredients"
                    value={newRecipe.ingredients?.join("\n")}
                    onChange={(e) => {
                      setNewRecipe({ ...newRecipe, ingredients: e.target.value.split('\n') });
                    }}
                    className="min-h-[150px] border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="instructions" className="text-indigo-800 font-semibold">
                    Instructions
                  </Label>
                  <Textarea
                    id="instructions"
                    value={newRecipe.instructions}
                    onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
                    className="min-h-[150px] border-indigo-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <Button 
                  onClick={saveRecipe}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
                >
                  Sauvegarder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <h1 className="text-4xl font-bold text-white font-serif tracking-wide">Plan Repas</h1>
          <div className="w-[180px]"></div>
        </div>
      </header>

      <main className="w-full max-w-[98%] mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-3">
          {weekPlan.map((plan, index) => (
            <Card key={plan.day} className={`p-3 shadow-lg hover:shadow-xl transition-all bg-white border-2 border-indigo-200`}>
              <h2 className="text-xl font-bold mb-4 text-indigo-900 border-b-2 border-indigo-200 pb-2">{plan.day}</h2>
              
              {!plan.selectedRecipe ? (
                <Select onValueChange={(value) => {
                  const recipe = recipes.find((r) => r.id === value);
                  if (recipe) selectRecipe(plan.day, recipe);
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
                      <h3 className="font-semibold text-lg text-indigo-800">{plan.selectedRecipe.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(plan.selectedRecipe!)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-sm">
                      <h4 className="font-semibold text-indigo-700 uppercase text-xs tracking-wider mb-2">Ingrédients:</h4>
                      <ul className="list-disc pl-4">
                        {plan.selectedRecipe.ingredients.map((ingredient, i) => (
                          <li key={i}>{ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-sm">
                      <h4 className="font-semibold text-indigo-700 uppercase text-xs tracking-wider mb-2">Préparation:</h4>
                      <p className="whitespace-pre-wrap">{plan.selectedRecipe.instructions}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-white hover:bg-indigo-50"
                    onClick={() => selectRecipe(plan.day, null)}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Changer de recette
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <Button
            size="lg"
            onClick={generateShoppingList}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
          >
            <FileDown className="mr-2 h-5 w-5" />
            Générer la liste de courses
          </Button>
        </div>

        {showShoppingList && (
          <Card className="mt-8 p-6 border-indigo-100 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-indigo-900">Liste de courses</h2>
              <Button
                onClick={downloadShoppingList}
                className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md transition-all"
              >
                <FileDown className="mr-2 h-4 w-4" />
                Télécharger en PDF
              </Button>
            </div>
            <div className="space-y-4">
              {shoppingList.map((item, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={() => toggleIngredientCheck(index)}
                  />
                  <span className={`flex-grow ${item.checked ? "line-through text-gray-400" : ""}`}>
                    {item.ingredient}
                  </span>
                  <span className="text-sm text-indigo-600 font-medium">
                    {item.occurrences.length > 1 ? `×${item.occurrences.length}` : ""}
                  </span>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    ({item.occurrences.map(o => `${o.day} - ${o.recipe}`).join(", ")})
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}