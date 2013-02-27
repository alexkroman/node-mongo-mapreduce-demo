var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var PostSchema = new Schema({
  body: {type : String},
  tags : {type: [String]}
});

PostSchema.pre('save', function (next) {
  this.tags = this.body.match(/(#[A-Za-z0-9-_]+)/g);
  next();
});

PostSchema.statics.tags = function(callback) {
  var o = {};
  var i = 0;

  // Define the map function
  o.map = function() {

    if (!this.tags) {
      return;
    }

    // Iterate over the post collection and return a list of tags and their current count of 1
    for (i = 0; i < this.tags.length; i += 1) {
      emit(this.tags[i], 1);
    }
  };

  // Define the reduce function that will be fun
  o.reduce = function(previous, current) {

    var count = 0;

    // For each tag add up the number of times it occurs
    for (i = 0; i < current.length; i += 1) {
      count += current[i];
    }

    return count;
  };

  // Save the results to a Mongo collection called "tagResults"
  o.out = 'tagResults';

  // Run the mapreduce command and sort the collection by count
  this.mapReduce(o, function (err, model, stats) {
    model.find().sort({'value.count': -1}).exec(callback);
  });

};

mongoose.model('Post', PostSchema);
mongoose.connect('mongodb://localhost/twitter_1');
module.exports = { mongoose: mongoose };