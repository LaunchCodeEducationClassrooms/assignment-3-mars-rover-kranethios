const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
  let message = new Message('Test message with two commands', commands);
  let rover = new Rover(98382);    // Passes 98382 as the rover's position.
  let response = rover.receiveMessage(message);

  it("constructor sets position and default values for mode and generatorWatts", 
  function() {
    let newRover = new Rover(98382);
    expect(newRover.position).toEqual(98382);
    expect(newRover.mode).toEqual("NORMAL");
    expect(newRover.generatorWatts).toEqual(110);
  });

  it("response returned by receiveMessage contains name of message",
  function() {
    expect(response.message).toEqual(message.name);
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    expect(response.commands.length).toEqual(2);
  });

  it("responds correctly to status check command", function() {
    expect(response.results[1].completed).toEqual(true);
  });

  it("responds correctly to mode change command", function() {
    expect(response.results[0].completed).toEqual(true);
  });

  it("responds with false completed value when attempting to move in LOW_POWER mode", function() {
    let moveCommand = [new Command("MOVE", 5432)];
    let moveMessage = new Message("Low power move test", moveCommand);
    let moveTestResponse = rover.receiveMessage(moveMessage);

    expect(moveTestResponse.results[0].completed).toEqual(false);
    expect(rover.position).toEqual(98382);
  });

  it("responds with position for move command", function() {
    let moveCommands = [new Command("MODE_CHANGE", "NORMAL"), new Command("MOVE", 5432)];
    let moveMessage = new Message("Normal move test", moveCommands);
    let moveTestResponse = rover.receiveMessage(moveMessage);

    expect(moveTestResponse.results[0].completed).toEqual(true);
    expect(moveTestResponse.results[1].completed).toEqual(true);
    expect(rover.position).toEqual(5432);
  });

});
