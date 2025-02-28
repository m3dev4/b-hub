import helmet from 'helmet';

const helmetMiddleware = () => {
    return helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                imgSrc: ["'self'", "YOUR_CDN_DOMAIN"],
                scriptSrc: ["'self'", "YOUR_SCRIPT_DOMAIN"],
                // Add other directives as needed for best security practices
            },
        },
    });
};

export default helmetMiddleware;
