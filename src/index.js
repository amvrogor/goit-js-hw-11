export { per_page };

import './css/styles.css';
import {
  form,
  gallery,
  input,
  submit,
  photoCard,
  btnContainer,
  loadMore,
} from './domElements';
import { pixaBayAPI } from './pixaBayAPI';
import { createMarkup } from './createMarkup';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';

const SimpleLightboxModal = new SimpleLightbox('.gallery a');

let page = 1;
let per_page = 40;
let query = '';
let totalHits = 0;

// form.style.position = 'fixed';
// form.style.left = '0';
// form.style.top = '0';
// form.style.width = '100%';
// form.style.textAlign = 'center';
// form.style.padding = '10px';
// form.style.backgroundColor = '#582BB8';
// input.style.width = '400px';
// input.style.fontSize = '17px';
// submit.style.fontSize = '17px';

// gallery.style.display = 'flex';
// gallery.style.flexWrap = 'wrap';
// gallery.style.gap = '10px';
// gallery.style.justifyContent = 'center';
// gallery.style.marginTop = '55px';

// btnContainer.style.display = 'flex';
// btnContainer.style.padding = '10px';
// loadMore.style.marginLeft = 'auto';
// loadMore.style.marginRight = 'auto';
// loadMore.style.fontSize = '17px';
// loadMore.style.textTransform = 'uppercase';
// loadMore.style.padding = '10px';
// loadMore.style.backgroundColor = '#582BB8';
// loadMore.style.color = '#fff';
// loadMore.style.borderRadius = '8px';
// loadMore.addEventListener('mouseenter', e => {
//   e.currentTarget.style.backgroundColor = '#5D21DC';
//   e.currentTarget.style.cursor = 'pointer';
// });
// loadMore.addEventListener(
//   'mouseleave',
//   e => (e.currentTarget.style.backgroundColor = '#582BB8')
// );

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
        SimpleLightboxModal.refresh();
      }
    })
    .catch(err => console.log(err));
}

function onLoad() {
  page += 1;
  pixaBayAPI(query, page)
    .then(data => {
      gallery.insertAdjacentHTML('beforeend', createMarkup(data));
      SimpleLightboxModal.refresh();
      if (page >= Math.ceil(totalHits / per_page)) {
        loadMore.hidden = true;
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(err => console.log(err));
}
