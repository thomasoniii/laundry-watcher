const googlehome = require('google-home-notifier');
const axios = require('axios');

googlehome.device('Google-Home-dc3c6f4886e0fe534cf5d778abd71730');
googlehome.accent('us');
//googlehome.notify('System offline. System online', (res) => {});
//googlehome.notify('System online', (res) => {});


let status = { washer : 'stopped', dryer : 'stopped' };

setInterval( () => {
  axios.get('http://localhost:3000/status')
    .then( response => {
      const newStatus = response.data;

      let messages = [];

      if (newStatus.washer === 'stopped' && status.washer === 'running') {
        messages.push('Washer is done');
      }

      if (newStatus.dryer === 'stopped' && status.dryer === 'running') {
        messages.push('Dryer is done');
      }

      status = newStatus;

      console.log(`Current status : washer : ${status.washer} , dryer : ${status.dryer}`);

      if (messages.length) {
        const message = messages.join('. ');
        googlehome.notify(message);
      }
    })
    .catch(err => console.log(`Could not connect : ${err.message}`);
}, 60 * 1000);
