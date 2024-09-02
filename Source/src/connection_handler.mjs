import { Client, ITEMS_HANDLING_FLAGS } from "https://unpkg.com/archipelago.js@1.0.0/dist/archipelago.js";

const client = new Client();

// Set up the connection information.
export const connectionInfo = {
  hostname: "archipelago.gg", // Replace with the actual AP server hostname.
  port: 0, // Replace with the actual AP server port.
  game: "Melvor Idle", // Replace with the game name for this player.
  name: "Player1", // Replace with the player slot name.
  password: "",
  version: {
    major: 0, 
    minor: 5, 
    build: 0
  },
  items_handling: ITEMS_HANDLING_FLAGS.REMOTE_ALL
};

export function setupSettings(ctx){
    const apConnection = ctx.settings.section('Connection');

    apConnection.add({
      type: 'text',
      name: 'ap-hostname',
      label: 'Host name',
      hint: 'Host name of the AP world, for example archipelago.gg',
      default: "archipelago.gg"
    });

    apConnection.add({
      type: 'number',
      name: 'ap-port',
      label: 'Port',
      hint: 'Port of the AP world.',
      default: 0
    });
  
    apConnection.add({
      type: 'text',
      name: 'ap-slotname',
      label: 'Slot name',
      hint: 'Slot name of the player, for example Player1',
      default: "Player1"
    });
  
    apConnection.add({
      type: 'text',
      name: 'ap-password',
      label: 'Password',
      hint: 'Password of the AP room',
      default: ""
    });
  
    const sidebarApStatus = sidebar.category('AP', {
      before: "Combat",
      ignoreToggle: true 
    }, (greetings) => 
      {
      greetings.item('Not Connected');
    });
}

export function setConnectionInfo(ctx){
  const apConnectionInfo = ctx.settings.section('Connection')

  connectionInfo.hostname = apConnectionInfo.get('ap-hostname');
  connectionInfo.port = Number(apConnectionInfo.get('ap-port'));
  connectionInfo.password = apConnectionInfo.get('ap-password');
  connectionInfo.name = apConnectionInfo.get('ap-slotname')
}

export function ConnectToAP(ctx){
  console.log("Trying to connect to " + connectionInfo.hostname + ":" + String(connectionInfo.port));

  client
  .connect(connectionInfo)
  .then(() => {
    console.log("Connected to the server as player " + connectionInfo.name);
    console.log("Exp Gain: " + client.data.slotData.exp_gain);
  })
  .catch((error) => {
    console.error("Failed to connect:", error);
    // Handle the connection error.
  });
}