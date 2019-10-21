var mongoose = require('mongoose');

var options = {
  useUnifiedTopology: true,
  connectTimeoutMS: 5000,
  useNewUrlParser: true,
  useFindAndModify: false
}
mongoose.connect('mongodb+srv://Admin:Admin@cluster0-lrcfn.mongodb.net/EnsImmo?retryWrites=true',
  options,
  function(err) {
    if (err) {
       console.log(err);
     } else {
       console.log("Connection: Done!");
     }
  }
);

module.exports = mongoose;