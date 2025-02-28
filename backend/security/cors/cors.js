import cors from 'cors';

const corsOptions = {
    origin: ['http://localhost:3000', 'YOUR_FRONTEND_DOMAIN'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Enable Access-Control-Allow-Credentials
};

const corsMiddleware = (req, res, next) => {
    const origin = req.headers.origin;
    if (!corsOptions.origin.includes(origin)) {
        console.error(`Disallowed origin: ${origin}`); // Log disallowed origin
        return res.status(500).json({ message: 'Internal Server Error' });
    }
    cors(corsOptions)(req, res, next);
};

export default corsMiddleware;
