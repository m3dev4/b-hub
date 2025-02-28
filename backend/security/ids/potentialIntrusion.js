const potentialIntrusionMiddleware = (req, res, next) => {
  const urlLength = req.url.length;
  const suspiciousChars = /[;,='--]/; // Regex for suspicious characters

  if (urlLength > 200 || suspiciousChars.test(req.url)) {
    console.warn(`Potential intrusion detected: ${req.url} from IP: ${req.ip}`);
    return res.status(403).json({ message: 'Potential intrusion detected' }); // Return 403 status
  }

  next();
};

export default potentialIntrusionMiddleware;
