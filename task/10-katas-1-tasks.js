'use strict';

/**
 * Returns the array of 32 compass points and heading.
 * See details here:
 * https://en.wikipedia.org/wiki/Points_of_the_compass#32_cardinal_points
 *
 * @return {array}
 *
 * Example of return :
 *  [
 *     { abbreviation : 'N',     azimuth : 0.00 ,
 *     { abbreviation : 'NbE',   azimuth : 11.25 },
 *     { abbreviation : 'NNE',   azimuth : 22.50 },
 *       ...
 *     { abbreviation : 'NbW',   azimuth : 348.75 }
 *  ]
 */
function createCompassPoints() {
    var sides = ['N','E','S','W'];  // use array of cardinal directions only!
    let points = []

    let curr_azimuth = 0;
    let getCompassPoint = (abbreviation, azimuth) => {
        const point = {
            abbreviation: abbreviation,
            azimuth: azimuth
        };
        curr_azimuth += 11.25;

    return point;
    }
    for (let i = 0; i < sides.length; i++) {
        const side = sides[i];
        const next = (i == sides.length - 1) ? sides[0] : sides[i + 1];
        const isEven = !(i % 2);

        points.push(getCompassPoint(`${side}`, curr_azimuth));
        points.push(getCompassPoint(`${side}b${next}`, curr_azimuth));
        points.push(getCompassPoint(isEven ? `${side}${side}${next}` : `${side}${next}${side}`, curr_azimuth));
        points.push(getCompassPoint(isEven ? `${side}${next}b${side}` : `${next}${side}b${side}`, curr_azimuth));
        points.push(getCompassPoint(isEven ? `${side}${next}` : `${next}${side}`, curr_azimuth));
        points.push(getCompassPoint(isEven ? `${side}${next}b${next}` : `${next}${side}b${next}`, curr_azimuth));
        points.push(getCompassPoint(isEven ? `${next}${side}${next}` : `${next}${next}${side}`, curr_azimuth));
        points.push(getCompassPoint(`${next}b${side}`, curr_azimuth));
    }

    return points;
}


/**
 * Expand the braces of the specified string.
 * See https://en.wikipedia.org/wiki/Bash_(Unix_shell)#Brace_expansion
 *
 * In the input string, balanced pairs of braces containing comma-separated substrings
 * represent alternations that specify multiple alternatives which are to appear at that position in the output.
 *
 * @param {string} str
 * @return {Iterable.<string>}
 *
 * NOTE: The order of output string does not matter.
 *
 * Example:
 *   '~/{Downloads,Pictures}/*.{jpg,gif,png}'  => '~/Downloads/*.jpg',
 *                                                '~/Downloads/*.gif'
 *                                                '~/Downloads/*.png',
 *                                                '~/Pictures/*.jpg',
 *                                                '~/Pictures/*.gif',
 *                                                '~/Pictures/*.png'
 *
 *   'It{{em,alic}iz,erat}e{d,}, please.'  => 'Itemized, please.',
 *                                            'Itemize, please.',
 *                                            'Italicized, please.',
 *                                            'Italicize, please.',
 *                                            'Iterated, please.',
 *                                            'Iterate, please.'
 *
 *   'thumbnail.{png,jp{e,}g}'  => 'thumbnail.png'
 *                                 'thumbnail.jpeg'
 *                                 'thumbnail.jpg'
 *
 *   'nothing to do' => 'nothing to do'
 */
function* expandBraces(str) {
    const OPEN = '{';
    const CLOSE = '}';
    const SEPARATOR = ',';
    const BLANK = ' ';

    let i = 0;
    let curLevel = getVariants(0, "{"+str+"}");

    for (let word of curLevel) {
        yield word;
    }

   function addToArray(resArr, addStr) {
        if (!resArr.length) return [addStr];
        return resArr.map( x => x.concat(addStr))
    }

    function pushToArray(resArr, addArr) {
        if (!resArr.length) return addArr;
        addArr.map( x => resArr.push(x));
        return resArr;
    }

    function concatVariants(variants, array) {
        if (!array.length) return variants;
        let result = [];
        for (let variant of variants) {
            for (let substr of array) {
                result.push(substr.concat(variant));
            }
        }
    return result;
}
function getVariants(startIndex, str) {
    let curLevel = [];
    let variants = [];
    i = startIndex;
    while (str[i]) {
        if (str[i] == OPEN) {
            if (startIndex != i) {
                variants = addToArray(variants, str.substring(startIndex, i));
            }
            variants = concatVariants(getVariants(i + 1, str), variants);
            startIndex = i + 1;
        }
        else if (str[i] == CLOSE) {
            if (startIndex != i || !variants.length) {
                variants = concatVariants([str.substring(startIndex, i)], variants);
            }

            curLevel = pushToArray(curLevel, variants);
            return curLevel;
        }
        else if (str[i] == SEPARATOR && str[i + 1] != BLANK) {
            if (startIndex != i) {
                variants = concatVariants([str.substring(startIndex, i)], variants);
            }
            curLevel = pushToArray(curLevel, variants);
            variants = [];
            startIndex = i + 1;
        }
        i++;
    }
    if (!curLevel.length) return variants;
    return curLevel;
}
}


