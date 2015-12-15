test('mornjs.lexer.js', function() {

	var tokens = morn.parseSelector('.outer .inner');

	equal(tokens.length, 3, 'css selector');
	
});