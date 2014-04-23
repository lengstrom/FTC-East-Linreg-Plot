var fs = require('fs');
var data = [];

fs.readFile(__dirname + '/coeffs/east.txt', function (err, d) {
	var contents = d.toString();
	var pStart = 0;
	var start = 0;
	contents.split('\n').forEach(function(o) {
		if (o.indexOf('score') != -1) {
			pStart = 3;
		}

		if (pStart) {
			pStart--;
			if (pStart === 0) {
				start = 1;
			}
		}
		if (start) {
			var pipeIndex = contents.indexOf('|');
			if (pipeIndex != -1) {
				pipeIndex -= 2;
				var coeff = parseFloat(removeSpaces(o.substring(pipeIndex, pipeIndex + 11)));
				pipeIndex += 2;
				var name = removeSpaces(o.substring(pipeIndex - 18, pipeIndex - 7)).substr(1);
				var se = parseFloat(removeSpaces(o.substring(pipeIndex + 9, pipeIndex + 19)));
				if (name !== '' && se !== '' && coeff !== '') {
					data.push({name:name, coeff:coeff, se:se});
				}
			}
		}
	});

	fs.writeFile(__dirname + '/output.js', 'var data = ' + JSON.stringify(data));
});

function removeSpaces(str) {
	return str.replace(/\s+/g, '');
}