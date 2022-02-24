import { Assignment, ButtonType } from "midi-mixer-plugin";
import * as mqtt from "mqtt"
import { MqttClient } from "mqtt";

let client : MqttClient;

let assignments: Assignment[] = [];
let buttons: ButtonType[] = [];

let deviceID = "";
let assignmentCount = "";
let buttonCount = "";

let connectionOptions = {
  clean: true,
  connectTimeout: 4000,
  username: "",
  password: ""
};

let reconnectTimeout: number;

const availabilityTopic = (deviceID:string) => `midi-mixer/${deviceID}/state`;

const sensorDiscoveryTopic = (deviceID:string, sensorName:string) => `homeassistant/sensor/${deviceID}/${sensorName}/config`;
const lightDiscoveryTopic = (deviceID:string, lightName:string) => `homeassistant/light/${deviceID}/${lightName}/config`;
const buttonTriggerDiscoveryTopic = (deviceID:string, binarySensorName:string) => `homeassistant/device_automation/${deviceID}/${binarySensorName}/config`;

const stateTopic = (deviceID:string, name:string) => `midi-mixer/${deviceID}/${name}`
const commandTopic = (deviceID:string, name:string) => `midi-mixer/${deviceID}/${name}/set`


const FaderHAConfig = (deviceID:string, faderName:string) => `
{
  "availability": [
    {
      "topic": "${availabilityTopic(deviceID)}"
    }
  ],
  "device": {
    "identifiers": [
      "${deviceID}"
    ],
    "name": "${deviceID}"
  },
  "name": "${deviceID + " " + faderName}",
  "state_topic": "${stateTopic(deviceID, faderName)}",
  "unique_id": "${deviceID+faderName}"
}`;

const ButtonHAConfig = (deviceID:string, buttonName:string) => `
{
  "automation_type": "trigger",
  "topic": "${stateTopic(deviceID, buttonName)}",
  "type": "button_short_press",
  "subtype": "${buttonName}",
  "device": {
    "identifiers": [
      "${deviceID}"
    ],
    "name": "${deviceID}"
  }
}`;

const LightHAConfig = (deviceID:string, lightName:string) => `
{
  "availability": [
    {
      "topic": "${availabilityTopic(deviceID)}"
    }
  ],
  "device": {
    "identifiers": [
      "${deviceID}"
    ],
    "name": "${deviceID}"
  },
  "name": "${deviceID + " " + lightName}",
  "command_topic": "${commandTopic(deviceID, lightName)}",
  "state_topic": "${stateTopic(deviceID, lightName)}",
  "unique_id": "${deviceID+lightName}"
}`;

const DimmableLightHAConfig = (deviceID:string, lightName:string) => `
{
  "availability": [
    {
      "topic": "${availabilityTopic(deviceID)}"
    }
  ],
  "device": {
    "identifiers": [
      "${deviceID}"
    ],
    "name": "${deviceID}"
  },
  "name": "${deviceID + " " + lightName}",
  "command_topic": "${commandTopic(deviceID, lightName)}",
  "brightness_command_topic": "${commandTopic(deviceID, lightName)}",
  "state_topic": "${stateTopic(deviceID, lightName)}",
  "unique_id": "${deviceID+lightName}"
}`;


$MM.onClose(async () => {
  clearTimeout(reconnectTimeout);
  updateAvailabilityTopic(false);
  client.end();
});

