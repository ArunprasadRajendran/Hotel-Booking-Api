module.exports = {
    apps: [
        {
            name: 'hotel-booking-api',
            script: 'dist/server/index.js',
            watch: true,
            env_development: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
};
