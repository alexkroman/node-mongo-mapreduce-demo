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

  o.map = function() {

    if (!this.tags) {
      return;
    }

    for (i = 0; i < this.tags.length; i += 1) {
      emit(this.tags[i], 1);
    }
  };

  o.reduce = function(previous, current) {

    var count = 0;

    for (i = 0; i < current.length; i += 1) {
      count += current[i];
    }

    return count;
  };

  o.out = 'tagResults';

  this.mapReduce(o, function (err, model, stats) {
    model.find().sort({'value.count': -1}).exec(callback);
  });

};

mongoose.model('Post', PostSchema);
mongoose.connect('mongodb://localhost/twitter_1');
module.exports = { mongoose: mongoose };