function PublishHADiscovery(deviceID:string, assignmentCount:number, buttonCount:number) {
  console.log("Publishing Home Assistant Discovery...");
  for(let i = 0; i < assignmentCount; i++)
  {
    let faderName = "Fader" + i;
    

    assignments[i] = new Assignment(faderName, {
      name: "MQTT " + faderName,
    });

    assignments[i].on("volumeChanged", (level: number) => {
      client.publish(stateTopic(deviceID, faderName), (level * 255).toString());
    });

    assignments[i].on("mutePressed", () => {
      client.publish(stateTopic(deviceID, faderName + "MuteButton"), "trigger");
    });

    assignments[i].on("assignPressed", () => {
      client.publish(stateTopic(deviceID, faderName + "AssignButton"), "trigger");
    });

    //Fader
    client.publish(sensorDiscoveryTopic(deviceID, faderName), FaderHAConfig(deviceID, faderName));

    //Buttons
    client.publish(buttonTriggerDiscoveryTopic(deviceID, faderName + "MuteButton"), ButtonHAConfig(deviceID, faderName + "MuteButton")); //Mute Button
    client.publish(buttonTriggerDiscoveryTopic(deviceID, faderName + "AssignButton"), ButtonHAConfig(deviceID, faderName + "AssignButton")); //Assign Button

    //Indicators
    client.publish(lightDiscoveryTopic(deviceID, faderName + "MuteIndicator"), LightHAConfig(deviceID, faderName + "MuteIndicator")); //Mute Indicator
    client.publish(lightDiscoveryTopic(deviceID, faderName + "AssignIndicator"), LightHAConfig(deviceID, faderName + "AssignIndicator")); //Assign Indicator
    client.publish(lightDiscoveryTopic(deviceID, faderName + "PeakIndicator"), DimmableLightHAConfig(deviceID, faderName + "PeakIndicator")); //Peak Indicator
    client.publish(lightDiscoveryTopic(deviceID, faderName + "VolumeIndicator"), DimmableLightHAConfig(deviceID, faderName + "VolumeIndicator")); //Volume Indicator

    //subscribe to topics
    client.subscribe(commandTopic(deviceID, faderName + "MuteIndicator"), function (err) {if(err) console.log(err)}); //Mute Indicator subscription
    client.subscribe(commandTopic(deviceID, faderName + "AssignIndicator"), function (err) {if(err) console.log(err)}); //Assign Indicator subscription
    client.subscribe(commandTopic(deviceID, faderName + "PeakIndicator"), function (err) {if(err) console.log(err)}); //Peak Indicator subscription
    client.subscribe(commandTopic(deviceID, faderName + "VolumeIndicator"), function (err) {if(err) console.log(err)}); //Volume Indicator subscription
  }

  for(let i = 0; i < buttonCount; i++)
  {
    let buttonName = "Button" + i;
    client.publish(buttonTriggerDiscoveryTopic(deviceID, buttonName), ButtonHAConfig(deviceID, buttonName));

    buttons[i] = new ButtonType(buttonName, {
      name: "MQTT " + buttonName,
    });

    buttons[i].on("pressed", () => {
      client.publish(stateTopic(deviceID, buttonName), "trigger");
    });
  }

}

const ClearHADevices = async ()  => {
  console.log("Clearing Home Assistant Discovery...");
  for(let i = 0; i < parseInt(assignmentCount, 10); i++)
  {
    let faderName = "Fader" + i;
    client.publish(sensorDiscoveryTopic(deviceID, faderName), "");

    //Buttons
    client.publish(buttonTriggerDiscoveryTopic(deviceID, faderName + "MuteButton"), ""); //Mute Button
    client.publish(buttonTriggerDiscoveryTopic(deviceID, faderName + "AssignButton"), ""); //Assign Button

    //Indicators
    client.publish(lightDiscoveryTopic(deviceID, faderName + "MuteIndicator"), ""); //Mute Indicator
    client.publish(lightDiscoveryTopic(deviceID, faderName + "AssignIndicator"), ""); //Assign Indicator
    client.publish(lightDiscoveryTopic(deviceID, faderName + "PeakIndicator"), ""); //Peak Indicator
    client.publish(lightDiscoveryTopic(deviceID, faderName + "VolumeIndicator"), ""); //Volume Indicator
  }

  for(let i = 0; i < parseInt(buttonCount, 10); i++)
  {
    let buttonName = "Button" + i;
    client.publish(buttonTriggerDiscoveryTopic(deviceID, buttonName), "");
  }
}

