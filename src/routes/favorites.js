import { Router } from "express";
import { FavoritesController } from "../controllers/favorites.controller.js";

const createFavoritesRouter = (cache) => {
  const favoritesRouter = Router();

  const favoritesController = new FavoritesController(cache);

  // Rick and Morty
  favoritesRouter.get(
    "/rick-and-morty",
    favoritesController.getRickAndMortyFavorites
  );
  favoritesRouter.get(
    "/rick-and-morty/:iduser",
    favoritesController.getRickAndMortyFavorites
  );
  favoritesRouter.get(
    "/rick-and-morty/:iduser/data",
    favoritesController.getRickAndMortyFavoritesData
  );
  favoritesRouter.post(
    "/rick-and-morty",
    favoritesController.createRickAndMortyFavorite
  );
  favoritesRouter.delete(
    "/rick-and-morty/:id",
    favoritesController.deleteRickAndMortyFavorite
  );

  // Pokemon
  favoritesRouter.get("/pokemon", favoritesController.getPokemonFavorites);
  favoritesRouter.get(
    "/pokemon/:iduser",
    favoritesController.getPokemonFavorites
  );
  favoritesRouter.get(
    "/pokemon/:iduser/data",
    favoritesController.getPokemonFavoritesData
  );
  favoritesRouter.post("/pokemon", favoritesController.createPokemonFavorite);
  favoritesRouter.delete(
    "/pokemon/:id",
    favoritesController.deletePokemonFavorite
  );

  return favoritesRouter;
};

export default createFavoritesRouter;
