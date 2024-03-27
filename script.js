document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('search-input');
  const searchHistory = document.getElementById('search-history');
  let historyItems = [];

  // Load history from local storage
  if (localStorage.getItem('searchHistory')) {
      historyItems = JSON.parse(localStorage.getItem('searchHistory'));
      displayHistory();
  }

  // Function to add a search term to the history
  function addToHistory(term) {
      if (!historyItems.includes(term)) {
          historyItems.push(term);
          localStorage.setItem('searchHistory', JSON.stringify(historyItems));
          displayHistory();
      }
  }

  // Function to display the search history
  function displayHistory() {
      searchHistory.innerHTML = ''; // Clear previous history
      historyItems.forEach(term => {
          const item = document.createElement('div');
          item.innerHTML = `User: -> <span class="search-history-item">${term}</span>`;
          item.addEventListener('click', () => {
              searchInput.value = term;
              performSearch(term);
          });
          searchHistory.appendChild(item);
      });
  }

  // Function to perform a Google search
  function performSearch(term) {
      const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(term)}`;
      window.open(googleSearchUrl, '_blank'); // Open in a new tab
  }

  // Event listener for the search input
  searchInput.addEventListener('keyup', (event) => {
      if (event.key === 'Enter') {
          const term = searchInput.value.trim();
          if (term) {
              addToHistory(term);
              performSearch(term);
              searchInput.value = ''; // Clear the input
          }
      }
  });

  const rssUrl = "https://rss.nytimes.com/services/xml/rss/nyt/US.xml";
  const rssList = document.getElementById("rss-list");

  fetch(rssUrl)
      .then(response => response.text())
      .then(data => {
          const parser = new DOMParser();
          const xml = parser.parseFromString(data, "text/xml");
          const items = xml.querySelectorAll("item");

          items.forEach(item => {
              const title = item.querySelector("title").textContent;
              const link = item.querySelector("link").textContent;

              const listItem = document.createElement("li");
              const anchor = document.createElement("a");
              anchor.textContent = title;
              anchor.href = link;
              anchor.target = "_blank";
              anchor.classList.add("rss-link"); // Add .rss-link class to the anchor
              listItem.appendChild(anchor);
              rssList.appendChild(listItem);
          });
      })
      .catch(error => {
          console.log("Error fetching RSS feed: ", error);
      });

  const logo = document.querySelector('.logo');
  const navLinks = document.querySelector('.nav-links');

  logo.addEventListener('click', function () {
      // Toggle the 'show' class on the navigation links
      navLinks.classList.toggle('show');
  });

  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');

  addTaskBtn.addEventListener('click', function () {
      const taskText = taskInput.value.trim();

      if (taskText !== '') {
          const taskItem = document.createElement('li');
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          const taskLabel = document.createElement('span');
          taskLabel.textContent = taskText;

          taskItem.appendChild(checkbox);
          taskItem.appendChild(taskLabel);
          taskList.appendChild(taskItem);

          taskInput.value = ''; // Clear the input field after adding task
      }
  });

  taskList.addEventListener('change', function (event) {
      if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
          const checkbox = event.target;
          const taskItem = checkbox.parentElement;
          if (checkbox.checked) {
              taskList.removeChild(taskItem);
          }
      }
  });

  const weatherInfo = document.getElementById('weather-info');
  const apiUrl = 'https://api.weather.gov/gridpoints/FFC/57,62/forecast';

  fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
          // Extract relevant weather information
          const temperature = data.properties.periods[0].temperature;
          const weatherConditions = data.properties.periods[0].shortForecast;

          // Create HTML content to display weather information
          const weatherHTML = `
            <p>Temperature: ${temperature}°F</p>
            <p>Weather Conditions: ${weatherConditions}</p>
          `;

          // Update weather-info div with weather information
          weatherInfo.innerHTML = weatherHTML;
      })
      .catch(error => {
          console.log('Error fetching weather data:', error);
          weatherInfo.innerHTML = '<p>Error fetching weather data</p>';
      });
});
document.getElementById('script-file').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
          const scriptContent = e.target.result;
          // You can add code here to validate the script content if needed
          // For example, checking for dangerous code before execution
          runScript(scriptContent);
      };
      reader.readAsText(file);
  }
});

document.getElementById('run-script').addEventListener('click', function() {
  const scriptContent = document.getElementById('script-file').value;
  if (scriptContent) {
      runScript(scriptContent);
  }
});
function runScript(scriptContent) {
  fetch('/run_script', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ script_content: scriptContent }),
  })
  .then(response => response.json())
  .then(data => {
      if (data.output) {
          document.getElementById('output').textContent = data.output;
      } else {
          document.getElementById('output').textContent = 'Script execution failed.';
      }
  })
  .catch(error => {
      console.error('Error:', error);
      document.getElementById('output').textContent = 'An error occurred while running the script.';
  });
}