<script>
  import { createEventDispatcher } from 'svelte';
  
  export let letter = '';
  export let color = 'gray';
  export let onChange = () => {}; // This should match what your parent passes

  const colors = ['gray', 'yellow', 'green'];
  const dispatch = createEventDispatcher();

  function cycleColor() {
    const currentIndex = colors.indexOf(color);
    const nextIndex = (currentIndex + 1) % colors.length;
    const newColor = colors[nextIndex];
    
    // Call the parent's onChange function
    onChange(newColor);
    
    // Also dispatch an event (in case you want to use both patterns)
    dispatch('change', newColor);
  }
</script>

<button
  on:click={cycleColor}
  style="
    width: 2em;
    height: 2em;
    text-transform: uppercase;
    background-color: {color === 'gray' ? '#787c7e' : color === 'yellow' ? '#c9b458' : '#6aaa64'};
    color: white;
    border: 1px solid black;
    cursor: pointer;
  "
>
  {letter}
</button>