var value = 255;

exports.process = async function(image){
  await image.color([{apply:'blue', params: [0]}, {apply:'red', params: [0]}, {apply:'green', params: [value]}]);
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
  name: "green",
  description: "Komenda szuka ostatniego obrazka w ostatnich dziesięciu"
    + " wiadomościach na danym kanale, robi ten obrazek **z i e l o n y**.",
  usage: "Prawidłowe użycie:\n"
    + "+green `<url - opcjonalnie jak nie ma obrazka wyżej jako linka do obrazka lub w postaci adnotacji>`"
}