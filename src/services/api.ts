// API Configuration
const API_CONFIG = {
    // Database API endpoints
    DATABASE: {
        BASE_URL: 'http://localhost:8000',
        ENDPOINTS: {
            USERS: '/users',
            TOKENS: '/tokens',
            USER_BY_EMAIL: (email: string) => `/users?email=${email}`,
            USER_BY_ID: (id: string) => `/users/${id}`,
        }
    },
    // AI Model API endpoints
    AI_MODEL: {
        BASE_URL: 'http://127.0.0.1:5000',
        ENDPOINTS: {
            NUTRITION_RISK_PREDICTION: '/nutritionriskprediction',
            DIABETIC_RISK_PREDICTION: '/predictdata',
            PHYSICAL_RISK_PREDICTION: '/physicalriskprediction',
            MENTAL_RISK_PREDICTION: '/menatalrecommendations',
        }
    }
};

// Helper functions for API calls
export const getDatabaseUrl = (endpoint: string) => `${API_CONFIG.DATABASE.BASE_URL}${endpoint}`;
export const getAiModelUrl = (endpoint: string) => `${API_CONFIG.AI_MODEL.BASE_URL}${endpoint}`;

// Export the configuration
export default API_CONFIG; 