import getRefs from './get-refs.js';
import API from './apiService';
import galleryImgTpl from '../templates/gallery-img.hbs';

import * as basicLightbox from 'basiclightbox';
import * as PNotify from '@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '@pnotify/mobile/dist/PNotifyMobile.js';
import '@pnotify/core/dist/BrightTheme.css';

PNotify.defaultModules.set(PNotifyMobile, {});
PNotify.defaults.delay = 2500;

const refs = getRefs();
const imgsApiService = new API();

refs.searchForm.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  imgsApiService.query = e.currentTarget.elements.query.value.trim();

  if (imgsApiService.query === '') {
    onFetchError();
    return;
  }

  imgsApiService.resetPage();
  clearGalleryContainer();
  fetchGalleryImages();
}

function fetchGalleryImages() {
  imgsApiService.fetchImages().then(hits => {
    appendImgsMarkup(hits);

    // пытаюсь добавить lightbox image
    // refs.galleryContainer.addEventListener('click', onGalleryImgClick);

    // function onGalleryImgClick(e) {
    //   // basicLightbox.create(`img`).show()
    //   const visible = basicLightbox.visible();
    //   // basicLightbox.create(modalImgTpl(hits)).show();
    //   console.log(e.target);
    // }
  });
}

function appendImgsMarkup(hits) {
  if (hits.length === 0) {
    PNotify.error({
      text: 'Oops! Nothing is found! Try another query!',
    });
  }

  refs.galleryContainer.insertAdjacentHTML('beforeend', galleryImgTpl(hits));
}

function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}

function onFetchError() {
  PNotify.error({
    text: 'Please enter your query!',
  });
}

const onEntry = (entries, SELF) => {
  entries.forEach(entry => {
    if (entry.isIntersecting === true && imgsApiService.query !== '') {
      fetchGalleryImages();
    }
  });
};

const options = {
  rootMargin: '200px',
};

const observer = new IntersectionObserver(onEntry, options);
observer.observe(refs.scrollContainer);
