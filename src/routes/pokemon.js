import { Router } from "express";
import { PokemonController } from "../controllers/pokemon.controller.js";

const createPokemonRouter = (cache) => {
  const pokemonRouter = Router();

  const pokemonController = new PokemonController(cache);

  pokemonRouter.get("/", pokemonController.getAll);
  pokemonRouter.get("/random", pokemonController.getRandom);

  return pokemonRouter;
};

export default createPokemonRouter;
