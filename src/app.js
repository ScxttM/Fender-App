import express, { json } from "express";
import corsMiddleware from "./middlewares/cors.js";
import verifyToken from "./middlewares/auth.js";
import createUserRouter from "./routes/user.js";
import favoritesRouter from "./routes/favorites.js";
import "dotenv/config";
import axios from "axios";
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
  app.use("/favorites", verifyToken, favoritesRouter);

  app.get("/pokemon", async (req, res) => {
    const page = req.query.page || 1;
    const offset = (page - 1) * 20;
    const url = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`;

    const data = [];
    let pokemonList = cache.get(url);

    if (!pokemonList) {
      const response = await axios.get(url);
      pokemonList = response.data;
      cache.set(url, pokemonList, 24 * 60 * 60); // 24 hours
    }

    for (const pokemon of pokemonList.results) {
      let pokemonData = cache.get(pokemon.url);

      if (!pokemonData) {
        const response = await axios.get(pokemon.url);
        pokemonData = {
          id: response.data.id,
          image: response.data.sprites.front_default,
          types: response.data.types.map((type) => type.type.name),
        };

        cache.set(pokemon.url, pokemonData, 24 * 60 * 60); // 24 hours
      }

      pokemonData.name = pokemon.name;

      data.push(pokemonData);
    }

    res.json({
      info: {
        count: pokemonList.count,
        next: pokemonList.next,
        prev: pokemonList.previous,
      },
      results: data,
    });
  });

  app.listen(PORT, () => {
    console.log(
      `Server is running on port ${PORT}\n\n\thttp://localhost:${PORT}\n\n`
    );
  });
};

export default createApp;
