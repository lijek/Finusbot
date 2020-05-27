var webp, jimp, Discord;

exports.init = async function(client){
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
      msg.channel.send("", { files: [filename] });
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
    msg.channel.messages.fetch({ limit: 10 })
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
  webp.dwebp(url,`./${msg.channel.id}/${msg.id}.jpg`,"-o",function(status,error)
  {
    return `./${msg.channel.id}/${msg.id}.jpg`
  	console.log(status,error);	
  });
}