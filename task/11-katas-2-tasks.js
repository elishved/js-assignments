'use strict';

/**
 * Returns the bank account number parsed from specified string.
 *
 * You work for a bank, which has recently purchased an ingenious machine to assist in reading letters and faxes sent in by branch offices.
 * The machine scans the paper documents, and produces a string with a bank account that looks like this:
 *
 *    _  _     _  _  _  _  _
 *  | _| _||_||_ |_   ||_||_|
 *  ||_  _|  | _||_|  ||_| _|
 *
 * Each string contains an account number written using pipes and underscores.
 * Each account number should have 9 digits, all of which should be in the range 0-9.
 *
 * Your task is to write a function that can take bank account string and parse it into actual account numbers.
 *
 * @param {string} bankAccount
 * @return {number}
 *
 * Example of return :
 *
 *   '    _  _     _  _  _  _  _ \n'+
 *   '  | _| _||_||_ |_   ||_||_|\n'+     =>  123456789
 *   '  ||_  _|  | _||_|  ||_| _|\n'
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '| | _| _|| ||_ |_   ||_||_|\n'+     => 23056789
 *   '|_||_  _||_| _||_|  ||_| _|\n',
 *
 *   ' _  _  _  _  _  _  _  _  _ \n'+
 *   '|_| _| _||_||_ |_ |_||_||_|\n'+     => 823856989
 *   '|_||_  _||_| _||_| _||_| _|\n',
 *
 */
function parseBankAccount(bankAccount) {
    const top =  [' _ ', '   ', ' _ ', ' _ ', '   ', ' _ ', ' _ ', ' _ ', ' _ ', ' _ '];
    const middle =  ['| |', '  |', ' _|', ' _|', '|_|', '|_ ', '|_ ', '  |', '|_|', '|_|'];
    const bottom =  ['|_|', '  |', '|_ ', ' _|', '  |', ' _|', '|_|', '  |', '|_|', ' _|'];

    function getStringDigit(index, arr) {
        let digit = [];
        for (let i = 0; i < arr.length; i++) {
            digit.push( arr[i].slice(index * 3, (index + 1) * 3));
        }
        return digit;
    }

    let stringAccount = bankAccount.split('\n');
    const numOfDigits = bankAccount.length / 3 - 1;
    let result = '';

    for (let i = 0; i < numOfDigits; i++) {
        const digit = getStringDigit(i, stringAccount);
        for (let j = 0; j < numOfDigits; j++) {
            if (top[j] == digit[0] && middle[j] == digit[1] && bottom[j] == digit[2]) {
                result += j;
                break;
            }

        }
    }
return result;
}


/**
 * Returns the string, but with line breaks inserted at just the right places to make sure that no line is longer than the specified column number.
 * Lines can be broken at word boundaries only.
 *
 * @param {string} text
 * @param {number} columns
 * @return {Iterable.<string>}
 *
 * @example :
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 26 =>  'The String global object',
 *                                                                                                'is a constructor for',
 *                                                                                                'strings, or a sequence of',
 *                                                                                                'characters.'
 *
 *  'The String global object is a constructor for strings, or a sequence of characters.', 12 =>  'The String',
 *                                                                                                'global',
 *                                                                                                'object is a',
 *                                                                                                'constructor',
 *                                                                                                'for strings,',
 *                                                                                                'or a',
 *                                                                                                'sequence of',
 *                                                                                                'characters.'
 */
function* wrapText(text, columns) {
    let startOfLine = 0, endOfWord = 0;
    let count = 0, i = 0;
    while(text[i]) {
        count++;
        if (text[i] == ' ') endOfWord = i;
        if (count > columns) {
            yield text.substring(startOfLine, endOfWord);
            startOfLine = endOfWord + 1;
            count = 0;
            i = endOfWord;
        }
        i++;
    }
    yield text.substring(startOfLine);
}


/**
 * Returns the rank of the specified poker hand.
 * See the ranking rules here: https://en.wikipedia.org/wiki/List_of_poker_hands.
 *
 * @param {array} hand
 * @return {PokerRank} rank
 *
 * @example
 *   [ '4♥','5♥','6♥','7♥','8♥' ] => PokerRank.StraightFlush
 *   [ 'A♠','4♠','3♠','5♠','2♠' ] => PokerRank.StraightFlush
 *   [ '4♣','4♦','4♥','4♠','10♥' ] => PokerRank.FourOfKind
 *   [ '4♣','4♦','5♦','5♠','5♥' ] => PokerRank.FullHouse
 *   [ '4♣','5♣','6♣','7♣','Q♣' ] => PokerRank.Flush
 *   [ '2♠','3♥','4♥','5♥','6♥' ] => PokerRank.Straight
 *   [ '2♥','4♦','5♥','A♦','3♠' ] => PokerRank.Straight
 *   [ '2♥','2♠','2♦','7♥','A♥' ] => PokerRank.ThreeOfKind
 *   [ '2♥','4♦','4♥','A♦','A♠' ] => PokerRank.TwoPairs
 *   [ '3♥','4♥','10♥','3♦','A♠' ] => PokerRank.OnePair
 *   [ 'A♥','K♥','Q♥','2♦','3♠' ] =>  PokerRank.HighCard
 */
