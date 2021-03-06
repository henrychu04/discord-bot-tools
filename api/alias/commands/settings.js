const Discord = require('discord.js');
const settings = require('../../requests/settings.js');

const response = {
  SUCCESS: 'success',
  NO_ITEMS: 'no_items',
  NO_CHANGE: 'no_change',
  EXIT: 'exit',
  TIMEOUT: 'timeout',
  ERROR: 'error',
};

module.exports = async (edit, user, message) => {
  let returnObj = {
    returnedEnum: null,
    userSettings: null,
  };

  const userSettings = new Discord.MessageEmbed()
    .setColor('#7756fe')
    .setTitle('alias Settings')
    .addFields(
      {
        name: 'Order Confirmation Refresh Rate:',
        value: user.settings.orderRefresh == 'live' ? 'Live' : 'Daily',
      },
      {
        name: 'Default Listing Update Rate:',
        value: user.settings.adjustListing == 'live' ? 'Live' : 'Manual',
      },
      {
        name: 'Max price adjustment range for live listings:',
        value: user.settings.maxAdjust,
      },
      {
        name: 'Manual Listing Notifications:',
        value: user.settings.manualNotif ? 'On' : 'Off',
      }
    );

  if (!edit) {
    returnObj.returnedEnum = response.SUCCESS;
    returnObj.userSettings = userSettings;
    return returnObj;
  } else {
    let returnedEnum = null;
    let stopped = false;

    await message.channel.send(userSettings).catch((err) => {
      throw new Error(err);
    });

    await message.channel.send(
      '```' +
        `0. Order confirmation refresh rate\n1. Default listing update rate\n2. Max price adjustment range for live listings\n3. Specified listing update rate\n4. Manual Listing Notifications\n\nEnter '0', '1', '2', '3', or '4' to edit\nEnter 'n' to cancel` +
        '```'
    );

    const collector = message.channel.createMessageCollector((msg) => msg.author.id == message.author.id, {
      time: 30000,
    });

    for await (const msg of collector) {
      let input = msg.content.toLowerCase();

      if (input == 0) {
        collector.stop();
        stopped = true;
        returnedEnum = await settings.editOrderRate(msg, user);
      } else if (input == 1) {
        collector.stop();
        stopped = true;
        returnedEnum = await settings.editDefaultListingRate(msg, user);
      } else if (input == 2) {
        collector.stop();
        stopped = true;
        returnedEnum = await settings.editMaxRange(msg, user);
      } else if (input == 3) {
        collector.stop();
        stopped = true;
        returnedEnum = await settings.editSpecifiedListingRate(msg, user);
      } else if (input == 4) {
        collector.stop();
        stopped = true;
        returnedEnum = await settings.editManualNotif(msg, user);
      } else if (input == 'n') {
        collector.stop();
        stopped = true;
        exit = true;
        returnedEnum = response.EXIT;
      } else {
        await msg.channel.send('```' + `Enter either '0', '1', '2', '3', or '4'` + '```');
      }
    }

    if (!stopped) {
      returnObj.returnedEnum = response.TIMEOUT;
      return returnObj;
    } else {
      returnObj.returnedEnum = returnedEnum;
      return returnObj;
    }
  }
};
