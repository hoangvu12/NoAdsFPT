import FPTPlay from "../utils/fptplay";
import axios from "axios";

export async function search({ keyword, per_page = 24, page = 1 }) {
  const endpoint = "search/vod/all";
  const query = {
    query_str: keyword,
    per_page,
    page,
  };

  const URL = FPTPlay.getUrl(endpoint, query);

  const { data } = await axios.get(URL);

  return data.result;
}

export async function getList({ structure_id, per_page = 12, page = 1 }) {
  const endpoint = "highlight";
  const query = {
    structure_id,
    per_page,
    page,
  };

  const URL = FPTPlay.getUrl(endpoint, query);

  const { data } = await axios.get(URL);

  return data.result_list;
}

export async function getAnimeInfo({ id }) {
  const endpoint = `vod/${id}`;
  const URL = FPTPlay.getUrl(endpoint);

  const { data } = await axios.get(URL);

  return data.result;
}

export async function getTrendingKeywords() {
  const URL =
    "https://api.fptplay.net/search/v1/search/vod/trendingKeywords?per_page=10&st=lirOaiKG7fL-EeXYOgnXuA&e=1618415348693&device=Opera(version:undefined)";

  const { data } = await axios.get(URL);

  return data.result;
}

export async function getVideoSource({
  id,
  episode = 0,
  quality = "auto_vip",
}) {
  const endpoint = `stream/vod/${id}/${episode}/${quality}`;
  const URL = FPTPlay.getUrl(endpoint);

  const { data } = await axios.get(URL);

  const response = data.data;

  return response;
}
