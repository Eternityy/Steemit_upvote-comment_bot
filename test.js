console.log(Math.floor(Math.random() * 5));

steem = require('steem')
/*
steem.api.getDiscussionsByCreated({"limit":100}, function(err, result) {
  if (err) console.log('query error')
  else {
		console.log(result[0].post_id)
  }
});
*/

var oldDate = new Date();
var oldest_id = 0;
steem.api.getDiscussionsByTrending({"limit": 100}, function(err, result) {
	for (var i = 0; i < 100; i++) {
		postDate = new Date(result[i].created);
		if (oldDate - postDate > 0) {
			oldest_id = i
			oldDate = postDate
		}
	}
	console.log(result[oldest_id].title);

});
