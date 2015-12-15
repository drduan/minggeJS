'use strict';

/**
 * lexer module.
 * used for parsing selector string and select node from document.
 * relies on core, selector, dom.
 */
define('lexer', ['core', 'selector', 'dom'], function($) {
    /**
     * Stream Class to contain selector text.
     * @param {string} text selector string
     * @returns {object}
     */
    function Stream(text) {
        this.number = 0;
        this.pos = 0;
        this.seletor = text;
    }

    Stream.EOL = -1;

    /**
     * get one char in selector and move forward the position.
     * if it is the end of selector, return Stream.EOL.
     * @returns {string}
     */
    Stream.prototype.read = function() {
        if (this.pos < this.seletor.length) {
            return this.seletor.charAt(this.pos++);
        } else {
        	this.pos++;
            return Stream.EOL;
        }
    };

    /**
     * set current postion backward a char.
     */
    Stream.prototype.putBack = function() {
        if (this.pos !== 0) {
            this.pos--;
        }
    };

    /**
     * get one char in selector but the postion will not move.
     * if it is the end of selector, return Stream.EOL.
     * @returns {string}
     */
    Stream.prototype.pick = function() {
		if (this.pos < this.seletor.length) {
			return this.seletor.charAt(this.pos);
		} else {
			return Stream.EOL;
		}
	};

    /**
     * test whether a string matches selector from current position.
     * @param {string} matchString
     * @returns {boolean}
     */
	Stream.prototype.match = function(matchString) {
		return this.seletor.indexOf(matchString, this.pos) === this.pos;
	};

    /**
     * skip white space from current position till the end or other char.
     */
	Stream.prototype.eatWhite = function() {
		while (this.pick() === ' ') {
			this.read();
		}
	};

	var type = {};

    /**
     * test whether a char is in a ascii range.
     * @param num
     * @param min
     * @param max
     * @returns {boolean}
     */
	type.inRange = function (num, min, max) {
		return (num >= min && num <= max);
	};

    /**
     * check number
     * @param c
     * @returns {boolean}
     */
	type.isNum = function(c) {
		return (type.inRange(c, '0', '9'));
	};

    /**
     * check letter
     * @param c
     * @returns {boolean}
     */
	type.isAlpha = function(c) {
		return (type.inRange(c, 'a', 'z') || type.inRange(c, 'A', 'Z'));
	};

    /**
     * check if a char is '\t' or whitespace
     * @param c
     * @returns {boolean}
     */
	type.isWhite = function(c) {
		return (c === '\t' || c === ' ');
	};

    /**
     * token types
     * @type {{WHITE: number, ID: number, CLASS: number, TAG: number, ALL: number, FAKE: number, SLIBING: number, CHILDREN: number, UNKNOWN: number}}
     */
	var Token = {
		WHITE         : 0,
		ID            : 1,
		CLASS         : 2,
		TAG           : 3,
		ALL           : 4,
		FAKE          : 5,
        SLIBING       : 6,
        CHILDREN      : 7,
        ATTRIBUTE     : 8,
        ATTRIBUTEVALUE: 9,
		UNKNOWN       : 10
	};

	$.Token = Token;

    /**
     * indicates current state when parsing selector.
     * @type {{START: number, INWHITE: number, INID: number, INCLASS: number, INTAG: number, INFAKECLASS: number, DONE: number}}
     */
	var State = {
		START: 0,
		INWHITE: 1,
		INID:    2,
		INCLASS: 3,
		INTAG:   4,
		INFAKECLASS: 5,
		INATTRIBUTE: 6,
		INATTRIBUTEVALUE: 7,
		DONE:    16
	};

    /**
     * state stack
     * @param {State} startup
     */
	function States(startup) {
		this.states = [startup];
	}

    /**
     * push a state to the top.
     * @param {State} state
     */
	States.prototype.push = function(state) {
		this.states.push(state);
	};

    /**
     * change the top state
     * @param {State} state
     */
	States.prototype.change = function(state) {
		this.states.pop();
		this.states.push(state);
	};

    /**
     * remove the top state and return it.
     * @returns {*}
     */
	States.prototype.pop = function() {
		return this.states.pop();
	};

    /**
     * return the top of state stack.
     * @returns {State}
     */
	States.prototype.top = function() {
		return this.states[this.states.length - 1];
	};

    /**
     * a parser to parse selector
     * @param {string} selector
     * @returns {object[]} tokens
     * @example
     * var tokens = $.parse('tag .class #id');
     * console.log(tokens); // {{text:'tag',type:3},{text:'', type:0},{text:'class',type:2},{text:'', type:0},{text:'id',type:1}}
     */
	$.parse = function (selector) {
		var currentToken = null,
			tokens       = [],
			c            = '',
			buffer       = '',
			state        = new States(State.START),
			save         = true,
			_saveToken   = false,
			stream       = new Stream(selector);

        /**
         * add token to tokens[], reset the _saveToken
         * @param {string} buffer
         * @param {token} token
         */
		function addToken (buffer, token) {
			tokens.push({text: buffer, type: token});
			_saveToken = false;
		}

        /**
         * set currentToken. token will be saved at the loop circle end by addToken().
         * @param {token} token
         */
		function saveToken(token) {
			currentToken = token;
			_saveToken = true;
		}

        /**
         * backword position in stream.
         */
		function putBack(){
			stream.putBack();
			save = false;
		}

        // loop to get tokens array.
		while (state.top() !== State.DONE) {

			c = stream.read();
			save = true;
			switch (state.top()) {

				case State.START:
					if (type.isAlpha(c)) {
						state.push(State.INTAG);
					} else if (c === '.') {
						save = false;
						state.push(State.INCLASS);
					} else if (c === '#') {
						save = false;
						state.push(State.INID);
					} else if (c === '*') {
						saveToken(Token.ALL);
					} else if (type.isWhite(c)) {
						state.push(State.INWHITE);
                    } else if (c === '>') {
						save = false;
						stream.eatWhite();
                        saveToken(Token.CHILDREN);
                    } else if (c === '~') {
						save = false;
						stream.eatWhite();
                        saveToken(Token.SLIBING);
                    } else if (c === Stream.EOL) {
						state.change(State.DONE);
					} else if (c === '[') {
						save = false;
						state.push(State.INATTRIBUTE);
					} else if (c === ':') {
						save = false;
						stream.eatWhite();
						state.push(State.INFAKECLASS);
					}
					break;

				case State.INTAG:
					if (!type.isAlpha(c) && !type.isNum(c) && c !== '-') {
						putBack();
						saveToken(Token.TAG);
						state.pop();
					}
					break;

				case State.INCLASS:
					if (!type.isAlpha(c) && !type.isNum(c) && c !== '-') {
						putBack();
						saveToken(Token.CLASS);
						state.pop();
					}
					break;

				case State.INID:
					if (!type.isAlpha(c) && !type.isNum(c) && c !== '-') {
						putBack();
						saveToken(Token.ID);
						state.pop();
					}
					break;

				case State.INWHITE:
					if (!type.isWhite(c)) {
						putBack();
						saveToken(Token.WHITE);
						state.pop();
					}
					save = false;
					break;

				case State.INATTRIBUTE:
					if (c === ']' || c === Stream.EOL) {
						save = false;
						saveToken(Token.ATTRIBUTE);
						state.pop();
					} else if (c === '=') {
						save = false;
						saveToken(Token.ATTRIBUTE);
						state.change(State.INATTRIBUTEVALUE);
					} else if (type.isWhite(c)) {
						save = false;
					}
					break;

				case State.INATTRIBUTEVALUE:
					if (c === ']' || c === Stream.EOL) {
						save = false;
						saveToken(Token.ATTRIBUTEVALUE);
						state.pop();
					} else if (type.isWhite(c)) {
						save = false;
					}
					break;

				case State.INFAKECLASS:
					if (!type.isAlpha(c)) {
						putBack();
						saveToken(Token.FAKE);
						state.pop();
					}
                    break;
				default:
                    break;
					//never reaches here;
			}

			if (save === true) {
				buffer += c;
                if (buffer.length > 100) {
                    return tokens;
                }
			}

			if (_saveToken) {
				addToken(buffer, currentToken);
				if (tokens.length > 100) {
					return $.analyse(tokens);
				}
				buffer = '';
			}
		}

		return tokens;
	};

    /**
     * parse selector to tokens and get doms.
     * @param {string} selector
     * @param {nodeList} scope
     * @returns {morn.init}
     */
	$.parseSelector = function (selector, scope) {
		return $.analyse($.parse(selector), scope);
	};

    /**
     * select nodes in document.
     * @param {tokens[]} tokens
     * @param {nodeList} scope
     * @returns {morn.init}
     */
    $.analyse = function(tokens, scope) {
        var tmp,
            result = null,
			lastResult = scope || null,
			doWithCurrent = false,
			iter,
			resultlen;

        /**
         * when meets Token.ID, Token.CLASS, Token.TAG,
         * if doWithCurrent == true, select nodes from lastResult,
         * else select nodes from document in scope of lastResult.
         * when meets Token.FAKE, Token.CHILDREN, Token.SILIBING
         * select nodes from lastResult.
         */
		for (var len = tokens.length, i = 0; i < len; i++) {
			switch(tokens[i].type) {
				case Token.WHITE:
					doWithCurrent = false;
					break;

				case Token.ID:
					if (doWithCurrent === true) {
						for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
							if (lastResult[iter].id === tokens[i].text) {
								result = [lastResult[iter]];
								break;
							}
						}
					} else {
						result = $.id(tokens[i].text, scope);
						if (result === null) {
							result = [];
						}
					}
					doWithCurrent = true;
					break;

				case Token.CLASS:
					if (lastResult !== null) {
						result = [];
						if (doWithCurrent === true) {
							for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
								if ($.hasClass(lastResult[iter], tokens[i - 1].text)) {
									result.push(lastResult[iter]);
								}
							}
						} else {
							for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
                                tmp = $['class'](tokens[i].text, lastResult[iter]);
								for (var index = 0, l = tmp.length; index < l; index++) {
									result.push(tmp[index]);
								}
							}
						}
					} else {
						result = $['class'](tokens[i].text);
					}
					doWithCurrent = true;
					break;

				case Token.TAG:
					if (lastResult !== null) {
						result = [];
						if (doWithCurrent === true) {
							for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
								if (lastResult[iter].tagName.toLowerCase() === tokens[i].text) {
									result.push(lastResult[iter]);
								}
							}
						} else {
							for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
								tmp = $.tag(tokens[i].text, lastResult[iter]);
								for (var index = 0, l = tmp.length; index < l; index++) {
									result.push(tmp[index]);
								}
							}
						}

					} else {
						result = $.tag(tokens[i].text);
					}
					doWithCurrent = true;
					break;

                case Token.SLIBING:
                    if (lastResult !== null) {
                        var existNode = [],
                            node,
                            nodeIndex,
                            existNodeLen,
                            slibings = [];

                        for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
                            if (! existIn(lastResult[iter].parentElement, existNode)) {
                                existNode.push(lastResult[iter].parentElement);
                                slibings = slibings.concat(Array.prototype.slice.call(lastResult[iter].parentElement.children, 0));
                            }
                        }
                        result = slibings;
                        doWithCurrent = true;
                    } else {
                        result = [];
                    }
                    break;

                case Token.CHILDREN:
                    if (lastResult !== null) {
                        result = [];

                        for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
                            result = result.concat(Array.prototype.slice.call(lastResult[iter].children, 0));
                        }

                        doWithCurrent = true;
                    } else {
                        result = [];
                    }
                    break;

                case Token.ATTRIBUTE:
                	if (lastResult !== null) {
                		result = [];
                		if (tokens[i + 1] && tokens[i + 1].type === Token.ATTRIBUTEVALUE) {

                			var attributeValue = tokens[i + 1].text;
	                        for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
	                        	if (lastResult[iter].getAttribute(tokens[i].text) === attributeValue) {
	                        		result.push(lastResult[iter]);
	                        	}
	                        }
	                        i++;

                		} else {

                        	for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
	                        	if (lastResult[iter].getAttribute(tokens[i].text) !== null) {
	                        		result.push(lastResult[iter]);
	                        	}
	                        }
	                        
                		}
	
                	} else {
                		result = [];
                	}

				case Token.FAKE:
					if (lastResult !== null) {
						var fake = tokens[i].text;

						if (fake === 'odd') {

							result = [];
							for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
								if (iter % 2 === 0) {
									result.push(lastResult[iter]);
								}
							}

						} else if (fake === 'even') {
							result = [];
							for (iter = 0, resultlen = lastResult.length; iter < resultlen; iter++) {
								if (iter % 2 === 1) {
									result.push(lastResult[iter]);
								}
							}

						} else if (fake === 'first-child') {
								result = [lastResult[0]];

						} else if (fake === 'last-child') {
								result = [lastResult[lastResult.length - 1]];
						}

					} else {
						result = [];
					}
					break;
				default:
			}

            if (result.length === 0 && lastResult !== null) {
                return result;
            }

			lastResult = result;
		}

		return result;
	};

    /**
     * check whether if a node in nodeList
     * @param {node} node
     * @param {nodeList} nodelist
     * @returns {boolean}
     */
    function existIn(node, nodelist) {
        for (var nodeIndex = 0, existNodeLen = nodelist.length; nodeIndex < existNodeLen; nodeIndex++) {
            if (nodelist[nodeIndex] === node) {
                return true;
            }
        }
        return false;
    }
});