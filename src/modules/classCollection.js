import Record from './classRecord.js';

// Represents a collection of records and manages interactions with API and local storage
class RecordsCollection {
  constructor() {
    // Load existing records from local storage or initialize an empty array
    this.collection = JSON.parse(localStorage.getItem('records')) || [];
    this.buttonAdd = document.querySelector('.add-button');
    this.buttonRefresh = document.querySelector('.refresh-button');
    this.Name = document.querySelector('.input-field1');
    this.Score = document.querySelector('.input-field2');
    this.Table = document.querySelector('.table-section');

    // Load the game ID from local storage (if available) or initialize it as null
    this.gameID = localStorage.getItem('gameID');

    // Add event listeners to buttons and initialize the instance
    this.buttonAdd.addEventListener('click', () => this.addRecords());
    this.buttonRefresh.addEventListener('click', () => this.fetchScoresAndShowRecords());
    this.init();
  }

  // Method to create a new game and get the game ID from the API
  async createGame() {
    try {
      const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/';
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Crust',
        }),
      };

      const response = await fetch(url, requestOptions);
      const data = await response.json();
      /* eslint-disable no-console */

      if (data && data.result) {
        this.gameID = data.result.replace('Game with ID: ', '');
        console.log('Game ID:', this.gameID);
        localStorage.setItem('gameID', this.gameID); // Save the game ID in local storage
      } else {
        console.error('Error creating game:', data);
      }
    } catch (error) {
      console.error('Error creating game:', error);
    }
  }

  // Method to add a new record to the collection and send it to the API
  async addRecords() {
    if (this.Name.value !== '' && this.Score.value !== '') {
      const record = new Record(this.Name.value, this.Score.value);
      this.collection.unshift(record);
      this.saveRecords();
      await this.sendRecordToAPI(record);
      this.clearInput();
    }
  }

  // Method to save the collection to local storage
  saveRecords() {
    localStorage.setItem('records', JSON.stringify(this.collection));
  }

  // Method to send a record to the API
  async sendRecordToAPI(record) {
    try {
      if (!this.gameID) {
        console.error('Game ID is not available. Please create a game first.');
        return;
      }

      const url = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${this.gameID}/scores/`;
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: record.name,
          score: record.score,
        }),
      };

      const response = await fetch(url, requestOptions);
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error sending data to API:', error);
    }
  }

  // Method to fetch scores from the API and update the collection
  async fetchScores() {
    try {
      if (!this.gameID) {
        console.error('Game ID is not available. Please create a game first.');
        return;
      }

      const url = `https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/${this.gameID}/scores/`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.result && Array.isArray(data.result)) {
        this.collection = data.result.map((record) => new Record(record.user, record.score));
        this.saveRecords();
      }
    } catch (error) {
      console.error('Error fetching data from API:', error);
    }
  }

  // Method to fetch scores from the API and update the table-section
  async fetchScoresAndShowRecords() {
    await this.fetchScores();
    this.showRecords();
  }

  // Method to display records in the table-section
  showRecords() {
    // Sort the collection by score in descending order
    this.collection.sort((a, b) => b.score - a.score);

    // Create an array of HTML elements representing each record
    const displayRecords = this.collection.map((record, index) => `
      <div class="record-store ${index % 2 === 1 ? 'odd-index' : ''}">
        <div class="store-text">
          <p class="name">${record.name}</p>
          <p class="by-text">:</p>
          <p class="score">${record.score}</p>
        </div>
      </div>
    `);

    // Replace the existing content in the 'table-section' with the new records
    this.Table.innerHTML = displayRecords.join('');
  }

  // Method to clear input fields after submitting a record
  clearInput() {
    this.Name.value = '';
    this.Score.value = '';
  }

  // Method to initialize the instance and create a new game
  init() {
    if (!this.gameID) {
      this.createGame();
    } else {
      this.fetchScoresAndShowRecords();
    }
  }
}

export default RecordsCollection;
