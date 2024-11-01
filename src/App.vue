<template>
  <div id="app">
    <h1>ICRC UNSC</h1>
    <form @submit.prevent="search">
      <input type="text" v-model="query" placeholder="Enter search query" />
      <button type="submit">Search</button>
      <select v-model="limit">
        <option value="5">Top 5</option>
        <option value="10">Top 10</option>
        <option value="20">Top 20</option>
        <option value="50">Top 50</option>
      </select>
    </form>
    <div v-if="results.length">
      <h2>Search Results</h2>
      <ul>
        <li v-for="result in results" :key="result._id">
          <div>
            <p>{{ result.content.split('\n')[0] }}</p>
            <button @click="toggleExpand(result._id)">
              {{ expandedResults.includes(result._id) ? 'Collapse' : 'Expand' }}
            </button>
            <div v-if="expandedResults.includes(result._id)">
              <p>{{ result.content }}</p>
            </div>
          </div>
        </li>
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
      limit: 10,
      expandedResults: [],
    };
  },
  methods: {
    search() {
      axios.get(`http://localhost:3000/search?q=${this.query}&limit=${this.limit}`)
        .then(response => {
          this.results = response.data;
          this.searched = true;
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    toggleExpand(id) {
      if (this.expandedResults.includes(id)) {
        this.expandedResults = this.expandedResults.filter(resultId => resultId !== id);
      } else {
        this.expandedResults.push(id);
      }
    },
  },
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  color: #333;
}

h1 {
  color: #24292e;
}

button {
  background-color: #e60000;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

button:hover {
  background-color: #cc0000;
}

select {
  margin-left: 10px;
  padding: 5px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #fff;
  border: 1px solid #ddd;
  margin-bottom: 5px;
  padding: 10px;
}

li p {
  margin: 0;
}

li div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
