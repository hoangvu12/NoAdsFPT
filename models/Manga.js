import axios from "axios";

const BASE_URL = "https://nguyenvu-stuff.glitch.me/nettruyen";

export async function getList({
  type = "recommended",
  page = 1,
  per_page = 33,
}) {
  const URL = `${BASE_URL}/list?type=${type}&page=${page}`;

  const { data } = await axios.get(URL);

  const list = data.data;

  return list.slice(0, per_page);
}

export async function getInfo({ slug, id }) {
  const URL = `${BASE_URL}/info?slug=${slug}&id=${id}`;

  const { data } = await axios.get(URL);

  return data.data;
}

export async function getImages({ nameSlug, chapterSlug, chapterId }) {
  const URL = `${BASE_URL}/images?nameSlug=${nameSlug}&chapterSlug=${chapterSlug}&chapterId=${chapterId}`;

  const { data } = await axios.get(URL);

  return data.data;
}

export function getImageUrl(url) {
  return `${BASE_URL}/image/${encodeURIComponent(url)}`;
}
