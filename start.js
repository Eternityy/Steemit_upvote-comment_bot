// type node start.js 30 actualcode.js

// => execute 'actualcode.js for every 30seconds!!'
// easy to avoid crashes

var arg1 = process.argv[2] // run_term
var arg2 = process.argv[3] // core program
var exec = require('child_process').exec;
function run() {
	exec("node " + arg2, function (error, stdout, stderr) {
		console.log(stdout)
	});
}
run()
run_term = parseInt(arg1)
setInterval(run, run_term * 1000);