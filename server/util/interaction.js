/**
 * Module for interaction with user
 */

const   readline = require('readline'),
        stdin = process.stdin,
        stdout = process.stdout,
        rdl = readline.createInterface({
            input: stdin,
            output: stdout
        });

module.exports =  {
    /**
     * Write output to console for user (adds \r\n)
     * @param {string} output content to be placed in console
     */
    consoleWrite : output => {
        rdl.write(output + `\r\n`);
    },

    /**
     * Prompt user for input  (adds \r\n)
     * @param {string} question string to request user input
     * @param {function} cb function to run with passed data
     */
    consolePrompt : (question, cb) => {
        rdl.question(question+`\r\n`, (data)=>{
            cb(data);
        })
    }
};