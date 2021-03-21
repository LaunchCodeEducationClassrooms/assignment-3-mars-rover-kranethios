const Message = require('./message.js');
const Command = require('./command.js');

class Rover {
   constructor(position) {
     this.position = position;
     this.mode = 'NORMAL';
     this.generatorWatts = 110;
   }

   receiveMessage(message) {

     let response = {
       message: message.name,
       commands: message.commands,
       results: []
     };

     let status = {
       roverStatus: this,
       completed: false
     };

     for (let i = 0; i < message.commands.length; i++) {
       status.completed = false;

       if (message.commands[i].commandType === "MOVE") {
         
         if (this.mode === "NORMAL") {
           this.position = message.commands[i].value;
           status.completed = true;
         } else if (this.mode === "LOW_POWER") {
           status.completed = false;
         } else {
           status.completed = false;
         }

       } else if (message.commands[i].commandType === "STATUS_CHECK") {
         
         console.log(`>Rover status< \nPosition: ${this.position}\nMode: ${this.mode}\nGenerator: ${this.generatorWatts}W\n`);
         status.completed = true;

       } else if (message.commands[i].commandType === "MODE_CHANGE") {

         if (message.commands[i].value === "NORMAL") {
           this.mode = "NORMAL";
           status.completed = true;
         } else if (message.commands[i].value === "LOW_POWER") {
           this.mode = "LOW_POWER";
           status.completed = true;
         } else {
           status.completed = false;
         }

       } else {

         status.completed = false;
         throw Error("Invalid command type.");

       }

       status.roverStatus = this;
       response.results.push(status);
     }

     return response;
   }
}

module.exports = Rover;