const axios = require('axios').default;
const API_KEY = '35665563-1bf95d5c9eca70a61143b5450';
const URL = 'https://pixabay.com/api';


export default class CardsApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchCards(searchQuery) {
    try {
      const response = await axios.get(
        `${URL}/?key=${API_KEY}&q=${this.searchQuery}&q=${this.searchQuery}&page=${this.page}&per_page=40&image_type=photo&orientation=horizontal&safesearch=true`
      );
      this.page += 1;
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

  currentPage() {
    return this.page - 1;
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