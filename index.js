const Discord = require('discord.js');
const fs = require('fs');
const watch = require('node-watch');
const Jimp = require('jimp');
const webp = require('webp-converter');
const client = new Discord.Client();
const readline = require('readline');
const terminalImage = require('terminal-image');
const terminalLink = require('terminal-link');
const chalk = require('chalk');
let config = require("./config.json");
let data = require('./data.json');
let shitcmd = require("./shitcmd.json");
let commandhandler = require("./commandhandler.js");
let consolecommandhandler = require("./consolecommandhandler.js");
let util = require('./util.js');
client.Discord = Discord;
client.fs = fs;
client.Jimp = Jimp;
client.webp = webp;
client.config = config;
client.shitcmd = shitcmd;
client.data = data;
client.util = util;
client.terminalImage = terminalImage;
client.terminalLink = terminalLink;
client.chalk = chalk;
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.textarty = new Discord.Collection();
client.cooldowns = new Discord.Collection();
client.jp2gmd = null;
client.running = true;
client.watchers = [];
client.channel = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '> '
});

client.rl = rl;

const time = () => {
  const data = new Date();
  return czas = ((data.getHours() > 9) && data.getHours() || ("0" + data.getHours())) + ":"
    + ((data.getMinutes() > 9) && data.getMinutes() || ("0" + data.getMinutes())) + ":"
    + ((data.getSeconds() > 9) && data.getSeconds() || ("0" + data.getSeconds()));
}

const time2 = () => {
  const data = new Date();
  return czas = ((data.getHours() > 9) && data.getHours() || ("0" + data.getHours())) + ":"
    + ((data.getMinutes() > 9) && data.getMinutes() || ("0" + data.getMinutes()))
}

const log = message => {
  const numerlinii = process.stdout.rows + 1;
  readline.cursorTo(process.stdout, 0, numerlinii);
  //console.log(`[${time()}] ${message}\n\x1b[0m`);
  process.stdout.write(`[${time()}] ${message}\n\x1b[0m`);
  rl.prompt();
  return numerlinii;
};

const log1 = message => {
  const numerlinii = process.stdout.rows + 1;
  readline.cursorTo(process.stdout, 0, numerlinii);
  console.log(message);
  process.stdout.write(`\n\x1b[0m`);
  //process.stdout.write(`${message}\n\x1b[0m`);
  rl.prompt();
  return numerlinii;
};

const repairOutput = () => {
  process.stdout.write(`\n\x1b[0m`);
  rl.prompt();
}

const error = (error) => {
  const numerlinii = process.stdout.rows + 1;
  readline.cursorTo(process.stdout, 0, numerlinii);
  console.error(error);
  process.stdout.write(`\n\x1b[0m`);
  rl.prompt();
}

client.log = log;
client.log1 = log1;
client.repairOutput = repairOutput;
client.error = error;

const reprint = (message, numerlinii) => {
  //process.stdout.clearLine();
  //process.stdout.cursorTo(0);
  //process.stdout.write(`\r\x1b[K[${time()}] ${message}\n`);
  readline.cursorTo(process.stdout, 0, numerlinii);
  //process.stdout.write(`[${time()}] ${message}\n`);
  process.stdout.write(`\r\x1b[K[${time()}] ${message}\n`);
  rl.prompt();
}

//ale bezsens XD
const updateTime = () => {
  client.jp2gmd.setName("JP2GMD " + time2());
}

// ładowanie komend

fs.readdir('./commands/', (err, files) => {
  if (err) console.error(err);
  const numerlinii = log(`Loading a total of ${files.length} commands.`);
  files.forEach((f, i) => {
    const cmd = f.split('.').shift();
    if (f.split('.').pop() != 'js') return;
    let props = require(`./commands/${f}`);
    client.commands.set(cmd, props);
    //log(`Command Loaded! ${cmd}`);
    reprint(`Ładowanie ${files.length} komend. ${i + 1}/${files.length} załadowano.`, numerlinii);
  });
});

//ładowanie textartów

fs.readdir('./textarty/', (err, files) => {
  if (err) console.error(err);
  const numerlinii = log(`Ładowanie ${files.length} textartów.`);
  var i = 0;
  for (const f in files) {
    fs.readFile(`./textarty/${files[f]}`, "utf-8", (err, data) => {
      if (err) console.error(err);
      client.textarty.set(files[f].split(".").shift(), data);
    });
    //log(`Textart załadowano! ${files[f].split(".").shift()}`);
    reprint(`Ładowanie ${files.length} textartów. ${i + 1}/${files.length} załadowano.`, numerlinii);
    i++;
  }
});

//przeładowywanie wszystkiego

client.watchers.push(watch('./commands/', (event, f) => {
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
}));

client.watchers.push(watch('./commandhandler.js', (e, f) => {
  try {
    delete require.cache[require.resolve(`./${f}`)];
    commandhandler = require(`./commandhandler.js`);
    log(`Przeładowano command handler!`);
  } catch (e) {
    error(e);
  }
}));

client.watchers.push(watch('./consolecommandhandler.js', (e, f) => {
  try {
    delete require.cache[require.resolve(`./${f}`)];
    consolecommandhandler = require(`./consolecommandhandler.js`);
    log(`Przeładowano console command handler!`);
  } catch (e) {
    error(e);
  }
}));

client.watchers.push(watch('./util.js', (e, f) => {
  try {
    delete require.cache[require.resolve(`./${f}`)];
    client.util = require(`./util.js`);
    client.util.init(client);
    log(`Przeładowano użyteczny plik!`);
  } catch (e) {
    error(e);
  }
}));

client.watchers.push(watch('./config.json', (e, f) => {
  try {
    delete require.cache[require.resolve(`./config.json`)];
    config = require('./config.json');
    client.config = config;
    log(`Przeładowano config!`);
  } catch (e) {
    error(e);
  }
}));

client.watchers.push(watch('./data.json', (e, f) => {
  try {
    delete require.cache[require.resolve(`./data.json`)];
    data = require('./data.json');
    client.data = data;
    log(`Przeładowano dane!`);
  } catch (e) {
    error(e);
  }
}));

client.on('ready', () => {
  log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("+pomoc");
  //client.channels.fetch('364043569536958467').then( channel => { client.jp2gmd = channel})
  //setInterval(updateTime, 10000);
});

client.on('message', msg => {
  try {
    commandhandler.handle(msg, client);
  } catch (e) {
    log(e.toString());
  }
});

//przed wyjściem

function onExit() {
  fs.writeFileSync('./data.json', JSON.stringify(client.data));
  process.exit();
}

/* process.on('exit',              onExit);
process.on('SIGINT',            onExit);
process.on('SIGUSR1',           onExit);
process.on('SIGUSR2',           onExit);
process.on('uncaughtException', onExit); */

client.login(config.token);

rl.prompt();
rl.on('line', command => {
  try {
    consolecommandhandler.processCommand(command.trim(), client);
  } catch (error) {
    log(chalk.red("[ERROR] Error log below:"))
    log1(error);
  }
});