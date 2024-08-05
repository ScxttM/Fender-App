import axios from "axios";

export class RickAndMortyController {
  constructor(cache) {
    this.cache = cache;
  }

  getAll = async (req, res) => {
    try {
      const page = req.query.page || 1;
      const url = `https://rickandmortyapi.com/api/character/?page=${page}`;

      let data = this.cache.get(url);

      if (!data) {
        const response = await axios.get(url);
        data = response.data;
        this.cache.set(url, data, 24 * 60 * 60); // 24 hours
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getRandom = async (req, res) => {
    try {
      let url = "https://rickandmortyapi.com/api/character/";

      let data = this.cache.get(url);

      if (!data) {
        const response = await axios.get(url);
        data = response.data;
      }

      const randomNumber = Math.floor(Math.random() * data.info.count) + 1;
      url += randomNumber;
      data = this.cache.get(url);

      if (!data) {
        const response = await axios.get(url);
        data = response.data;
        this.cache.set(url, data, 24 * 60 * 60); // 24 hours
      }

      res.json(data);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}
