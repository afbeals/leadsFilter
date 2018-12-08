#! /usr/local/bin/node
const   fs = require('fs'),
        path = require('path'),
        readline = require('readline'),
        leadsJson = path.join(__dirname+'/./data/leads.json'),
        interact = require('./server/util/interaction.js'),
        leadList = require('./server/service/leadsService');

let     Leads;

// SETUP READING KEYPRESS EVENTS
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

// SIGNAL EXIT
const exit = () => {
    process.exit();
};

// READ LOG OF ACTIVITES RAN
const readLog = () => {
    return Leads.getLog;
}

// FILTER LIST FROM CLASS
const filterList = filteredLeads => {
    setTimeout(()=>{ // mock loading time wait
        Leads.setFilteredLeads = filteredLeads; // set classes
        interact.consoleWrite(`Filtered Leads:`);
        [...Leads.getFilteredList].forEach(lead=>{ // print each lead to console in short format
            interact.consoleWrite(`${lead.firstName} ${lead.lastName} - ${new Date(lead.entryDate).toLocaleString()}`);
        })
        interact.consolePrompt(`Would you like to see the log of activites ran? (Y||N)`, userInput=>{
            const   input = userInput.toLowerCase().trim()[0]; // just read first character to normalize
            if(input === `y`){
                interact.consoleWrite(`Fetching Logs...`);
                readLog();
                exit();
            } else {
                exit();
            }
        });
    },1000)
}

// BEGIN INTERACTING WITH USER
const begin = () => {
    interact.consolePrompt(`Begin filtering leads? (Y||N)`,data => {
        const   input = data.toLowerCase().trim()[0]; // just read first character to normalize
        if(input === `y`){
            interact.consoleWrite(`Beginning filter...`);
            interact.consoleWrite(`One moment please...`);
            filterList(Leads.filterLeads());
        } else if (input === `n`){
            interact.consoleWrite(`Okay, please press enter when ready to begin.`);
            process.stdin.on('keypress', (str, key) => { // wait for key press of return key
                if(key.name === 'return') {
                    interact.consoleWrite(`Filtering...`);
                    filterList(Leads.filterLeads());
                }
            });
        };
    });
}

// INITIALIZE APPLICTION
const init = () => {
    interact.consoleWrite(`Welcome!`);
    interact.consoleWrite(`Fetching leads... one moment please...`);
    setTimeout(()=>{ // mock ajax request
        const leads = JSON.parse(fs.readFileSync(leadsJson, 'utf8')).leads; // fetch and read leads
        Leads = new leadList(leads); // set leads
        interact.consoleWrite(`Records received.`);
        begin();
    },1000);
}


// INITIALIZE

init();

// HANDLE EXIT REQUEST

process.on(`exit`, function(){
    interact.consoleWrite(`See ya!`);
    process.exit();
});

process.on(`SIGINT`, function(){
    interact.consoleWrite(`See ya!`);
    process.exit();
});