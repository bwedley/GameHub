// GET https://api.rawg.io/api/platforms?key=f93dc247319d4f4b949e63860d7f04ec
// GET https://api.rawg.io/api/games?key=f93dc247319d4f4b949e63860d7f04ec&dates=2019-09-01,2019-09-30&platforms=18,1,7
import axios from "axios";

const API_KEY = "f93dc247319d4f4b949e63860d7f04ec";

export default async function buscarJogo(nomeJogo) {
  try {
    const response = await axios.get(
      ""
      // `https://api.rawg.io/api/games?key=${API_KEY}&search=${nomeJogo}&page_size=1`
    );
    const jogos = response.data.results;
    if (jogos.length > 0) {
      return jogos;
    } else {
      return null;
    }
  } catch (err) {
    console.error("Erro: ", err);
    return null;
  }
}
