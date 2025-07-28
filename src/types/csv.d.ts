declare module '*.csv' {
    const content: {
        food_id: string;
        food_item: string;
        calories: string;
        carbs: string;
        protein: string;
        fat: string;
        glycemic_index: string;
        meal_type: string;
        culture: string;
        estimated_weight_g: string;
        portion_description: string;
    }[];
    export default content;
} 