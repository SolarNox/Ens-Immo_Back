//Fonction Date
var editDate = (Date) => {

    return Date.getDate() + "/" + (Date.getMonth() + 1)+ "/" + Date.getFullYear()
  
}
  
module.exports = editDate;  