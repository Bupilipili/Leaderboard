/* eslint-disable import/prefer-default-export */
import { Record } from './classRecord.js';

export class RecordsCollection {
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

  clearInput = () => {
    this.Name.value = '';
    this.Score.value = '';
  };

  saveRecords() {
    localStorage.setItem('records', JSON.stringify(this.collection));
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