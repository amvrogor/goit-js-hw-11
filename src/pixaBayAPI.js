export { pixaBayAPI };
import { per_page } from './index';
import axios from 'axios';

async function pixaBayAPI(query, page) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '32952504-2527882a1c0dde7bb411b7994';
  const searchParams = new URLSearchParams({
    key: KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
    page: page,
    per_page,
  });
  const response = await axios.get(`${BASE_URL}?${searchParams}`);
  return response.data;
}
