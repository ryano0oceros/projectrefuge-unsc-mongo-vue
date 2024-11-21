<template>
  <div id="app">
    <h1>UN Resolution Lookup</h1>
    <img v-if="!isMobile" src="@/assets/GHxICRC.png" alt="Center Image" class="center-image"/>
    <h2 v-if="!isMobile"></h2>
    <h2 v-if="!isMobile"></h2>
    <h2 v-if="!isMobile"></h2>
    <h2 v-if="!isMobile">An OSS tool for searching UN Resolutions</h2>
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
        <li v-for="result in limitedResults" :key="result._id">
          <div class="list-item">
            <span :class="{ bold: !expandedResults.includes(result._id) }">{{ result.content.split('\n')[0] }}</span>
            <button @click="toggleExpand(result._id)">
              {{ expandedResults.includes(result._id) ? '-' : '+' }}
            </button>
          </div>
          <div v-if="expandedResults.includes(result._id)" class="details">
            <p>{{ result.content }}</p>
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
      limit: 50,
      expandedResults: [],
      isMobile: false,
    };
  },
  computed: {
    limitedResults() {
      return this.results.slice(0, this.limit);
    },
  },
  methods: {
    search() {
      axios.get(`https://cbi2zh5gz9.execute-api.us-east-1.amazonaws.com/prod/search?q=${this.query}`)
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
    checkIfMobile() {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      this.isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    },
  },
  mounted() {
    this.checkIfMobile();
  },
};
</script>

<style>
body {
  font-family: 'Mona Sans', sans-serif;
  background-color: #f9f9f9;
  color: #333;
  background-image: url('@/assets/LightB.png');
  background-size: 2560px 937px;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 0 auto;
  position: relative; /* Ensure the app container is the positioning context */
}

h1 {
  font-size: 2.5em; /* Larger font size for the title */
  font-weight: bold; /* Bold font weight for the title */
  color: #24292e;
  position: relative;
  z-index: 1; /* Ensure the title is above the image */
  text-align: center; /* Center align the title */
}

.center-image {
  position: absolute;
  top: -20px; /* Adjust this value to control the overlap */
  left: 50%;
  transform: translateX(-50%);
  max-width: 600px; /* Adjust the size of the image */
  z-index: 0; /* Ensure the image is below the title and subtitle */
}

h2 {
  font-size: 1.5em; /* Slightly smaller font size for the subtitle */
  font-weight: normal; /* Lighter font weight for the subtitle */
  color: #24292e;
  position: relative;
  z-index: 1; /* Ensure the subtitle is above the image */
  text-align: center; /* Center align the subtitle */
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

input, button, select {
  font-size: 1.2em;
}

ul {
  list-style-type: none;
  padding: 0;
  width: 100%; /* Ensure the list takes full width on mobile */
}

li {
  background-color: #fff;
  border: 1px solid #ddd;
  margin-bottom: 10px; /* Increased margin for better spacing on mobile */
  padding: 15px; /* Increased padding for better touch experience */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}

.bold {
  font-weight: bold;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 400px;
  flex-wrap: wrap; /* Allow items to wrap on smaller screens */
}

.list-item span {
  flex-grow: 1; /* Allow the text to take up remaining space */
  margin-right: 10px; /* Add space between the text and the button */
  font-size: 1em; /* Consistent font size for search results */
}

.details {
  margin-top: 10px;
  padding: 10px;
  background-color: #f9f9f9;
  border-top: 1px solid #ddd;
  font-weight: normal; /* Ensure the expanded text is not bold */
}

li div div {
  margin-top: 10px;
  padding: 10px;
  background-color: #f1f1f1;
  border: 1px solid #ddd;
}

.resolution-number {
  font-weight: bold; /* Bold font weight for the resolution number */
}

@media (max-width: 600px) {
  h1 {
    font-size: 1.5em; /* Smaller font size for the title on mobile */
  }

  h2 {
    font-size: 1em; /* Smaller font size for the subtitle on mobile */
  }

  .center-image {
    top: 30px; /* Adjust the overlap for smaller screens */
    max-width: 70%; /* Adjust the size of the image for smaller screens */
  }

  button, select, input {
    font-size: 0.9em; /* Adjusted font size for better readability on mobile */
    padding: 8px 15px; /* Adjusted padding for touch-friendly elements */
  }

  li {
    padding: 10px; /* Adjusted padding for better touch experience on mobile */
  }

  .list-item span {
    font-size: 0.9em; /* Adjusted font size for search results on mobile */
  }
}
</style>