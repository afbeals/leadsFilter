/**
 * Normalized functions
 */

module.exports = {
    /**
     * Replace periods with underscore for normalized names
     * @param {string} str the string to be updated
     * @return {string} the new updated string
     */
    getEmailHashKey: str => {
        return str.replace(/\./g,'_');
    }
}