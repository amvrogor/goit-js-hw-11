import axios from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const input = document.querySelector('input[type="text"]');
const submit = document.querySelector('button[type="submit"]');
const photoCard = document.querySelector('.photo-card');
const btnContainer = document.querySelector('.btn-container');
const loadMore = document.querySelector('.load-more');

let page = 1;
let per_page = 40;
let query = '';
let totalHits = 0;

form.style.position = 'fixed';
form.style.left = '0';
form.style.top = '0';
form.style.width = '100%';
form.style.textAlign = 'center';
form.style.padding = '10px';
form.style.backgroundColor = '#582BB8';
input.style.width = '400px';
input.style.fontSize = '17px';
submit.style.fontSize = '17px';

gallery.style.display = 'flex';
gallery.style.flexWrap = 'wrap';
gallery.style.gap = '10px';
gallery.style.justifyContent = 'center';
gallery.style.marginTop = '55px';

btnContainer.style.display = 'flex';
btnContainer.style.padding = '10px';
loadMore.style.marginLeft = 'auto';
loadMore.style.marginRight = 'auto';
loadMore.style.fontSize = '17px';
loadMore.style.textTransform = 'uppercase';
loadMore.style.padding = '10px';
loadMore.style.backgroundColor = '#582BB8';
loadMore.style.color = '#fff';
loadMore.style.borderRadius = '8px';
loadMore.addEventListener('mouseenter', e => {
  e.currentTarget.style.backgroundColor = '#5D21DC';
  e.currentTarget.style.cursor = 'pointer';
});
loadMore.addEventListener(
  'mouseleave',
  e => (e.currentTarget.style.backgroundColor = '#582BB8')
);

loadMore.hidden = true;

form.addEventListener('submit', onSubmit);
loadMore.addEventListener('click', onLoad);

function onSubmit(e) {
  e.preventDefault();
  query = e.currentTarget.elements[0].value.trim().toLowerCase();
  page = 1;
  loadMore.hidden = true;
  pixaBayAPI(query, page)
    .then(data => {
      if (data.hits.length === 0) {
        gallery.innerHTML = '';
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        gallery.innerHTML = createMarkup(data);
        totalHits = data.totalHits;
        if (totalHits >= per_page) {
          loadMore.hidden = false;
        }
        Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        SimpleLightboxModal();
      }
    })
    .catch(err => console.log(err));
}

function onLoad() {
  page += 1;
  if (page > Math.ceil(totalHits / per_page)) {
    loadMore.hidden = true;
    Notiflix.Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else
    pixaBayAPI(query, page)
      .then(data => {
        gallery.insertAdjacentHTML('beforeend', createMarkup(data));
        SimpleLightboxModal();
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
      }) =>
        `<div class="photo-card"
          style="width: 400px;
          height: 280px;          
          border: 1px solid #eee;"
        >
          <a class="gallery-img" href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}"
            loading="lazy"
            width=100%
            height=80%
            style="display: block;
            object-fit: cover"/>
          </a>
          <div class="info"
            style="padding: 10px;
            display: flex;
            justify-content: space-around;
            font-family: sans-serif;
            font-size: 13px"
          >
            <p class="info-item"
              style="display: flex;
              flex-direction: column;
              align-items: center;
              margin: 0;"
            >
              <b style="margin-bottom: 5px">
              Likes
              </b>
              ${likes}
            </p>
            <p class="info-item"
              style="display: flex;
              flex-direction: column;
              align-items: center;
              margin: 0;"
            >
              <b style="margin-bottom: 5px">
              Views
              </b>
              ${views}
            </p>
            <p class="info-item"
              style="display: flex;
              flex-direction: column;
              align-items: center;
              margin: 0;"
            >
              <b style="margin-bottom: 5px">
              Comments
              </b>
              ${comments}
            </p>
            <p class="info-item"
              style="display: flex;
              flex-direction: column;
              align-items: center;
              margin: 0;"
            >
              <b style="margin-bottom: 5px">
              Downloads
              </b>
              ${downloads}
            </p>
          </div>
    </div>`
    )
    .join('');
}

function SimpleLightboxModal() {
  new SimpleLightbox('.gallery a').refresh();
}