function handleIncommingMessage(topic: string, message:string) {
  if(topic.includes("Fader"))
  {
    client.publish(stateTopic(deviceID, topic.split("/")[2]), message);

    let shortTopic = topic.split("/")[2].replace("Fader", "");

    if(shortTopic.includes("MuteIndicator"))
    {
      let faderID = parseInt(shortTopic .replace("MuteIndicator", ""), 10);
      assignments[faderID].muted = (message == "ON");
    }
    else if(shortTopic.includes("AssignIndicator"))
    {
      let faderID = parseInt(shortTopic .replace("AssignIndicator", ""), 10);
      assignments[faderID].assigned = (message == "ON");
    }
    else if(shortTopic.includes("PeakIndicator"))
    {
      let faderID = parseInt(shortTopic .replace("PeakIndicator", ""), 10);

      if (message == "ON") 
      {
        if(assignments[faderID].meter == 0)
          assignments[faderID].meter = 1;
      }
      else if(message == "OFF")
        assignments[faderID].meter = 0;
      else
        assignments[faderID].meter = (parseInt(message, 10)/255.0);
    }
    else if(shortTopic.includes("VolumeIndicator"))
    {
      let faderID = parseInt(shortTopic .replace("VolumeIndicator", ""), 10);

      if (message == "ON") 
      {
        if(assignments[faderID].volume == 0)
          assignments[faderID].volume = 1;
      }
      else if(message == "OFF")
        assignments[faderID].volume = 0;
      else
        assignments[faderID].volume = (parseInt(message, 10)/255.0);
    }
  }
}

function updateAvailabilityTopic(online:boolean) {
  if(online) {
    client.publish(availabilityTopic(deviceID), "online");
  }
  else {
    client.publish(availabilityTopic(deviceID), "offline");
  }
}

const reconnect = async () => {
  client.reconnect();
}

const connect = async () => {
  $MM.setSettingsStatus("status", "Getting plugin settings...");

  const settings = await $MM.getSettings();

  const host = settings.host as string;
  const user = settings.user as string;
  const password = settings.password as string;
  const HADiscovery = settings.HADiscovery as string;
  assignmentCount = settings.assignmentCount as string;
  buttonCount = settings.buttonCount as string;
  deviceID = settings.deviceID as string;

  if(!deviceID) deviceID = "midi-mixer";

  connectionOptions.username = user;
  connectionOptions.password = password;

  $MM.setSettingsStatus("status", "Connecting...");
  client = mqtt.connect(host, connectionOptions);

  client.on('connect', function () {
    $MM.setSettingsStatus("status", "Connected")
    if (!HADiscovery) PublishHADiscovery(deviceID, parseInt(assignmentCount, 10), parseInt(buttonCount, 10));
    updateAvailabilityTopic(true);
    clearTimeout(reconnectTimeout);
  });

  client.on('message', function (topic, message) {
    handleIncommingMessage(topic, message);
  })

  client.on('reconnect', function () {
    clearTimeout(reconnectTimeout);
  });

  client.on('error', (err) => {
    console.log('error', err);
    log.error(err);

    switch (err.name) {
      case "ECONNREFUSED":
        $MM.setSettingsStatus("status", "Connection Refused");
        break;

      case "EADDRINUSE":
        $MM.setSettingsStatus("status", "Address In Use");
        break;

      case "ECONNRESET":
        $MM.setSettingsStatus("status", "Connection Error. Reconnecting...");
        reconnectTimeout = setInterval(reconnect, 5000);
        break;

      case "ENOTFOUND":
        $MM.setSettingsStatus("status", "Connection Error. Reconnecting...");
        reconnectTimeout = setInterval(reconnect, 5000);
        break;
    }
  });
};

connect();

$MM.onSettingsButtonPress("resetHA", ClearHADevices);