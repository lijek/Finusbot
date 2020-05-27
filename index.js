const Discord = require('discord.js');
const fs = require('fs');
const watch = require('node-watch');
const Jimp = require('jimp');
const webp = require('webp-converter');
const client = new Discord.Client();
let config = require("./config.json");
let commandhandler = require("./commandhandler.js");
let util = require('./util.js');
client.Discord = Discord;
client.fs = fs;
client.Jimp = Jimp;
client.webp = webp;
client.config = config;
client.util = util;
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.textarty = new Discord.Collection();
client.cooldowns = new Discord.Collection();

const time = () => {
  const data = new Date();
  return czas = ((data.getHours() > 9) && data.getHours() || ("0" + data.getHours())) + ":"
    + ((data.getMinutes() > 9) && data.getMinutes() || ("0" + data.getMinutes())) + ":"
    + ((data.getSeconds() > 9) && data.getSeconds() || ("0" + data.getSeconds()));
}

const log = message => {
  process.stdout.write(`[${time()}] ${message}\n`);
};
client.log = log;

const reprint = message => {
  //process.stdout.clearLine();
  //process.stdout.cursorTo(0);
  process.stdout.write(`\r\x1b[K[${time()}] ${message}\n`);
}

// ładowanie komend

fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  log(`Loading a total of ${files.length} commands.`);
  files.forEach((f, i) => {
    const cmd = f.split('.').shift();
    if (f.split('.').pop() != 'js') return;
    let props = require(`./commands/${f}`);
    client.commands.set(cmd, props);
    //log(`Command Loaded! ${cmd}`);
    reprint(`Ładowanie ${files.length} komend. ${i + 1}/${files.length} załadowano.`);
  });
});

//ładowanie textartów

fs.readdir('./textarty/', (err, files) => {
  if (err) console.error(err);
  log(`Ładowanie ${files.length} textartów.`);
  var i = 0;
  for (const f in files) {
    fs.readFile(`./textarty/${files[f]}`, "utf-8", (err, data) => {
      if (err) console.error(err);
      client.textarty.set(files[f].split(".").shift(), data);
    });
    //log(`Textart załadowano! ${files[f].split(".").shift()}`);
    reprint(`Ładowanie ${files.length} textartów. ${i + 1}/${files.length} załadowano.`);
    i++;
  }
});

//przeładowywanie komend

watch('./commands/', (event, f) => {
  try {
    if (f.split('.').pop() != 'js') return;
    f = f.split('\\').pop();
    const cmd = f.split('.').shift();
    if (event == 'remove') {
      delete require.cache[require.resolve(`./commands/${f}`)];
      client.commands.delete(cmd);
      log(`Pomyślnie usunięto plik komendy ${cmd}!`);
    } else if (client.commands.has(cmd)) {
      delete require.cache[require.resolve(`./commands/${f}`)];
      client.commands.delete(cmd);
      let props = require(`./commands/${f}`);
      client.commands.set(cmd, props);
      log(`Przeładowano komendę ${cmd} pomyślnie!`);
    } else {
      let props = require(`./commands/${f}`);
      if (props.run && props.help) {
        client.commands.set(cmd, props);
        log(`Załadowano komendę ${cmd} pomyślnie!`);
      } else {
        delete require.cache[require.resolve(`./commands/${f}`)];
        log(`Nie udało się załadować komendy ${cmd}!`);
      }
    }
  } catch (e) {
    console.error(e);
  }
});

watch('./commandhandler.js', (e, f) => {
  delete require.cache[require.resolve(`./${f}`)];
  commandhandler = require(`./commandhandler.js`);
  log(`Przeładowano commandhandler!`);
});

watch('./util.js', (e, f) => {
  delete require.cache[require.resolve(`./${f}`)];
  client.util = require(`./util.js`);
  client.util.init(client);
  log(`Przeładowano użyteczny plik!`);
});

watch('./config.json', (e, f) => {
  delete require.cache[require.resolve(`./config.json`)];
  config = require('./config.json');
  client.config = config;
  log(`Przeładowano config!`);
});

client.on('ready', () => {
  log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("+pomoc");
});

client.on('message', msg => {
  try {
    commandhandler.handle(msg, client);
  } catch (e) {
    log(e.toString());
  }
});

client.login(config.token);
