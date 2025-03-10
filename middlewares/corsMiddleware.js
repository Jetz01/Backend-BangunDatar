const corsMiddleware = (req, res, next) => {
  const allowedOrigins = {
    POST: ["https://scratch-bangun-datar.vercel.app", "http://localhost:3039"],
    GET: ["http://localhost:3039"],
    PUT: ["http://localhost:3039"],
    DELETE: ["http://localhost:3039"],
  };

  const origin = req.get("Origin");
  const method = req.method;

  // Handle preflight (OPTIONS) requests
  if (method === "OPTIONS") {
    const requestMethod = req.headers["access-control-request-method"];
    const allowedOrigin = allowedOrigins[requestMethod];

    if (allowedOrigin && allowedOrigin.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
      );
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      return res.status(200).end();
    }
    return res.status(403).json({ error: "CORS Policy: Access Denied" });
  }

  // Handle actual requests
  const allowedOrigin = allowedOrigins[method];
  if (allowedOrigin && allowedOrigin.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    return next();
  }

  return res.status(403).json({ error: "CORS Policy: Access Denied" });
};

module.exports = corsMiddleware;
