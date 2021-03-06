const addListings = require('./addListings.js');
const deleteListings = require('./deleteListings.js');
const syncListingPrices = require('./syncListingPrices.js');
const updateLowest = require('./updateLowest.js');
const confirmOrders = require('./confirmOrders.js');
const genShipping = require('./genShipping.js');
const addOrders = require('./addOrders.js');
const deleteOrders = require('./deleteOrders.js');
const syncOrders = require('./syncOrders.js');
const earnings = require('./earnings.js');

const getAllListings = require('../../requests/getAllListings.js');
const getAllOrders = require('../../requests/getAllOrders.js');
const encryption = require('../../../scripts/encryption.js');

const Listings = require('../../../models/listings.js');
const Orders = require('../../../models/orders.js');

module.exports = class refresh {
  constructor(client, user) {
    this.client = client;
    this.user = user;
    this.loginToken = encryption.decrypt(user.aliasLogin);
    this.userListings;
    this.userOrders;
    this.aliasListings;
    this.aliasOrders;
  }

  init = async () => {
    const userListings = await Listings.find({ d_id: this.user.d_id });
    this.userListings = userListings[0];
    const userOrders = await Orders.find({ d_id: this.user.d_id });
    this.userOrders = userOrders[0];

    this.aliasListings = await getAllListings(this.client, this.loginToken);
    this.aliasOrders = await getAllOrders(this.client, this.loginToken);
  };

  addListings = async () => {
    let modified = await addListings(this.user, this.userListings, this.aliasListings);

    if (modified) {
      const userListings = await Listings.find({ d_id: this.user.d_id });
      this.userListings = userListings[0];
    }
  };

  deleteListings = async () => {
    let modified = await deleteListings(this.user, this.userListings, this.aliasListings);

    if (modified) {
      const userListings = await Listings.find({ d_id: this.user.d_id });
      this.userListings = userListings[0];
    }
  };

  syncListingPrices = async () => {
    let modified = await syncListingPrices(this.userListings, this.aliasListings);

    if (modified) {
      const userListings = await Listings.find({ d_id: this.user.d_id });
      this.userListings = userListings[0];
    }
  };

  updateLowest = async (allListings) => {
    let updateLowestRes = await updateLowest(this.client, this.user, this.loginToken, this.userListings, allListings);

    if (updateLowestRes) {
      const userListings = await Listings.find({ d_id: this.user.d_id });
      this.userListings = userListings[0];

      return { data: updateLowestRes, user: this.user, type: 'updateLowest' };
    }
  };

  addOrders = async () => {
    let addOrdersRes = await addOrders(this.user, this.userOrders, this.aliasOrders);

    if (addOrdersRes) {
      const userOrders = await Orders.find({ d_id: this.user.d_id });
      this.userOrders = userOrders[0];

      return { data: addOrdersRes, user: this.user, type: 'addOrders' };
    }
  };

  deleteOrders = async () => {
    let modified = await deleteOrders(this.user, this.userOrders, this.aliasOrders);

    if (modified) {
      const userOrders = await Orders.find({ d_id: this.user.d_id });
      this.userOrders = userOrders[0];
    }
  };

  syncOrders = async () => {
    let syncOrdersRes = await syncOrders(this.user, this.userOrders, this.aliasOrders);

    if (syncOrdersRes) {
      return { data: syncOrdersRes, user: this.user, type: 'syncOrders' };
    }
  };

  confirmOrders = async () => {
    let confirmOrdersRes = await confirmOrders(this.client, this.loginToken, this.user, this.userOrders);

    if (confirmOrdersRes) {
      const userOrders = await Orders.find({ d_id: this.user.d_id });
      this.userOrders = userOrders[0];

      return { data: confirmOrdersRes, user: this.user, type: 'confirmOrders' };
    }
  };

  genShipping = async () => {
    let genShippingRes = await genShipping(this.client, this.loginToken, this.user, this.userOrders);

    if (genShippingRes) {
      const userOrders = await Orders.find({ d_id: this.user.d_id });
      this.userOrders = userOrders[0];

      return { data: genShippingRes, user: this.user, type: 'genShipping' };
    }
  };

  earnings = async () => {
    let earningsRes = await earnings(this.client, this.user, this.loginToken);

    if (earningsRes) {
      return { data: earningsRes, user: this.user, type: 'earnings' };
    }
  };
};
