import easymidi from "easymidi";

console.log("MIDI inputs:");
console.log(easymidi.getInputs());

console.log("MIDI outputs:");
console.log(easymidi.getOutputs());

// Monitor all MIDI inputs with a single "message" listener
easymidi.getInputs().forEach((inputName) => {
  var input = new easymidi.Input(inputName);
  input.on("cc", (msg) => {
    var vals = Object.keys(msg).map(function (key) {
      return key + ": " + msg[key];
    });
    console.log(inputName + ": " + vals.join(", "));
  });
});
