import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthoried" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.session = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Session expired" });
  }
};

export default verifyToken;
