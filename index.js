const GoogleHome = require('google-home-push');
const axios = require('axios');

const INTERVAL = 60 * 1000;
//const INTERVAL = 500;

const DEBUG = false;
const STATUS_URL = 'http://localhost:3000/status';
//const STATUS_URL = 'http://laundry.local:3000/status';

let status         = { washer : 'stopped', dryer : 'stopped' };
let pendingMessage = undefined;

setInterval( () => {
  axios.get(STATUS_URL)
    .then( response => {
      const newStatus = response.data;

      let messages = [];

      if (pendingMessage !== undefined) {
        messages.push(pendingMessage);
      }

      if (newStatus.washer === 'stopped' && status.washer === 'running') {
        messages.push('Washer is done');
      }

      if (newStatus.dryer === 'stopped' && status.dryer === 'running') {
        messages.push('Dryer is done');
      }

      status = newStatus;

      if (DEBUG) {
        console.log(`Current status : washer : ${status.washer} , dryer : ${status.dryer}`);
      }

      if (messages.length) {
        const message = messages.join('. ');
        try {
          const myHome = new GoolgeHome('Living room Home');
          myHome.speak(message);

        }
        catch(e) { pendingMessage = message };
      }

    })
    .catch(err => {
      if (DEBUG) {
        console.log(`Could not connect : ${err.message}`)
      }
    });
}, INTERVAL);
