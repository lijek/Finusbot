var webp, jimp, Discord;

exports.setData = (key, val, obj) => {
  var ka = key.split(/\./); //split the key by the dots
  if (ka.length < 2) {
    obj[ka[0]] = val; //only one part (no dots) in key, just set value
  } else {
    if (!obj[ka[0]]) obj[ka[0]] = {}; //create our "new" base obj if it doesn't exist
    obj = obj[ka.shift()]; //remove the new "base" obj from string array, and hold actual object for recursive call
    setData(ka.join("."), val, obj); //join the remaining parts back up with dots, and recursively set data on our new "base" obj
  }
}


/** 
 * @param {string} key key for object
 * @param {Object} obj target object
 * @param {any} val value to set or value to return if it doesn't exist
 * @param {boolean} set flag
 */
exports.getOrSetData = (key, obj, val, set) => {
  var ka = key.split(/\./); //split the key by the dots
  if (set) {
    if (ka.length < 2) {
      obj[ka[0]] = val; //only one part (no dots) in key, just set value
    } else {
      if (!obj[ka[0]]) obj[ka[0]] = {}; //create our "new" base obj if it doesn't exist
      obj = obj[ka.shift()]; //remove the new "base" obj from string array, and hold actual object for recursive call
      this.getOrSetData(ka.join("."), obj, val, true); //join the remaining parts back up with dots, and recursively set data on our new "base" obj
    }
  } else {
    var key = ka.shift();
    if (typeof obj[key] != "undefined") {
      if (ka.length < 1) {
        return obj[key];
      } else {
        obj = obj[key];
        return this.getOrSetData(ka.join("."), obj, val);
      }
    } else {
      return val;
    }
  }
}

exports.init = async function (client) {
  webp = client.webp;
  jimp = client.jimp;
  Discord = client.Discord;
}

async function process(client, url, msg, process) {
  await client.Jimp.read(url)
    .then(image => {
      var filename = './temp/' + msg.channel.id + '/' + msg.id + '.' + url.split('.').pop();
      process(image);
      image.write(filename);
      msg.channel.send("", {
        files: [filename]
      });
      if (client.config.images.delete) {
        setTimeout(() => {
          client.fs.unlink(filename, (err) => {
            if (err) client.log(err);
          });
        }, client.config.images.timeout);
      }
      return true;
    })
    .catch(err => {
      client.log(err);
      return false;
    });
}

exports.image = (client, msg, args, cmd) => {
  var ok = false;
  var attachment = msg.attachments.array()[0];
  var process1 = cmd.process;
  if (typeof args[0] != 'undefined') {
    if (args[0].match(/\.(jpeg|jpg|gif|png)$/) != null) {
      ok = process(client, args[0], msg, process1);
      return;
    }
  } else if (typeof attachment !== "undefined" && attachment.url.match(/\.(jpeg|jpg|gif|png)$/)) {
    ok = process(client, attachment.url, msg, process1);
    return;
  } else {
    msg.channel.messages.fetch({
      limit: 10
    })
      .then(messages => {
        messages = messages.array();
        for (var i = 0; i < messages.length; i++) {
          var message = messages[i];
          var attachment = message.attachments.array()[0];
          if (typeof attachment !== "undefined" && attachment.url.match(/\.(jpeg|jpg|gif|png)$/) != null) {
            ok = process(client, attachment.url, message, process1);
            break;
          } else if (message.content.match(/\.(jpeg|jpg|gif|png)$/) != null) {
            ok = process(client, message.content.trim(), message, process1);
            break;
          }
        }
        if (!ok)
          msg.reply('Nie znaleziono obrazka w url lub 10 ostatnich wiadomościach.');
      }).catch(client.log);
  }
}

exports.avatar = (client, msg, url) => {
  webp.dwebp(url, `./${msg.channel.id}/${msg.id}.jpg`, "-o", function (status, error) {
    return `./${msg.channel.id}/${msg.id}.jpg`
    console.log(status, error);
  });
}

exports.kolor = (r = 0, g = 0, b = 0) => {
  return `\x1b[38;2;${r};${g};${b}m`;
}

exports.kolor = (r = 0, g = 0, b = 0, background = false) => {
  return background ? `\x1b[48;2;${r};${g};${b}m` : `\x1b[38;2;${r};${g};${b}m`;
}

//exports.reset = "\x1b[0m";
exports.reset = function (isCommand = false) {
  return isCommand ? '\x1b[0m\x1b[32m' : "\x1b[0m"
}

exports.componentToHex = (c) => {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

exports.rgbToHex = (r, g, b) => {
  return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
}

exports.hexToRgb = (hex) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

exports.hexToEscape = (hex) => {
  const rgb = this.hexToRgb(hex);
  return this.kolor(rgb.r, rgb.g, rgb.b);
}