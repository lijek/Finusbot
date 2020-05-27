var value = 0.6;

exports.process = async function(image){
  await image.fisheye({r: value});
}

exports.run = async (client, msg, args, hasPermission) => {
  value = 0.6;
  if(typeof args[0] !== "undefined" && !isNaN(args[0])){
    value = args.shift();
  }
  else if(typeof args[1] !== "undefined" && !isNaN(args[1]))
    value = args[1];
  client.util.image(client, msg, args, this);
}

exports.help = {
  name: "implode",
  description: "Komenda szuka ostatniego obrazka w ostatnich dziesięciu"
    + " wiadomościach na danym kanale, imploduje obrazek.",
  usage: "Prawidłowe użycie:\n"
    + "+implode `<url - opcjonalnie jak nie ma obrazka wyżej jako linka do obrazka lub w postaci adnotacji>`"
}