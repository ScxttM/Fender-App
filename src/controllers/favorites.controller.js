import FavoritesModel from "../models/favorites.model.js";
import axios from "axios";

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

  getRickAndMortyFavoritesData = async (req, res) => {
    let { iduser } = req.params;
    if (!iduser) {
      iduser = req.session.iduser;
    }

    const favorites = await FavoritesModel.getRickAndMortyFavorites({ iduser });

    if (!favorites) {
      return res.status(500).json({ error: "Error getting favorites" });
    }

    let url = "https://rickandmortyapi.com/api/character/";
    favorites.forEach((favorite) => {
      url += `${favorite.id},`;
    });

    url = url.slice(0, -1);

    let data = this.cache.get(url);

    if (!data) {
      const response = await axios.get(url);
      data = response.data;
      this.cache.set(url, data, 24 * 60 * 60); // 24 hours
    }

    res.json(data);
  };

  createRickAndMortyFavorite = async (req, res) => {
    const { id } = req.body;
    const iduser = req.session.iduser;
    const result = await FavoritesModel.createRickAndMortyFavorite({
      iduser,
      api_id: id,
    });

    if (!result) {
      return res.status(500).json({ error: "Error creating favorite" });
    }

    res.json({ message: "Favorite created", id: result });
  };

  deleteRickAndMortyFavorite = async (req, res) => {
    const { id } = req.params;
    const iduser = req.session.iduser;
    const result = await FavoritesModel.deleteRickAndMortyFavorite({
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

  getPokemonFavoritesData = async (req, res) => {
    let { iduser } = req.params;
    if (!iduser) {
      iduser = req.session.iduser;
    }

    const favorites = await FavoritesModel.getPokemonFavorites({ iduser });

    if (!favorites) {
      return res.status(500).json({ error: "Error getting favorites" });
    }

    const data = await Promise.all(
      favorites.map(async (favorite) => {
        const url = `https://pokeapi.co/api/v2/pokemon/${favorite.id}`;
        let pokemon = this.cache.get(url);

        if (!pokemon) {
          const response = await axios.get(url);
          pokemon = {
            id: response.data.id,
            name: capitalize(response.data.name),
            image: response.data.sprites.front_default,
            types: response.data.types.map((type) => type.type.name),
          };
          this.cache.set(url, pokemon, 24 * 60 * 60); // 24 hours
        }

        return pokemon;
      })
    );

    res.json(data);
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

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}
