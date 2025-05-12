/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: process.env.NODE_ENV === 'production' ? '/cashtrack' : '',

    webpack: (config, { dev, isServer }) => {
        // During production, ignore test files
        if (!dev) {
            // Ignore route.js files in api/tests catalog
            config.module.rules.push({
                test: /api\/tests\/.*\.js$/,
                loader: 'ignore-loader',
            });
            
            // Ignore all files in /tests catalog
            config.module.rules.push({
                test: /\/tests\/.*\.js$/,
                loader: 'ignore-loader',
            });
        }
        
        return config;
    }
};

export default nextConfig;