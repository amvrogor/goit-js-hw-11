import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');
// const submit = document.querySelector('button[type="submit"]');
const gallery = document.querySelector('.gallery');
const photoCard = document.querySelector('.photo-card');
const loadMore = document.querySelector('.load-more');

gallery.style.display = 'flex';
gallery.style.flexWrap = 'wrap';
gallery.style.gap = '10px';
// photoCard.style.width = '300px';

form.addEventListener('submit', onSubmit);

const SimpleLightboxModal = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
}).refresh();

function onSubmit(e) {
  e.preventDefault();
  const query = e.currentTarget.elements[0].value.trim().toLowerCase();
  pixaBayAPI(query)
    // .then(data => console.log(data))
    .then(data => (gallery.innerHTML = createMarkup(data)))
    .catch(err => console.log(err));
}

async function pixaBayAPI(query) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '32952504-2527882a1c0dde7bb411b7994';
  const searchParams = new URLSearchParams({
    key: KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: 'true',
  });
  const response = await axios.get(`${BASE_URL}?${searchParams}`);
  return response.data;
}

function createMarkup(data) {
  return data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,

        // totalHits,
      }) => `<div class="photo-card" style="width: 300px">
  <a class="gallery-img" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width=100% />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`
    )
    .join('');
}
