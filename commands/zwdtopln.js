const Discord = require('discord.js');

exports.run = async (client, msg, args, hasPermission) => {
  if(typeof args[0] !== "undefined" && !isNaN(args[0]))
    msg.reply(args[0] + " dolarów Zimbabwe to " + (args[0]/client.config.plninzwd) + " złotych.");
  else{
    var embed = new Discord.MessageEmbed()
      .setTitle("Błąd.")
      .setColor(0xff0000)
      .setDescription("Nie podano ilości dolarów Zimbabwe.");
      msg.channel.send(embed)
  }
}

exports.help = {
  name: "zwdtopln",
  description: "Komenda konwertuje dolary Zimabwe na złotówki.",
  usage: "Prawidłowe użycie:\n"
    + "+plntozwd `<ilość dolarów Zimbabwe>`"
}