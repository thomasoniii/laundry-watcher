const { Device } = require('google-home-notify-client');
const axios = require('axios');

const devices = [
  ['10.0.1.226', 'Living room'],
  ['10.0.1.75', 'Basement'],
  ['10.0.1.84', 'Bedroom'],
  ['10.0.1.144', 'Dog room'],
]

const INTERVAL = 60 * 1000;
//const INTERVAL = 500;

const DEBUG = false;
const STATUS_URL = 'http://localhost:3000/status';
//const STATUS_URL = 'http://laundry.local:3000/status';

let status         = { washer : 'stopped', dryer : 'stopped' };
let pendingMessage = undefined;

setInterval( () => {
  axios.get(STATUS_URL)
    .then( async response => {
      const newStatus = response.data;

      let messages = [];

      if (pendingMessage !== undefined) {
        messages.push(pendingMessage);
      }

      if (newStatus.washer === 'stopped' && status.washer === 'running') {
        for (let i; i < devices.length; i++) {
          const device = new Device(...device)
          await device.notify("Washer is done")
        }
      }

      if (newStatus.dryer === 'stopped' && status.dryer === 'running') {
        for (let i; i < devices.length; i++) {
          const device = new Device(...device)
          await device.notify("Dryer is done")
        }
      }

      status = newStatus;

      if (DEBUG) {
        console.log(`Current status : washer : ${status.washer} , dryer : ${status.dryer}`);
      }

    })
    .catch(err => {
      if (DEBUG) {
        console.log(`Could not connect : ${err.message}`)
      }
    });
}, INTERVAL);
