const fetch = require('node-fetch');
const AbortController = require('abort-controller');
const url = require('url');
const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  let controller = new AbortController();
  setTimeout(() => controller.abort(), 1000);

  function timeoutPromise(ms, promise) {
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('timeout'));
      }, ms);
      promise.then(
        (res) => {
          clearTimeout(timeoutId);
          resolve(res);
        },
        (err) => {
          clearTimeout(timeoutId);
          reject(err);
        }
      );
    });
  }

  let link = message.content.slice(9);
  let domain = url.parse(link).host;

  let data = await timeoutPromise(1000, fetch(`${link}.json`, { headers: client.config.headers }))
    .then((response) => {
      return response.json();
    })
    .catch((err) => {
      console.log(err);

      if (err.message.includes('invalid json response body')) {
        message.channel.send('```' + 'Error retrieving variants' + '```');
      } else if (err.message === 'timeout') {
        message.channel.send('```' + 'Site must be Shopify' + '```');
      }
    });

  let sizes = [];

  for (let i = 0; i < data['product']['options'].length; i++) {
    if (data['product']['options'][i]['name'] === 'Size') {
      sizes = data['product']['options'][i]['values'];
      break;
    }
  }

  let vars = '';

  for (let i = 0; i < sizes.length; i++) {
    vars += `${sizes[i]} - ${data['product']['variants'][i]['id']}`;

    if (i != sizes.length - 1) {
      vars += '\n';
    }
  }

  const embed = new Discord.MessageEmbed()
    .setTitle(data['product']['title'])
    .setURL(link)
    .setColor(16777214)
    .setThumbnail(data['product']['image']['src'])
    .addField('Price', `$${data['product']['variants'][0]['price']}`, true)
    .addField('Site', domain, true)
    .addField('Variants', vars);

  message.channel.send({ embed }).then(console.log(`${message} completed`));
};
