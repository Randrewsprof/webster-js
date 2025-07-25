<script>
    import { onMount } from "svelte";
    import { loadWords, filterWordsFromList } from "$lib/wordlist.js";
    import LetterColorButton from "$lib/LetterColorButton.svelte";

    let allWords = [];
    let filteredWords = [];
    let currentGuess = ["", "", "", "", ""];
    let currentColors = ["gray", "gray", "gray", "gray", "gray"];
    let guesses = [];
    let inputValue = "";

    onMount(async () => {
        allWords = await loadWords();
        filteredWords = allWords;
    });

    function submitGuess() {
        guesses = [
            ...guesses,
            { guess: [...currentGuess], colors: [...currentColors] },
        ];

        filteredWords = guesses.reduce((acc, { guess, colors }) => {
            const result = filterWordsFromList(acc, guess, colors);
            return result;
        }, allWords);

        currentGuess = ["", "", "", "", ""];
        currentColors = ["gray", "gray", "gray", "gray", "gray"];
        inputValue = "";
    }

    function setLetter(index, value) {
        currentGuess[index] = value.toLowerCase().slice(0, 1);
    }

    function setColor(index, newColor) {
        currentColors[index] = newColor;
    }
    function reset() {
        currentGuess = ["", "", "", "", ""];
        currentColors = ["gray", "gray", "gray", "gray", "gray"];
        guesses = [];
        filteredWords = allWords;
        inputValue = "";
    }
</script>

<h2>Webster</h2>

<div style="display: flex; gap: 0.5em;">
    <input
        type="text"
        bind:value={inputValue}
        on:input={(e) => {
            const value = e.target.value.toUpperCase().slice(0, 5);
            currentGuess = Array.from({ length: 5 }, (_, i) => value[i] || "");
        }}
        maxlength="5"
        style="width: 10em; text-transform: uppercase;"
        placeholder="Enter guess"
    />
</div>

<div style="display: flex; gap: 0.5em; margin-top: 1em; margin-bottom: 1em;">
    {#each currentGuess as letter, i}
        <LetterColorButton
            {letter}
            color={currentColors[i]}
            onChange={(newColor) => setColor(i, newColor)}
        />
    {/each}
</div>

<button on:click={submitGuess} disabled={currentGuess.some((l) => l === "")}>
    Add Guess
</button>

<button on:click={reset} style="margin-left: 0.5em;"> Reset </button>
<div style="margin-top: 1em;">
    <h3>Past Guesses:</h3>
    <ul>
        {#each guesses as { guess, colors }, index}
        <li>
        {#each guess as letter, index}
                <span style="background-color: {colors[index] === 'gray' ? '#e8e8e8' : colors[index] === 'yellow' ? '#c9b458' : '#6aaa64'};">
                    {letter}
                </span>
        {/each}
        </li>
        {/each}
    </ul>
</div>
<h3>Possible Words: {filteredWords.length}</h3>
<ul>
    {#each filteredWords as word}
        <li>{word}</li>
    {/each}
</ul>
