/**
* Gets a random index within a given array.
* @param {array} array 
* @returns {number} index
*/
module.exports = {
  getRandomArrayIndex: function(array) {
    return Math.floor(Math.random() * array.length);
  }
};