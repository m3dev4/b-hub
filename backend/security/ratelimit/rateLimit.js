import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Trop de demandes, veuillez réessayer plus tard.",
    handler: (req, res) => {
        console.error(`Rate limit exceeded for IP: ${req.ip}`); // Log rate limit exceed
        res.status(429).json({ message: "Too many requests, please try again later." });
    }
});

export default limiter;
