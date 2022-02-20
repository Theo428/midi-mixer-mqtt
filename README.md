# MIDI Mixer Template Plugin

Use this template to quickly create a plugin for MIDI Mixer. It uses [TypeScript](https://www.typescriptlang.org/), [midi-mixer-plugin](https://github.com/midi-mixer/midi-mixer-plugin), and [midi-mixer-cli](https://github.com/midi-mixer/midi-mixer-cli) to interact with MIDI Mixer's API, build, and pack your plugin for distribution.

## Getting started

- Create a repository using this template
- Clone your repository in to `%appdata%/midi-mixer-app/plugins`
- Install Node (I'd recommend [Volta](https://volta.sh/))
- `npm install`
- `npm run build:watch`
- Refresh your MIDI Mixer plugins list

## Distribution

Your plugin can be distributed using `.midiMixerPlugin` files created using [midi-mixer-cli](https://github.com/midi-mixer/midi-mixer-cli). This verifies the shape of your plugin and packages it up so it can be quickly and easily installed by other users.

- `npm version [<newversion> | major | minor | patch]`
- `npm run build`
- `npm run dist`

This will generate a versioned `.midiMixerPlugin` file in the root of your repository (like `com.midi-mixer.template-1.0.0.midiMixerPlugin`) that can be opened by users to install your plugin.

## API

See [midi-mixer-plugin](https://github.com/midi-mixer/midi-mixer-plugin) for API documentation.

## Manifest

A few key items are configurable in your plugin's `plugin.json`. [midi-mixer-plugin](https://github.com/midi-mixer/midi-mixer-plugin) provides a schema for this at `plugin.schema.json`.
