const   normalize = require('../util/normalize'),
        interact = require('../util/interaction');
/**
 * Service for managing leads
 * @prop {array} leads array of object leads
 */

module.exports = class leads {
    constructor(leads){
        this._filteredList = [];
        this._leads = leads;
        this._log = [];
    }
    //Getters
    // return filtered list
    get getFilteredList() {
        return this._filteredList;
    }

    get getLeads() {
        return this._leads;
    }

    get getLog() {
        this._log.forEach(item=>{
            interact.consoleWrite(item);
        })
    }

    //Setter
    set setFilteredLeads(filtered){
        if (!filtered || !Array.isArray(filtered) || filtered.length < 1) return; // make sure non-empty array
        this._filteredList = filtered;
    }

    set setLog(log){
        if(Array.isArray(log)){
            this._log = log;
        } else {
            this._log.push(log);
        }
    }

    //method
    filterLeads(lds) {
        const   keyMap = {}, // hash for id's
                emailMap = {}, // hash for emails
                filtered = [], // new list for filtered
                leads = lds ? lds : this._leads;
        [...leads].forEach(lead=>{
            let emailKey = normalize.getEmailHashKey(lead.email); // store current email as normalized key
            if(keyMap[lead._id]){ // if id exist in hash
                //compare dates
                if(new Date(keyMap[lead._id].entryDate) <= new Date(lead.entryDate)){ // if current lead is newer => replace
                    this.setLog = `duplicate id found ${lead._id}, replacing...`; // add to log
                    filtered[keyMap[lead._id].ind] = lead; //replace lead in filtered list
                    keyMap[lead._id] = { //update hash for id
                        entryDate: lead.entryDate,
                        ind: keyMap[lead._id].ind // store location in filtered array
                    };
                    emailMap[emailKey] = { //update hash for email map
                        entryDate: lead.entryDate,
                        leadID: lead._id // store id for lookup
                    };
                    this.setLog = `duplicate id ${lead._id}, replaced`; // add finished statement to log
                }
            } else if (emailMap[normalize.getEmailHashKey(lead.email)]) {// if email was previously used
                //compare dates
                if(new Date(emailMap[emailKey].entryDate) <= new Date(lead.entryDate)){ // if current lead is newer => replace
                    this.setLog = `duplicate email found ${lead.email}, replacing...`; // log begin email replacement

                    let tempId = emailMap[emailKey].leadID;//get old id

                    //update keymap first to use email has leadID prop
                    keyMap[lead._id] = { // add current id to hash
                        entryDate: lead.entryDate,
                        ind: keyMap[tempId].ind //get previous index of item in filtered array
                    };

                    //update email hash item to store new data
                    emailMap[emailKey] = { //update hash for email map
                        entryDate: lead.entryDate,
                        leadID: lead._id // store id for lookup
                    };

                    filtered[keyMap[emailMap[emailKey].leadID].ind] = lead; //replace lead in filtered list
                    delete keyMap[tempId] //delete old id from id hash
                    this.setLog = `duplicate email ${lead.email}, replaced`; // log email replacement process finished
                }
            } else { // if lead id not in hash
                // email not found add to keyMap && filtered (keep date and index for comparing and easy updating)
                this.setLog = `adding ${lead._id} - ${lead.firstName} ${lead.lastName} to leads`; // add to log
                filtered.push(lead);
                keyMap[lead._id] = {
                    entryDate: lead.entryDate,
                    ind: filtered.length - 1
                };
                emailMap[emailKey] = { //update hash for email map
                    entryDate: lead.entryDate,
                    leadID: lead._id // store id for lookup
                };
                this.setLog = `done adding ${lead._id} - ${lead.firstName} ${lead.lastName} to leads`; // add completed to log
            }
        });
        return filtered;
    }
}