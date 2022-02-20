import { Assignment, ButtonType } from "midi-mixer-plugin";

/**
 * Welcome to the plugin's main file!
 *
 * As defined in your plugin's `plugin.json` file, this is the file that MIDI
 * Mixer will load when the plugin is activated by a user; this is where you
 * will define your plugin's logic.
 *
 * Below are some simple examples for retrieving settings, creating assignments,
 * and creating buttons. The rest is up to you! Have fun!
 */

/**
 * Example of retrieving the plugin's settings.
 */
$MM.getSettings().then((settings) => {
  console.log("Current settings:", settings);
});

/**
 * Example of setting up an assignment to be controlled by the plugin.
 */
const example = new Assignment("foo", {
  name: "Example Plugin Entry",
});

/**
 * Rename the assignment.
 */
example.name = "Example Plugin Entry";

/**
 * Set the assignment's peak meter value to 50% for 150ms.
 */
example.meter = 0.5;

/**
 * Sets the minimum amount of time in milliseconds between volume change updates
 * from MIDI Mixer to 50 milliseconds.
 */
example.throttle = 50;

/**
 * When the user tries to change the volume of the assignment...
 */
example.on("volumeChanged", (level: number) => {
  /**
   * Sets the volume indicator to the new level.
   */
  example.volume = level;
});

/**
 * When the user presses the "mute" button for this assignment...
 */
example.on("mutePressed", () => {
  /**
   * Toggles the "muted" indicator.
   */
  example.muted = !example.muted;
});

/**
 * When the user presses the "assign" button for this assignment...
 */
example.on("assignPressed", () => {
  /**
   * Toggles the "assigned" indicator.
   */
  example.assigned = !example.assigned;
});

/**
 * When the user presses the "run" button for this assignment...
 */
example.on("runPressed", () => {
  /**
   * Toggles the "running" indicator.
   */
  example.running = !example.running;
});

/**
 * Example of setting up a button type to be controlled by the plugin.
 */
const typeExample = new ButtonType("bar", {
  name: "Example Button Type",
});

/**
 * When the user presses the button...
 */
typeExample.on("pressed", () => {
  /**
   * Toggles the button's indicator.
   */
  typeExample.active = !typeExample.active;
});

/**
 * Example of settings buttons and statuses to show the status of the plugin
 * on the settings page.
 *
 * We use the keys defined in the `settings` object of our `package.json` in
 * order to react to UI button presses and set resulting statuses.
 *
 * Using this is great for showing anything from "Connected" statuses to error
 * messages to your end users.
 */
$MM.onSettingsButtonPress("run", () => {
  $MM.setSettingsStatus("status", "Running...");

  setTimeout(() => {
    $MM.setSettingsStatus("status", "Done");
  }, 1000);
});

/**
 * Welcome message and informational links.
 */
console.log(
  `%c███╗   ███╗██╗██████╗ ██╗    ███╗   ███╗██╗██╗  ██╗███████╗██████╗
████╗ ████║██║██╔══██╗██║    ████╗ ████║██║╚██╗██╔╝██╔════╝██╔══██╗
██╔████╔██║██║██║  ██║██║    ██╔████╔██║██║ ╚███╔╝ █████╗  ██████╔╝
██║╚██╔╝██║██║██║  ██║██║    ██║╚██╔╝██║██║ ██╔██╗ ██╔══╝  ██╔══██╗
██║ ╚═╝ ██║██║██████╔╝██║    ██║ ╚═╝ ██║██║██╔╝ ██╗███████╗██║  ██║
╚═╝     ╚═╝╚═╝╚═════╝ ╚═╝    ╚═╝     ╚═╝╚═╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝`,
  "font-family:monospace;color:#4b92b9;"
);

console.log(`Welcome to the debugging tools for a MIDI Mixer plugin.

Here are a few things to try out:

- Watch this console for logs and errors
- Set breakpoints in your code in the "Sources" tab
- Profile memory usage using the "Memory" tab
- Profile CPU usage using the "Profiler" tab`);
