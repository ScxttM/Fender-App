import connection from "../database.js";

export default class Favorites {
  static async getRickAndMortyFavorites({ iduser }) {
    try {
      const [favorites] = await connection.query(
        "SELECT api_id as id FROM users_rick_and_morty_favs WHERE id = (SELECT id FROM users where iduser = UUID_TO_BIN(?));",
        [iduser]
      );

      return favorites;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async createRickAndMortyFavorite({ iduser, api_id }) {
    try {
      const [result] = await connection.query(
        "INSERT INTO users_rick_and_morty_favs (id, api_id) VALUES ((SELECT id FROM users WHERE iduser = UUID_TO_BIN(?)), ?);",
        [iduser, api_id]
      );

      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async deleteRickAndMortyFavorite({ iduser, api_id }) {
    try {
      const [result] = await connection.query(
        "DELETE FROM users_rick_and_morty_favs WHERE id = (SELECT id FROM users WHERE iduser = UUID_TO_BIN(?)) AND api_id = ?;",
        [iduser, api_id]
      );

      return result.affectedRows;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async getPokemonFavorites({ iduser }) {
    try {
      const [favorites] = await connection.query(
        "SELECT api_id as id FROM users_pokemon_favs WHERE id = (SELECT id FROM users where iduser = UUID_TO_BIN(?));",
        [iduser]
      );

      return favorites;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async createPokemonFavorite({ iduser, api_id }) {
    try {
      const [result] = await connection.query(
        "INSERT INTO users_pokemon_favs (id, api_id) VALUES ((SELECT id FROM users WHERE iduser = UUID_TO_BIN(?)), ?);",
        [iduser, api_id]
      );

      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  static async deletePokemonFavorite({ iduser, api_id }) {
    try {
      const [result] = await connection.query(
        "DELETE FROM users_pokemon_favs WHERE id = (SELECT id FROM users WHERE iduser = UUID_TO_BIN(?)) AND api_id = ?;",
        [iduser, api_id]
      );

      return result.affectedRows;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
