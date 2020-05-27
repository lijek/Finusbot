exports.handle = async (msg, client) => {
  if (!msg.content.startsWith("+")) return;
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