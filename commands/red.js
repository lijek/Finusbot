var value = 255;

exports.process = async function(image){
  await image.color([{apply:'blue', params: [0]}, {apply:'red', params: [value]}, {apply:'green', params: [0]}]);
}

exports.run = async (client, msg, args, hasPermission) => {
  if(typeof args[0] !== "undefined" && !isNaN(args[0])){
    value = args.shift();
  }
  else if(typeof args[1] !== "undefined" && !isNaN(args[1]))
    value = args[1];
  client.util.image(client, msg, args, this);
}

exports.help = {
  name: "red",
  description: "Komenda szuka ostatniego obrazka w ostatnich dziesięciu"
    + " wiadomościach na danym kanale, robi ten obrazek **c z e r w o n y**.",
  usage: "Prawidłowe użycie:\n"
    + "+red `<url - opcjonalnie jak nie ma obrazka wyżej jako linka do obrazka lub w postaci adnotacji>`"
}