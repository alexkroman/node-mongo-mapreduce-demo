var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var PostSchema = new Schema({
  body: {type : String, default : '', trim : true, set: toTags}
  , user: {type : Schema.ObjectId, ref : 'User'}
  , createdAt  : {type : Date, default : Date.now}
  , tags : {type: [String]}
})

PostSchema.index({user:1, endedAt:1})

function toTags(val) {
  this.tags = val.match(/(#[A-Za-z0-9-_]+)/g)
  return val; 
}

PostSchema.statics.tags = function(callback) {

  var o = {};

  o.map = function() {
    if (!this.tags) {
      return;
    }
     
    for (index in this.tags) {
      emit(this.tags[index], 1);
    }
  }

  o.reduce = function(previous, current) {

    var count = 0

    for (index in current) {
        count += current[index];
    }

    return count;
  }

  o.out = 'tagResults'

  this.mapReduce(o, function (err, model, stats) {
    model.find().sort({'value.count': -1}).exec(callback);
  });

}

mongoose.model('Post', PostSchema)

mongoose.connect('mongodb://localhost/twitter_123')

module.exports = { mongoose: mongoose }