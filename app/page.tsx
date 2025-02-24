"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, FileDown, RefreshCw } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

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

  useEffect(() => {
    const savedRecipes = localStorage.getItem("recipes");
    if (savedRecipes) {
      setRecipes(JSON.parse(savedRecipes));
    }
  }, []);

  const saveRecipe = () => {
    if (!newRecipe.name || !newRecipe.ingredients || !newRecipe.instructions) return;
    
    const recipe: Recipe = {
      id: Date.now().toString(),
      name: newRecipe.name,
      ingredients: newRecipe.ingredients,
      instructions: newRecipe.instructions,
    };
    
    const updatedRecipes = [...recipes, recipe];
    setRecipes(updatedRecipes);
    localStorage.setItem("recipes", JSON.stringify(updatedRecipes));
    setNewRecipe({ name: "", ingredients: [], instructions: "" });
  };

  const selectRecipe = (day: string, recipe: Recipe) => {
    setWeekPlan(
      weekPlan.map((plan) =>
        plan.day === day ? { ...plan, selectedRecipe: recipe } : plan
      )
    );
  };

  const generatePDF = (recipe: Recipe) => {
    // TODO: Implement PDF generation for single recipe
    console.log("Generating PDF for recipe:", recipe.name);
  };

  const generateWeeklyPDF = () => {
    // TODO: Implement PDF generation for weekly plan
    console.log("Generating weekly shopping list PDF");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="bg-primary p-6 shadow-lg">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Ajouter une recette
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Nouvelle Recette</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nom de la recette</Label>
                  <Input
                    id="name"
                    value={newRecipe.name}
                    onChange={(e) => setNewRecipe({ ...newRecipe, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="ingredients">Ingrédients (un par ligne)</Label>
                  <Textarea
                    id="ingredients"
                    value={newRecipe.ingredients?.join("\n")}
                    onChange={(e) => setNewRecipe({ ...newRecipe, ingredients: e.target.value.split("\n") })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="instructions">Instructions</Label>
                  <Textarea
                    id="instructions"
                    value={newRecipe.instructions}
                    onChange={(e) => setNewRecipe({ ...newRecipe, instructions: e.target.value })}
                  />
                </div>
                <Button onClick={saveRecipe}>Sauvegarder</Button>
              </div>
            </DialogContent>
          </Dialog>
          <h1 className="text-3xl font-bold text-white font-serif">Plan Repas</h1>
          <div className="w-[180px]"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {weekPlan.map((plan) => (
            <Card key={plan.day} className="p-4">
              <h2 className="text-lg font-semibold mb-4">{plan.day}</h2>
              
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
                <div className="space-y-4">
                  <h3 className="font-medium">{plan.selectedRecipe.name}</h3>
                  <div className="text-sm">
                    <h4 className="font-medium">Ingrédients:</h4>
                    <ul className="list-disc pl-4">
                      {plan.selectedRecipe.ingredients.map((ingredient, i) => (
                        <li key={i}>{ingredient}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="text-sm">
                    <h4 className="font-medium">Instructions:</h4>
                    <p className="whitespace-pre-wrap">{plan.selectedRecipe.instructions}</p>
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => generatePDF(plan.selectedRecipe!)}
                    >
                      <FileDown className="mr-2 h-4 w-4" />
                      Générer PDF
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => selectRecipe(plan.day, null!)}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Changer de recette
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <Button
            size="lg"
            onClick={generateWeeklyPDF}
            className="bg-primary hover:bg-primary/90"
          >
            <FileDown className="mr-2 h-5 w-5" />
            Générer la liste de courses de la semaine
          </Button>
        </div>
      </main>
    </div>
  );
}