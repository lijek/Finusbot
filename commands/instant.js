const Discord = require('discord.js');

exports.run = async (client, msg, args, hasPermission) => {
    if (!args[0]) {
        var textarty = Array.from(client.textarty.values());
        msg.channel.send(textarty[Math.floor(Math.random() * (textarty.length))]);
    }
    else if (client.textarty.has(args[0]))
        msg.channel.send(client.textarty.get(args[0]));
    else {
        var out = "";
        for(var [key, value] of client.textarty){
            out += `- ${key}\n`;
        }
        const embed = new Discord.MessageEmbed()
            .setTitle("BŁĄD!")
            .setColor(0xff0000)
            .setDescription(this.help.usage + "\nLista wszystkich textartów: \n" + out);
        msg.channel.send(embed);
    }
}

exports.help = {
    name: 'instant',
    description: 'Pokazuje wybrane lub losowe text-arty.',
    usage: 'Prawidłowe użycie:\n'
        + "`+instant` lub `+instant <nazwa textarta>`"
};