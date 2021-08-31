// I wanted to use this as simple clickable text gui for the bot, but unfortunately node-watch doesn't work in WSL

const blessed = require('blessed');
const contrib = require('blessed-contrib');
const chalk = require('chalk');
const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

var screen = blessed.screen();

var servers = contrib.tree({
  parent: screen,
  top: 0,
  left: 0,
  //top: '80%',
  //left: 'center',
  width: '30%',
  height: '100%',
  border: {
    type: 'line',
    fg: 'white'
  },
  label: "Serwery",
  mouse: true,
  clickable: true,
  /* scrollable: true,
  scrollbar: {
    bg: 'gray'
  }, */
  template: {
    extend: '[' + chalk.greenBright('+') + ']',
    retract: '[' + chalk.red('-') + ']',
    lines: true
  }
});

var logs = blessed.box({
  parent: screen,
  top: 0,
  left: '30%',
  width: '70%',
  height: '70%',
  border: {
    type: 'line',
    fg: 'white'
  },
  style: {
    fg: 'white',
    bg: 'black'
  },
  label: "Logi",
  mouse: true,
  clickable: true,
  scrollable: true,
  scrollbar: {
    bg: 'gray'
  }
});

var input = blessed.textarea({
  parent: screen,
  top: '70%',
  left: '30%',
  width: '70%',
  height: '30%',
  border: {
    type: 'line',
    fg: 'white'
  },
  style: {
    fg: 'white',
    bg: 'black'
  },
  mouse: true,
  clickable: true,
  inputOnFocus: true
});

let data1 = {
  extended: true,
  children: {
    Server1: {
      name: 'Server1',
      children: {
        Channel1: {},
        'Channel2': {},
        'Channel3': {}
      }
    },
    'Server2': {
      name: 'Server2',
      children: {
        'Channel1': {},
        'Channel2': {},
        'Channel3': {}
      }
    },
    'Server3': {
      name: 'Server3',
      children: {
        'Channel1': {},
        'Channel2': {},
        'Channel3': {}
      }
    }
  }
}

servers.setData(data1);

screen.render();

servers.rows.on('action', (item, index) => {
  var selectedNode = servers.nodeLines[index];
  if (typeof selectedNode.children != 'undefined') {
    //log(typeof selectedNode.children);
    selectedNode.extended = !selectedNode.extended;
    servers.setData(servers.data);
    servers.screen.render();
  }

  servers.emit('select', selectedNode, index);
});

servers.addListener('select', (node) => {
  if (node.permissions && node.permissions.browse) {
    log('WYBRANO: ' + node.type + ' z ID: ' + node.id);
    screen.render();
  }
});

client.on('ready', () => {
  client.user.setStatus('invisible');
  log('bot sie zalogowal');
  /* let data = {
    exteded: true,
    children: client.guilds.cache.forEach(guild => {
      return {
        name: guild.name,
        children: guild.channels.cache.forEach(channel => {
          return {
            name: channel.name
          }
        })
      }
    })
  } */
  let data = {
    name: "/",
    extended: true,
    children: function (self) {
      var result = {};

      client.guilds.cache.forEach(guild => {
        result[guild.name] = {
          name: guild.name,
          extended: true,
          type: 'server',
          id: guild.id,
          children: function (self) {
            var channels = {};
            guild.channels.cache.forEach(channel => {
              if (channel.type == "category")
                return;
              const browse = channel.permissionsFor(guild.client.user).has('VIEW_CHANNEL');
              const send = channel.permissionsFor(guild.client.user).has('SEND_MESSAGES');
              channels[channel.name] = {
                type: 'channel',
                id: guild.id,
                permissions: {
                  browse: browse,
                  send: send
                },
                name: function () {
                  var name = channel.name;
                  switch (channel.type) {
                    case 'text':
                      name = '#' + name;
                      break;
                    case 'voice':
                      name = '<))' + name;
                      break;
                    case 'news':
                      name = '!!' + name;
                      break;
                    case 'store':
                      name = '$' + name;
                      break;
                  }

                  if (browse && send)
                    return name;
                  else if (browse)
                    return chalk.redBright(name);
                  else
                    return chalk.strikethrough(chalk.redBright(name));
                }()
              }
            });
            return channels;
          }
        }
      });
      return result;
    }
  }
  //console.log(data);
  //console.log(JSON.stringify(data));
  servers.setData(data);

  screen.render();
});

client.on('message', (message) => {
  log(chalk.bold(message.guild.name + "#" + message.channel.name) + " @" + message.author.username + ":" + message.content);
  screen.render();
});

screen.key('q', function () {
  client.destroy();
  process.exit(0);
});

function log(message) {
  logs.insertBottom(message);
  logs.setScrollPerc(100);
  screen.render();
}

client.login(config.token);