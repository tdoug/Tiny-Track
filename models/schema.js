var mongoose = require('mongoose');

var log_entry = mongoose.model('log_entry',
	{
		name:String,
		calories:Number,
		fat:Number,
		protein:Number,
		carbs:Number,
		user_id:String,
		date:Number,
	});

exports.log_entry = log_entry;