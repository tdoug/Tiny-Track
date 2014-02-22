var schema = require('../models/schema.js');

exports.save = function(req, res, next)
{
	//operation is in a hidden form field for now
	if (req.body.op != 'save_log_entry') return next();

	console.log(JSON.stringify(req.body));
	var entry = new schema.log_entry({
		name: req.body.food_name,
		calories: req.body.food_cal,
		fat: req.body.food_fat,
		carbs: req.body.food_carb,
		protein: req.body.food_protein,
		user_id: req.user._id,
		date: req.body.food_date,
	});

	entry.save(function(error){
		if (error) return next(error);
	});

	console.log('Entry Saved');
	console.log(entry);

	res.send(200);
};

exports.del = function(req, res, next)
{
	if (req.body.op != 'delete_log_entry') return next();
	
	var record_id = req.body.record_id;

	schema.log_entry.find({user_id:req.user._id, _id:record_id}).remove().exec();

	res.send(200);
};