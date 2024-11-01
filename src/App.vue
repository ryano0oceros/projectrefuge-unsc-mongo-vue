<template>
  <div id="app">
    <h1>ICRC UNSC</h1>
    <form @submit.prevent="search">
      <input type="text" v-model="query" placeholder="Enter search query" />
      <button type="submit">Search</button>
    </form>
    <div v-if="results.length">
      <h2>Search Results</h2>
      <ul>
        <li v-for="result in results" :key="result._id">{{ result.title }}</li>
      </ul>
    </div>
    <div v-else-if="searched">
      <p>No results found.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      query: '',
      results: [],
      searched: false,
    };
  },
  methods: {
    search() {
      axios.get(`http://localhost:3000/search?q=${this.query}`)
        .then(response => {
          this.results = response.data;
          this.searched = true;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
  },
};
</script>

<style>
/* Add your styles here */
</style>