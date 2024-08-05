import axios from "axios";

export class PokemonController {
  constructor(cache) {
    this.cache = cache;
  }

  getAll = async (req, res) => {
    const page = req.query.page || 1;
    const offset = (page - 1) * 20;
    const url = `https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`;

    const data = [];
    let pokemonList = this.cache.get(url);

    if (!pokemonList) {
      const response = await axios.get(url);
      pokemonList = response.data;
      this.cache.set(url, pokemonList, 24 * 60 * 60); // 24 hours
    }

    for (const pokemon of pokemonList.results) {
      let pokemonData = this.cache.get(pokemon.url);

      if (!pokemonData) {
        const response = await axios.get(pokemon.url);
        pokemonData = {
          id: response.data.id,
          name: capitalize(response.data.name),
          image: response.data.sprites.front_default,
          types: response.data.types.map((type) => type.type.name),
          abilities: response.data.abilities.map(
            (ability) => ability.ability.name
          ),
        };

        this.cache.set(pokemon.url, pokemonData, 24 * 60 * 60); // 24 hours
      }

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
  };

  getRandom = async (req, res) => {
    try {
      let url = "https://pokeapi.co/api/v2/pokemon/";

      let data = this.cache.get(url);

      if (!data) {
        const response = await axios.get(url);
        data = response.data;
      }

      data = data || { count: 1118 };

      const randomNumber = Math.floor(Math.random() * data.count) + 1;
      url += randomNumber;
      data = this.cache.get(url);

      console.log(url);

      if (!data) {
        const response = await axios.get(url);

        data = {
          id: response.data.id,
          name: capitalize(response.data.name),
          image: response.data.sprites.front_default,
          types: response.data.types.map((type) => type.type.name),
          abilities: response.data.abilities.map(
            (ability) => ability.ability.name
          ),
        };

        this.cache.set(url, data, 24 * 60 * 60); // 24 hours
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Pokemon not found" });
    }
  };
}

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}
