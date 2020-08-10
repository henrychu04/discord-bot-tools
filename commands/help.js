exports.run = async (client, message, args) => {
  message.channel
    .send({
      embed: {
        title: 'All Commands',
        color: 16777214,
        fields: [
          { name: 'Shopify Variant Scraper', value: '!shopify <shopify link>' },
          { name: 'Fee Calculator for StockX, Goat, Stadium Goods', value: '!fee <amount>' },
          {
            name: 'Sends latest Supreme drop info, current Supreme week, or the Supreme drop info for a specific week',
            value: '!droplist, !droplist num, !droplist <number>',
          },
          { name: 'StockX Product Scraper', value: '!stockx <search parameters>' },
          { name: 'Scrapes information and lowest asks of a Stockx product', value: '!stockx <search parameters>' },
          { name: 'Scrapes information and lowest asks of a GOAT product', value: '!goat <search parameters>' },
        ],
      },
    })
    .then(console.log(`${message} completed`));
};
