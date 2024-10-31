<template>
  <div id="app">
    <h1>ICRC UNSC Initiative</h1>
    <form @submit.prevent="handleSearch">
      <input type="text" v-model="searchQuery" placeholder="Enter search query" />
      <button type="submit">Search</button>
    </form>
    <div v-if="searchResult">
      <h2>Search Results</h2>
      <pre>{{ searchResult }}</pre>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'App',
  data() {
    return {
      searchQuery: '',
      searchResult: null,
    };
  },
  methods: {
    async handleSearch() {
      try {
        const response = await axios.post('https://your-mongodb-atlas-url.com/search', {
          query: this.searchQuery,
        });
        this.searchResult = response.data;
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

form {
  margin-bottom: 20px;
}

input {
  padding: 10px;
  font-size: 16px;
  width: 300px;
  margin-right: 10px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

pre {
  text-align: left;
  background-color: #f8f8f8;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
