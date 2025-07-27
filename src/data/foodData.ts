import "../data/Food_Datasets.csv"

export interface FoodItem {
    food_id: string;
    food_item: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    glycemic_index: number;
    meal_type: string;
    culture: string;
    estimated_weight_g: number;
}

export const foodData: FoodItem[] = [
    {
        food_id: "1",
        food_item: "White Rice",
        calories: 130,
        carbs: 28,
        protein: 2.7,
        fat: 0.3,
        glycemic_index: 73,
        meal_type: "Main Course",
        culture: "Sri Lankan",
        estimated_weight_g: 100
    },
    {
        food_id: "2",
        food_item: "Red Rice",
        calories: 111,
        carbs: 23,
        protein: 2.3,
        fat: 0.8,
        glycemic_index: 55,
        meal_type: "Main Course",
        culture: "Sri Lankan",
        estimated_weight_g: 100
    },
    {
        food_id: "3",
        food_item: "String Hoppers",
        calories: 96,
        carbs: 21,
        protein: 2.2,
        fat: 0.2,
        glycemic_index: 65,
        meal_type: "Breakfast",
        culture: "Sri Lankan",
        estimated_weight_g: 100
    },
    {
        food_id: "4",
        food_item: "Chicken Curry",
        calories: 243,
        carbs: 3,
        protein: 25,
        fat: 15,
        glycemic_index: 0,
        meal_type: "Main Course",
        culture: "Sri Lankan",
        estimated_weight_g: 150
    },
    {
        food_id: "5",
        food_item: "Dhal Curry",
        calories: 133,
        carbs: 20,
        protein: 9,
        fat: 3.5,
        glycemic_index: 25,
        meal_type: "Side Dish",
        culture: "Sri Lankan",
        estimated_weight_g: 100
    },
    {
        food_id: "6",
        food_item: "Egg Curry",
        calories: 154,
        carbs: 2,
        protein: 13,
        fat: 11,
        glycemic_index: 0,
        meal_type: "Side Dish",
        culture: "Sri Lankan",
        estimated_weight_g: 100
    },
    {
        food_id: "7",
        food_item: "Fish Curry",
        calories: 187,
        carbs: 2,
        protein: 28,
        fat: 8,
        glycemic_index: 0,
        meal_type: "Main Course",
        culture: "Sri Lankan",
        estimated_weight_g: 150
    },
    {
        food_id: "8",
        food_item: "Parata",
        calories: 260,
        carbs: 36,
        protein: 6,
        fat: 10,
        glycemic_index: 70,
        meal_type: "Breakfast",
        culture: "Sri Lankan",
        estimated_weight_g: 100
    },
    {
        food_id: "9",
        food_item: "Pittu",
        calories: 160,
        carbs: 33,
        protein: 3.5,
        fat: 1,
        glycemic_index: 60,
        meal_type: "Breakfast",
        culture: "Sri Lankan",
        estimated_weight_g: 100
    },
    {
        food_id: "10",
        food_item: "Pol Sambol",
        calories: 142,
        carbs: 4,
        protein: 2,
        fat: 14,
        glycemic_index: 15,
        meal_type: "Side Dish",
        culture: "Sri Lankan",
        estimated_weight_g: 50
    },
    {
        food_id: "11",
        food_item: "Gotukola Sambol",
        calories: 68,
        carbs: 8,
        protein: 4,
        fat: 3,
        glycemic_index: 20,
        meal_type: "Side Dish",
        culture: "Sri Lankan",
        estimated_weight_g: 100
    },
    {
        food_id: "12",
        food_item: "Jackfruit Curry",
        calories: 157,
        carbs: 28,
        protein: 2.5,
        fat: 5,
        glycemic_index: 55,
        meal_type: "Side Dish",
        culture: "Sri Lankan",
        estimated_weight_g: 150
    },
    {
        food_id: "13",
        food_item: "Banana",
        calories: 105,
        carbs: 27,
        protein: 1.3,
        fat: 0.3,
        glycemic_index: 51,
        meal_type: "Snack",
        culture: "Sri Lankan",
        estimated_weight_g: 120
    },
    {
        food_id: "14",
        food_item: "Mango",
        calories: 60,
        carbs: 15,
        protein: 0.8,
        fat: 0.4,
        glycemic_index: 51,
        meal_type: "Snack",
        culture: "Sri Lankan",
        estimated_weight_g: 100
    },
    {
        food_id: "15",
        food_item: "Papaya",
        calories: 43,
        carbs: 11,
        protein: 0.5,
        fat: 0.3,
        glycemic_index: 60,
        meal_type: "Snack",
        culture: "Sri Lankan",
        estimated_weight_g: 100
    }
]; 