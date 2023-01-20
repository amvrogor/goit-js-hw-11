import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const photoCard = document.querySelector('.photo-card');
const loadMore = document.querySelector('.load-more');

let page = 1;
let per_page = 40;

gallery.style.display = 'flex';
gallery.style.flexWrap = 'wrap';
gallery.style.gap = '10px';

loadMore.hidden = true;

form.addEventListener('submit', onSubmit);

loadMore.addEventListener('click', onLoad);

function onSubmit(e) {
  e.preventDefault();
  const query = e.currentTarget.elements[0].value.trim().toLowerCase();
  pixaBayAPI(query, page)
    .then(data => {
      if (data.hits.length === 0) {
        gallery.innerHTML = '';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        gallery.innerHTML = createMarkup(data);
        loadMore.hidden = false;
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
        const SimpleLightboxModal = new SimpleLightbox('.gallery a').refresh();
      }
    })
    .catch(err => console.log(err));
  return query;
}

function onLoad() {
  query = onSubmit();
  page += 1;
  pixaBayAPI(query, page)
    .then(data => {
      gallery.insertAdjacentHTML('beforeend', createMarkup(data));
    })
    .catch(err => console.log(err));
}

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
      }) => `<div class="photo-card" style="width: 300px">
  <a class="gallery-img" href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width=100% height=50% style="display: block; object-fit: cover" />
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
