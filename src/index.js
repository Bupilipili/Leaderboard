import './style.css';

class Record {
    constructor(name, score) {
      this.name = name;
      this.score = score;
    }
  }
  
  class RecordsCollection {
    constructor() {
      this.collection = JSON.parse(localStorage.getItem('records')) || [];
      this.buttonAdd = document.querySelector('.add-button');
      this.Name = document.querySelector('.input-field1');
      this.Score = document.querySelector('.input-field2');
      this.Table = document.querySelector('.table-section');
  
      this.showRecords();
      this.buttonAdd.addEventListener('click', (e) => {
        e.preventDefault();
        this.addRecords();
        this.saveRecords();
        this.showRecords();
        this.clearInput();
      });
    }
  
    addRecords() {
      if (this.Name.value !== '' && this.Score.value !== '') {
        const record = new Record(this.Name.value, this.Score.value);
        this.collection.push(record);
      }
    }
  
    removeRecords(index) {
      this.collection.splice(index, 1);
      this.saveRecords();
      this.showRecords();
    }
  
    saveRecords() {
      localStorage.setItem('records', JSON.stringify(this.collection));
    }
  
    clearInput() {
      this.Name.value = '';
      this.Score.value = '';
    }
  
    showRecords() {  
        const displayRecords = this.collection.map((record, index) => `
          <div class="record-store ${index % 2 === 1 ? 'odd-index' : ''}">
            <div class="store-text">
              <p class="name">${record.name}</p>
              <p class="by-text">:</p>
              <p class="score">${record.score}</p>
            </div>
          </div>
        `);
        this.Table.innerHTML = displayRecords.join('');
    }      
  }
  
  const recordsCollection = new RecordsCollection();
  recordsCollection.addRecords();