/**
 * Returns the ZigZag matrix
 *
 * The fundamental idea in the JPEG compression algorithm is to sort coefficient of given image by zigzag path and encode it.
 * In this task you are asked to implement a simple method to create a zigzag square matrix.
 * See details at https://en.wikipedia.org/wiki/JPEG#Entropy_coding
 * and zigzag path here: https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/JPEG_ZigZag.svg/220px-JPEG_ZigZag.svg.png
 *
 * @param {number} n - matrix dimension
 * @return {array}  n x n array of zigzag path
 *
 * @example
 *   1  => [[0]]
 *
 *   2  => [[ 0, 1 ],
 *          [ 2, 3 ]]
 *
 *         [[ 0, 1, 5 ],
 *   3  =>  [ 2, 4, 6 ],
 *          [ 3, 7, 8 ]]
 *
 *         [[ 0, 1, 5, 6 ],
 *   4 =>   [ 2, 4, 7,12 ],
 *          [ 3, 8,11,13 ],
 *          [ 9,10,14,15 ]]
 *
 */
function getZigZagMatrix(n) {
    let matrix = [];
    for (let i = 0; i < n; i++)
        matrix[i] = [];

    let i = 0, j = 0;
    const total = n * n;

    for (let num = 0; num < total; num++) {
        matrix[i][j] = num;
        if ((i + j) % 2 == 0) {
            (j + 1 < n) ? j ++ : i += 2;
            if (i > 0) i --;
        } else {
            (i + 1 < n) ? i ++ : j += 2;
            if (j > 0) j --;
        }
    }
    return matrix;
}


/**
 * Returns true if specified subset of dominoes can be placed in a row accroding to the game rules.
 * Dominoes details see at: https://en.wikipedia.org/wiki/Dominoes
 *
 * Each domino tile presented as an array [x,y] of tile value.
 * For example, the subset [1, 1], [2, 2], [1, 2] can be arranged in a row (as [1, 1] followed by [1, 2] followed by [2, 2]),
 * while the subset [1, 1], [0, 3], [1, 4] can not be arranged in one row.
 * NOTE that as in usual dominoes playing any pair [i, j] can also be treated as [j, i].
 *
 * @params {array} dominoes
 * @return {bool}
 *
 * @example
 *
 * [[0,1],  [1,1]] => true
 * [[1,1], [2,2], [1,5], [5,6], [6,3]] => false
 * [[1,3], [2,3], [1,4], [2,4], [1,5], [2,5]]  => true
 * [[0,0], [0,1], [1,1], [0,2], [1,2], [2,2], [0,3], [1,3], [2,3], [3,3]] => false
 *
 */
function canDominoesMakeRow(dominoes) {
    const result = Array(1);
    result[0] = dominoes.shift();

    let lastLength = 0;
    while (lastLength != dominoes.length && dominoes.length > 0) {
        lastLength = dominoes.length;
        for (let i = 0; i < dominoes.length; i++) {
            if (result[result.length - 1][1] == dominoes[i][0] && result[result.length - 1][0] != dominoes[i][1]) {
                result[result.length] = dominoes[i];
                dominoes.splice(i, 1);
            } else if (result[result.length - 1][1] == dominoes[i][1] && result[result.length - 1][0] != dominoes[i][1]) {
                result[result.length] = dominoes[i].reverse();
                dominoes.splice(i, 1);
            }
        }
    };

    return dominoes.length == 0;
}


/**
 * Returns the string expression of the specified ordered list of integers.
 *
 * A format for expressing an ordered list of integers is to use a comma separated list of either:
 *   - individual integers
 *   - or a range of integers denoted by the starting integer separated from the end integer in the range by a dash, '-'.
 *     (The range includes all integers in the interval including both endpoints)
 *     The range syntax is to be used only for, and for every range that expands to more than two values.
 *
 * @params {array} nums
 * @return {bool}
 *
 * @example
 *
 * [ 0, 1, 2, 3, 4, 5 ]   => '0-5'
 * [ 1, 4, 5 ]            => '1,4,5'
 * [ 0, 1, 2, 5, 7, 8, 9] => '0-2,5,7-9'
 * [ 1, 2, 4, 5]          => '1,2,4,5'
 */
function extractRanges(nums) {
    return nums.reduce((res, elem, index) => {
        if (res.length > 0) {
            const last = res[res.length - 1].split('-');
            if (last.length > 1) {
                if (elem - parseInt(last[1]) < 2) {
                    res.pop();
                    res.push(`${last[0]}-${elem}`);
                    return res;
                }
            }

            if (res.length > 1) {
                const beforeLast = res[res.length - 2];
                if (beforeLast.split('-').length == 1 && elem - parseInt(beforeLast) == 2) {
                    res.pop();
                    res.push(`${res.pop()}-${elem}`);
                    return res;
                }
            }
        }
        res.push(elem.toString());
        return res;
}, []).toString();
}

module.exports = {
    createCompassPoints : createCompassPoints,
    expandBraces : expandBraces,
    getZigZagMatrix : getZigZagMatrix,
    canDominoesMakeRow : canDominoesMakeRow,
    extractRanges : extractRanges
};