const PokerRank = {
    StraightFlush: 8,
    FourOfKind: 7,
    FullHouse: 6,
    Flush: 5,
    Straight: 4,
    ThreeOfKind: 3,
    TwoPairs: 2,
    OnePair: 1,
    HighCard: 0
}

function getPokerHandRank(hand) {
    const getShape = card => card[card.length - 1];
    const rankToNum = rank => isNaN(parseInt(rank)) ? (11 + ['J', 'Q', 'K', 'A'].indexOf(rank)) : parseInt(rank);
    const getRank = card => rankToNum(card.length == 3 ? card.slice(0, 2) : card[0]);
    const isSameShape = cards => cards.every(card => getShape(card) == getShape(cards[0]));

    function countRanks(cards) {
        const counters = Array.from({length: 13}, elem => 0);
        for (let card of cards) {
            counters[getRank(card) - 2]++;
        }
        return counters;
    }

    function isStraight (cards) {
        const sorted = cards.map(card => getRank(card)).sort((a, b) => a - b);
        if (sorted[0] == '2' && sorted[sorted.length - 1] == '14') {
            sorted.unshift(sorted.pop());
        }
        for (let i = 1; i < sorted.length; i++) {
            const diff = sorted[i] - sorted[i - 1];
            if (diff != 1 && diff != -12) {
                return false;
            }
        }

        return true;
    }

    const ranks = countRanks(hand);
    switch(true) {
        case (isStraight(hand) && isSameShape(hand)):
            return PokerRank.StraightFlush;
        case (ranks.indexOf(4) != -1):
            return PokerRank.FourOfKind;
        case (ranks.indexOf(3) != -1 && ranks.indexOf(2) != -1):
            return PokerRank.FullHouse;
        case isSameShape(hand):
            return PokerRank.Flush;
        case isStraight(hand):
            return PokerRank.Straight;
        case ranks.indexOf(3) != -1:
            return PokerRank.ThreeOfKind;
        case ranks.indexOf(2) != -1 && ranks.lastIndexOf(2) != ranks.indexOf(2):
            return PokerRank.TwoPairs;
        case ranks.indexOf(2) != -1:
            return PokerRank.OnePair;
        default:
    return PokerRank.HighCard;
    }
}


/**
 * Returns the rectangles sequence of specified figure.
 * The figure is ASCII multiline string comprised of minus signs -, plus signs +, vertical bars | and whitespaces.
 * The task is to break the figure in the rectangles it is made of.
 *
 * NOTE: The order of rectanles does not matter.
 * 
 * @param {string} figure
 * @return {Iterable.<string>} decomposition to basic parts
 * 
 * @example
 *
 *    '+------------+\n'+
 *    '|            |\n'+
 *    '|            |\n'+              '+------------+\n'+
 *    '|            |\n'+              '|            |\n'+         '+------+\n'+          '+-----+\n'+
 *    '+------+-----+\n'+       =>     '|            |\n'+     ,   '|      |\n'+     ,    '|     |\n'+
 *    '|      |     |\n'+              '|            |\n'+         '|      |\n'+          '|     |\n'+
 *    '|      |     |\n'               '+------------+\n'          '+------+\n'           '+-----+\n'
 *    '+------+-----+\n'
 *
 *
 *
 *    '   +-----+     \n'+
 *    '   |     |     \n'+                                    '+-------------+\n'+
 *    '+--+-----+----+\n'+              '+-----+\n'+          '|             |\n'+
 *    '|             |\n'+      =>      '|     |\n'+     ,    '|             |\n'+
 *    '|             |\n'+              '+-----+\n'           '+-------------+\n'
 *    '+-------------+\n'
 */
function* getFigureRectangles(figure) {
    let figureArr = figure.split('\n');
	let rectangle = new Array();
	for (let i = 0; i < figureArr.length; i++)
		for (let j = 0; j < figureArr[i].length; j++)
			if (figureArr[i][j] == '+') {
				rectangle = GetRectangle(figureArr, i, j);
				if (rectangle != null)
					yield DrawRectangle(rectangle[1], rectangle[0]);
                }
}
function GetRectangle(figure, row, column) {
	for (let i = row + 1; i < figure.length; i++) {
		if (figure[i][column] == '+') {
			for (let j = column + 1; j < figure[row].length; j++) {
				if (figure[i][j] == "+") {
					if (figure[row][j] == "+") {
						let flag = true;
						for (let k = row + 1; k < i; k++)
							if (figure[k][j] != '|') {
								flag = false;
								break;
							}
						if (flag) return [i - row + 1, j - column + 1];
					}
				} else if (figure[i][j] != '-') break;
			}
		} else if (figure[i][column] != '|') break;
	}
	return null;
}

function DrawRectangle(width, height) {
    return '+' + '-'.repeat(width - 2) + '+\n' + ('|' + ' '.repeat(width - 2) +
            '|\n').repeat(height - 2) + '+' + '-'.repeat(width - 2) + '+\n';
}


module.exports = {
    parseBankAccount : parseBankAccount,
    wrapText: wrapText,
    PokerRank: PokerRank,
    getPokerHandRank: getPokerHandRank,
    getFigureRectangles: getFigureRectangles
};
