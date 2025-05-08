
interface TokenPayload {
    userId: number;
    email: string;
}

const generateSecureToken = (): string => {
    const array = new Uint32Array(28);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
};

export const generateToken = (userData: TokenPayload): string => {
    try {
        // Create a token that includes user data in a simple format
        const tokenData = {
            userId: userData.userId,
            email: userData.email,
            token: generateSecureToken(),
            timestamp: Date.now()
        };
        return btoa(JSON.stringify(tokenData)); // Base64 encode the token data
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Failed to generate token');
    }
};

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        const decodedData = JSON.parse(atob(token));
        // Check if token is expired (24 hours)
        if (Date.now() - decodedData.timestamp > 24 * 60 * 60 * 1000) {
            return null;
        }
        return {
            userId: decodedData.userId,
            email: decodedData.email
        };
    } catch (error) {
        console.error('Error verifying token:', error);
        return null;
    }
}; 