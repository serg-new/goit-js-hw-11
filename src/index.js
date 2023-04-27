import './css/styles.css';
import Notiflix from 'notiflix';
const axios = require('axios').default;
import CardsApiService from './cards-service';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  animationSpeed: 250,
  fadeSpeed: 200,
});

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
loadMoreBtn.style.display = 'none';

const cardsApiService = new CardsApiService();

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(e) {
  e.preventDefault();

  cardsApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (cardsApiService.query === '') {
    Notiflix.Notify.info('Enter your request in the search');
    return;
  }

  cardsApiService.resetPage();

  cardsApiService.fetchCards().then(data => {
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.style.display = 'none';
      return;
    } else {
      Notiflix.Notify.info(`Hooray! We found ${data.totalHits} images.`);
      loadMoreBtn.style.display = 'flex';
    }

    appendMarkup(data);
    lightbox.refresh();
  }
  );

  clearGallery();
}
function appendMarkup(data) {
  const hits = data.hits;
  const markup = hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `
      <div class="photo-card">
    <a  href='${largeImageURL}' alt='${tags}' class='gallery__link'>
     <img  src='${webformatURL}' alt='${tags}' loading='lazy' class='img' />
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
      <b> Downloads</b>
      ${downloads}
    </p>
  </div>
</div>`;
    }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
}

function clearGallery() {
  gallery.innerHTML = '';
}

function onLoadMore() {
  cardsApiService.fetchCards().then(data => {
    console.log(cardsApiService.currentPage(data));
    if (cardsApiService.currentPage(data) < Math.ceil(data.totalHits / 40)) {
      appendMarkup(data);
      lightbox.refresh();
    } else {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.style.display = 'none';
    }
  }
  );
}
