const CONSTANT = {
    // MONGO_URL: process.env.MONGO_URI || 'mongodb://localhost:27017/?directConnection=true',
    MONGO_URL : "mongodb://localhost:27017/?directConnection=true",
    PORT: process.env.PORT || 5001,
    ACCESS_SECRET : process.env.ACCESS_TOKEN_SECRET || 'your_super_secret_access_token_key_change_in_production',
    REFRESH_SECRET : process.env.REFRESH_TOKEN_SECRET || 'your_super_secret_refresh_token_key_change_in_production',
    REFRESH_TOKEN_EXPIRY : process.env.REFRESH_TOKEN_EXPIRY || "7d",
    ACCESS_TOKEN_EXPIRY : process.env.ACCESS_TOKEN_EXPIRY || "15m",
    REFRESH_TOKEN_EXPIRY_IN_SECONDS : 60 * 60,
    ACCESS_TOKEN_EXPIRY_IN_SECONDS : 60 * 60 * 24 * 7,
    REDIS_PORT : 6379,
    REDIS_HOST: process.env.REDIS_HOST || '127.0.0.1',
    REDIS_PASSWORD: process.env.REDIS_PASSWORD || '',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5174',
}

export default CONSTANT;