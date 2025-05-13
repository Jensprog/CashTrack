/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: process.env.NODE_ENV === 'production' ? '/cashtrack' : '',
    webpack: (config, { dev, isServer }) => {
        // During production, ignore test files
        if (!dev) {
            // Ignore all Jest-test files
            config.module.rules.push({
                test: /\.(test|spec)\.(js|jsx)$/,
                loader: 'ignore-loader',
            });
            
            // Ignore __tests__ and __mocks__ folders
            config.module.rules.push({
                test: /(\_\_tests\_\_|\_\_mocks\_\_)\/.*\.(js|jsx)$/,
                loader: 'ignore-loader',
            });
        }
        
        return config;
    }
};

export default nextConfig;