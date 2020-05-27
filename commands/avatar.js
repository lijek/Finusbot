const Discord = require('discord.js');

exports.run = async (client, msg, args, hasPermission) => {
  if(typeof args[0] !== "undefined"){
    if(typeof msg.mentions.users.first() === "undefined"){
      var embed = new Discord.MessageEmbed()
      .setTitle("Błąd.")
      .setColor(0xff0000)
      .setDescription("Nie wspomniano żadnego użytkownika.");
      msg.channel.send(embed);
      return;
    }
    var user = msg.mentions.users.first();
    var embed = new Discord.MessageEmbed()
     .setAuthor(msg.author.tag)
     .setImage(user.avatarURL())
     .setDescription("Awatar użyszkodnika <@" + user.id + ">");
     msg.channel.send(embed);
  }
  else{
    var embed = new Discord.MessageEmbed()
     .setAuthor(msg.author.tag)
     .setImage(msg.author.avatarURL())
     .setDescription("Awatar użyszkodnika <@" + msg.author.id + ">");
     msg.channel.send(embed);
  }
}

exports.help = {
  name: "avatar",
  description: "Daje linka awatara wspomnianego użytkownika lub zwraca awatar autora wiadomości.",
  usage: "Prawidłowe użycie:\n"
    + "+avatar `<wspomnienie użytkownika>`\n"
    + "+avatar (komenda daje awatar autora wiadomości)"
}