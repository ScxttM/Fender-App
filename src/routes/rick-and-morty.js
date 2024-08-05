import { Router } from "express";
import { RickAndMortyController } from "../controllers/rick-and-morty.controller.js";

const createRickAndMortyRouter = (cache) => {
  const rickAndMortyRouter = Router();

  const rickAndMortyController = new RickAndMortyController(cache);

  rickAndMortyRouter.get("/", rickAndMortyController.getAll);
  rickAndMortyRouter.get("/random", rickAndMortyController.getRandom);

  return rickAndMortyRouter;
};

export default createRickAndMortyRouter;
