import FavoritesModel from "../models/favorites.model.js";

export class FavoritesController {
  constructor(cache) {
    this.cache = cache;
  }

  getRickAndMortyFavorites = async (req, res) => {
    let { iduser } = req.params;
    if (!iduser) {
      iduser = req.session.iduser;
    }

    const favorites = await FavoritesModel.getRickAndMortyFavorites({ iduser });

    if (!favorites) {
      return res.status(500).json({ error: "Error getting favorites" });
    }

    res.json(favorites);
  };

  createRickAndMortyFavorite = async (req, res) => {
    const { id } = req.body;
    const iduser = req.session.iduser;
    const result = await FavoritesModel.create({ iduser, api_id: id });

    if (!result) {
      return res.status(500).json({ error: "Error creating favorite" });
    }

    res.json({ message: "Favorite created", id: result });
  };

  deleteRickAndMortyFavorite = async (req, res) => {
    const { id } = req.params;
    const iduser = req.session.iduser;
    const result = await FavoritesModel.delete({ iduser, api_id: id });

    if (!result) {
      return res.status(500).json({ error: "Error deleting favorite" });
    } else if (result === 0) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    res.json({ message: "Favorite deleted" });
  };

  getPokemonFavorites = async (req, res) => {
    let { iduser } = req.params;
    if (!iduser) {
      iduser = req.session.iduser;
    }

    const favorites = await FavoritesModel.getPokemonFavorites({ iduser });

    if (!favorites) {
      return res.status(500).json({ error: "Error getting favorites" });
    }

    res.json(favorites);
  };

  createPokemonFavorite = async (req, res) => {
    const { id } = req.body;
    const iduser = req.session.iduser;
    const result = await FavoritesModel.createPokemonFavorite({
      iduser,
      api_id: id,
    });

    if (!result) {
      return res.status(500).json({ error: "Error creating favorite" });
    }

    res.json({ message: "Favorite created", id: result });
  };

  deletePokemonFavorite = async (req, res) => {
    const { id } = req.params;
    const iduser = req.session.iduser;
    const result = await FavoritesModel.deletePokemonFavorite({
      iduser,
      api_id: id,
    });

    if (!result) {
      return res.status(500).json({ error: "Error deleting favorite" });
    } else if (result === 0) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    res.json({ message: "Favorite deleted" });
  };
}
