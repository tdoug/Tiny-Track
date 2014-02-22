exports.save = function(req, res, next)
{
	res.send("Save");
};

exports.del = function(req, res, next)
{
	if (req.body.op != 'delete_log_entry') return next();
	res.send("Delete");
};

exports.list = function(req, res, next)
{
	res.send("List");
};