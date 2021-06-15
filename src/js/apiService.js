const API_KEY = '22025483-02f71c6158d17e06d5b927dc1';
const BASE_URL = 'https://pixabay.com/api/';

export default class imgsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchImages() {
    const searchParams = new URLSearchParams({
      q: this.searchQuery,
      page: this.page,
      per_pae: 12,
    });

    const url = `${BASE_URL}?image_type=photo&orientation=horizontal&${searchParams}&key=${API_KEY}`;

    return fetch(url)
      .then(r => r.json())
      .then(({ hits }) => {
        this.incrementPage();
        return hits;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
