const Discord = require('discord.js');

exports.run = async (client, msg, args, hasPermission) => {
    if (isNaN(args[0]) || isNaN(args[1])) {
        const embed = new Discord.MessageEmbed()
        .setTitle('Błędne użycie komendy.')
        .setColor(0xff0000)
        .setDescription(this.help.usage);
        msg.channel.send(embed);
        return;
    }
    var min = Math.ceil(args[0]),
        max = Math.floor(args[1]) + 1;
    if (isNaN(args[2])) {
        msg.reply(Math.floor(Math.random() * (max - min)) + min);
        return;
    }
    var output = "";
    for (var i = 0; i < args[2]; i++) {
        output += (Math.floor(Math.random() * (max - min)) + min) + "\n";
    }
    const embed = new Discord.MessageEmbed()
        .setTitle("Wyjście")
        .setColor(0x00ff00)
        .setDescription("Wylosowano liczby kolejno: \n" + output);
    msg.channel.send(embed);
};

exports.help = {
    name: 'rng',
    description: 'Random number generator.',
    usage: 'Prawidłowe użycie:\n'
            + "`+rng (minimalna liczba) (maksymalna liczba) (ilość losowań - opcjonalne)`\n"
            + "Przykład: `+rng 21 37`"
};