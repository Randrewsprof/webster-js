// $lib/wordlist.js

let cachedWords = null;

/**
 * Load words from a text file or API endpoint
 * In Svelte/web context, you'll need to either:
 * 1. Put words.txt in your static/ folder and fetch it
 * 2. Import words as a JS module
 * 3. Fetch from an API
 */
export async function loadWords() {
    const response = await fetch('/words.txt');
    const text = await response.text();

    cachedWords = text
        .split('\n')
        .map(word => word.trim())
        .filter(word => word.length === 5) // Changed from 6 to 5 for typical Wordle
        .map(word => word.toUpperCase());

    return cachedWords;
}
/**
 * Filter words based on guess and colors
 * @param {string} guess - The guessed word (5 letters)
 * @param {string[]} colors - Array of colors: ['green', 'yellow', 'gray', ...]
 * @returns {Promise<string[]>} - Filtered list of words
 */
export async function filterWords(guess, colors) {
    const words = await loadWords();
    return filterWordsFromList(words, guess, colors);
}

/**
 * Filter a given word list based on guess and colors
 * @param {string[]} wordList - List of words to filter
 * @param {string|string[]} guess - The guessed word (string or array of letters)
 * @param {string[]} colors - Array of colors: ['green', 'yellow', 'gray', ...]
 * @returns {string[]} - Filtered list of words
 */
export function filterWordsFromList(wordList, guess, colors) {
    const guessLetters = Array.isArray(guess) ? guess : guess.split('');

    console.log('Starting filter with', wordList.length, 'words');

    return wordList.filter(word => {
        const wordLetters = word.split('');

        // Check each position in the guess
        const passes = guessLetters.every((letter, index) => {
            const color = colors[index];

            switch (color) {
                case 'green':
                    const greenPass = wordLetters[index] === letter;
                    if (!greenPass) console.log(`${word} failed green check: position ${index} should be ${letter}, got ${wordLetters[index]}`);
                    return greenPass;

                case 'yellow':
                    const yellowPass = wordLetters.includes(letter) && wordLetters[index] !== letter;
                    if (!yellowPass) console.log(`${word} failed yellow check: should contain ${letter} but not at position ${index}`);
                    return yellowPass;

                case 'gray':
                    const hasOtherPosition = guessLetters.some((l, i) =>
                        l === letter &&
                        ['green', 'yellow'].includes(colors[i]) &&
                        i !== index
                    );

                    let grayPass;
                    if (hasOtherPosition) {
                        grayPass = wordLetters[index] !== letter;
                        if (!grayPass) console.log(`${word} failed gray check: ${letter} shouldn't be at position ${index}`);
                    } else {
                        grayPass = !wordLetters.includes(letter);
                        if (!grayPass) console.log(`${word} failed gray check: shouldn't contain ${letter} at all`);
                    }
                    return grayPass;

                default:
                    return true;
            }
        });

        return passes;
    });
}