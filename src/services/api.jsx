import axios from "axios";

export const pegarInfoAnuncios = () => {
  return axios.get("https://api.npoint.io/2cb823d072b00dd1fd51");
};

export const pegarEstados = () => {
  return axios
    .get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados`)
    .then((res) => {
      return res.data
        .map((estado) => estado.nome)
        .sort((a, b) => a.localeCompare(b));
    });
};
