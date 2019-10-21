//Fonction Time
var editTime = (Date) => {

    return ("0" + Date.getHours()).slice(-2) + ":" + ("0" + Date.getMinutes()).slice(-2)
  
}
  
module.exports = editTime;  