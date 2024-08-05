import express, { json } from "express";
import corsMiddleware from "./middlewares/cors.js";
import verifyToken from "./middlewares/auth.js";
import createUserRouter from "./routes/user.js";
import createFavoritesRouter from "./routes/favorites.js";
import createRickAndMortyRouter from "./routes/rick-and-morty.js";
import createPokemonRouter from "./routes/pokemon.js";
import "dotenv/config";
import NodeCache from "node-cache";

const cache = new NodeCache();

const PORT = process.env.PORT || 3000;

const createApp = () => {
  const app = express();
  app.use(json());
  app.use(corsMiddleware());
  app.disable("x-powered-by");

  app.get("/", (req, res) => {
    res.json({ message: "API is working" });
  });
  app.post("/login", createUserRouter(cache));
  app.post("/logout", createUserRouter(cache));
  app.post("/register", createUserRouter(cache));
  app.use("/users", verifyToken, createUserRouter(cache));
  app.use("/favorites", verifyToken, createFavoritesRouter(cache));

  app.use("/rick-and-morty", verifyToken, createRickAndMortyRouter(cache));
  app.use("/pokemon", verifyToken, createPokemonRouter(cache));

  app.get("/uploads/:file", (req, res) => {
    const { file } = req.params;
    res.sendFile(file, { root: "uploads" });
  });

  app.listen(PORT, () => {
    console.log(
      `Server is running on port ${PORT}\n\n\thttp://localhost:${PORT}\n\n`
    );
  });
};

export default createApp;
