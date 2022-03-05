# MQTT Plugin

A plugin built to enable MQTT comunication for controlling Home Assistant/other smart home devices.

Full Documentation can be found on the wiki at [https://github.com/Theo428/midi-mixer-mqtt/wiki](https://github.com/Theo428/midi-mixer-mqtt/wiki)

## Getting Started 

0. I am assuming that you already have an MQTT broker setup if not instructions for setting it up in Home Assistant can be found [here](https://github.com/home-assistant/addons/blob/master/mosquitto/DOCS.md).
1. Install the plugin with the latest release from the [releases](https://github.com/Theo428/midi-mixer-mqtt/releases) page on github.
2. Fill in the [settings](#settings) page in midi-mixer
3. Start the plugin and hope for the best.
4. Configure Home Assistant or other MQTT home automation service you want to use.

## Settings

#### Broker URL:Port
This is the ip/url and port of the MQTT broker that you are using. Be sure to include the `mqtt://` in the beginning to ensure it finds the host.

#### Broker Username
The username of the MQTT broker that you want to use. (If there is no authentication presumably you can leave this blank but I haven't tested it yet.)

#### Broker Password
The password for the MQTT broker that you want to use. (If there is no authentication presumably you can leave this blank but I haven't tested it yet.)

#### Diable Home Assistant Discovery
Enabling this will stop the plugin from sending out the Home Assistant auto-discovery config if you would prefer to [maunally confiure](#mqtt-topics) it or are not using home assistant.

#### Device ID
This is a unique identifier that will be used to idetify different devices if there are multiple on the network. (defaults to `midi-mixer` if left blank)

#### Number of Groups to Create
This is the number of groups that the plugin will create to prevent from clogging the group list too badly.

#### Number of Buttons to Create
This is the number of buttons that the plugin will create to prevent from clogging the button list too badly. (WIP)

#### Remove All Home Assistant Devices
This button will set all entity configurations to NULL thus removing the device and all entities from home assistant. Be Careful!
