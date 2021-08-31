const chalk = require("chalk");
const {
  Message,
  Client
} = require("discord.js");

exports.isCommand = false;
/**
 * @param {Message} msg message
 * @param {Client} client bot client
 */
exports.handle = async (msg, client) => {
  //wysyłanie info do konsoli
  if (client.channel != null || client.channel != undefined) {
    if (client.channel.id == msg.channel.id && msg.author.id !== client.user.id) {
      const kolor = client.config.kolorki ? client.util.hexToEscape(msg.member.displayHexColor) : '';
      var prefix = `${kolor}${msg.author.username}${client.util.reset(false)} @ #${msg.channel.name}: `;
      var message = msg.content;
      var occurences = [];

      if (msg.content.startsWith('+')) {
        isCommand = true;
        message = client.util.reset(true) + message;
      }

      //@pingi
      occurences = await message.match(/(<@![0-9]+>)+/g) || [];
      for (var i = 0; i < occurences.length; i++) {
        message = await processPing(occurences[i], message, client, msg.guild);
      }

      occurences = await message.match(/(<@[0-9]+>)+/g) || [];
      for (var i = 0; i < occurences.length; i++) {
        message = await processPing(occurences[i], message, client, msg.guild, sub = 0);
      }

      //#kanały
      occurences = await message.match(/(<#[0-9]+>)+/g) || [];
      for (var i = 0; i < occurences.length; i++) {
        message = await processChannel(occurences[i], message, client, msg.guild);
      }

      //@role
      occurences = await message.match(/(<@&[0-9]+>)+/g) || [];
      for (var i = 0; i < occurences.length; i++) {
        message = await processRole(occurences[i], message, client, msg.guild);
      }

      //pogrubienie
      occurences = await message.match(/\*\*(.*?)\*\*/gmu) || [];
      for (var i = 0; i < occurences.length; i++) {
        message = await processBold(occurences[i], message, client);
      }

      //kursywa
      occurences = await message.match(/\*(.*?)\*/gmu) || [];
      for (var i = 0; i < occurences.length; i++) {
        message = await processItalic(occurences[i], message, client);
      }

      //przekreślenie
      occurences = await message.match(/~~(.*?)~~/gmu) || [];
      for (var i = 0; i < occurences.length; i++) {
        message = await processStrikethrough(occurences[i], message, client);
      }

      //podkreślenie
      occurences = await message.match(/__(.*?)__/gmu) || [];
      for (var i = 0; i < occurences.length; i++) {
        message = await processUnderline(occurences[i], message, client);
      }

      /* if(msg.content.startsWith('+')){
        message = chalk.green() + message//; + message.replace(chalk.reset(), chalk.reset() + chalk.red());
      } */

      if (msg.content.length <= (process.stdout.columns - prefix.length))
        client.log(`${prefix}${message}`);
      else {
        client.log(prefix);
        client.log1(message);
      }
    }
  }

  //wordcounter
  if (!msg.author.bot && !msg.content.startsWith("+")) {
    const words = client.config.wordsToCount;
    const content = msg.content.trim();

    for (var i in words) {
      const word = words[i];
      var count = 0;
      var key;
      var filter;
      if (word.type === "regex") {
        filter = new RegExp(word.filter, word.flags);
        if (!content.match(filter)) {
          continue;
        }
      } else if (word.type === "exact") {
        filter = word.filter
        if (!content.includes(filter)) {
          continue;
        }
      }
      key = `${msg.author.id}.wordCounter.${word.filter}`;
      count = client.util.getOrSetData(key, client.data, 0);
      count = count + (Array.from(content.matchAll(filter) || []).length)
      client.util.getOrSetData(key, client.data, count, true);
      if(!word.reply)
        continue;
      var reply = word.reply;
      const keys = Object.keys(reply).sort();
      for(var j in keys){
        if(keys[j].includes("=")){
          if(count == parseInt(keys[j].replace("=", ""))){
            reply = reply[keys[j]];
            break;
          }
        }else if(keys[j].includes("+")){
          if(count % parseInt(keys[j].replace("+", "")) == 0){
            reply = reply[keys[j]];
            break;
          }
        }
      }

      if(reply.always)
        reply = reply.always;
      if(typeof reply === "object")
        continue;
      reply = reply.replace(/(@ping)+/g, msg.author);
      reply = reply.replace(/(@count)+/g, count);
      msg.channel.send(reply);
    }
  }

  //gównokomendy
  if (!msg.author.bot) {
    const shitcmds = client.config.shitcmds;
    const content = msg.content.toLocaleLowerCase();
    for (var i = 0; i < shitcmds.length; i++) {
      let shitcmd = shitcmds[i];
      if (shitcmd.disabled)
        continue;
      if (shitcmd.type == "exact") {
        if (!content.includes(shitcmd.filter))
          continue;
      } else if (shitcmd.type == "regex") {
        if (!content.match(new RegExp(shitcmd.filter, shitcmd.flags)))
          continue;
      }

      let messageOptions = {};

      if (shitcmd.messageOptions != null) {
        messageOptions = shitcmd.messageOptions;
      }

      const reply = shitcmd.reply.replace(/(@ping)+/g, msg.author);
      msg.channel.send(reply, messageOptions);
    }
  }

  //przetwarzanie komend
  if (!msg.content.startsWith("+") || msg.author.bot) {
    return;
  }
  var args = msg.content.substring(1).split(/ +/g);
  var cmd = args.shift().toLocaleLowerCase();
  var hasPermission = false;
  if (eval("client.config.permissions." + cmd)) {
    for (const e of eval("client.config.permissions." + cmd)) {
      if (msg.member.roles.cache.has(e)) {
        hasPermission = true;
        break;
      }
    }
  }
  if (client.commands.has(cmd))
    await client.commands.get(cmd).run(client, msg, args, hasPermission);
}

async function processPing(substring, message, client, guild, sub = 1) {
  const id = substring.substring(2 + sub, substring.length - 1);
  var nick = null;
  nick = await guild.members.fetch(id).then(user => {
    return user.displayName;
  });
  var kolor;
  if (id == client.user.id)
    //kolor = client.util.kolor(166, 160, 0, true) + client.util.kolor(80, 118, 220);
    kolor = client.util.kolor(255, 255, 0, true) + client.util.kolor(80, 118, 220);
  //"\x1b[43m" <= żółty
  else
    //kolor = client.util.kolor(60, 65, 80, true) + client.util.kolor(80, 118, 220);
    kolor = client.util.kolor(80, 118, 220);
  message = message.replace(substring, (client.config.kolorki ? kolor : '') + '@' + nick + client.util.reset(this.isCommand));
  return message;
}

async function processChannel(substring, message, client, guild) {
  const id = substring.substring(2, substring.length - 1);
  var name = null;
  name = await client.channels.fetch(id).then(channel => {
    return channel.name;
  });
  const kolor = client.util.kolor(80, 118, 220); // + client.util.kolor(23, 27, 53, true);
  message = message.replace(substring, (client.config.kolorki ? kolor : '') + '#' + name + client.util.reset(this.isCommand));
  return message;
}

async function processRole(substring, message, client, guild) {
  const id = substring.substring(3, substring.length - 1);
  var role = null;
  role = await guild.roles.fetch(id).then(role => {
    return role;
  });
  var kolor;
  if (await guild.member(client.user).roles.cache.has(id))
    kolor = client.util.kolor(102, 102, 0, true) + client.util.hexToEscape(role.hexColor);
  else
    kolor = client.util.hexToEscape(role.hexColor);
  message = message.replace(substring, (client.config.kolorki ? kolor : '') + '@' + role.name + client.util.reset(this.isCommand));
  return message;
}

async function processBold(substring, message, client) {
  const text = substring.substring(2, substring.length - 2);
  message = message.replace(substring, client.chalk.bold(text));
  return message;
}

async function processItalic(substring, message, client) {
  const text = substring.substring(1, substring.length - 1);
  message = message.replace(substring, client.chalk.italic(text));
  return message;
}

async function processStrikethrough(substring, message, client) {
  const text = substring.substring(2, substring.length - 2);
  message = message.replace(substring, client.chalk.strikethrough(text));
  return message;
}

async function processUnderline(substring, message, client) {
  const text = substring.substring(2, substring.length - 2);
  message = message.replace(substring, client.chalk.underline(text));
  return message;
}