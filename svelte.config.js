import adapter from '@sveltejs/adapter-static';

export default {
  kit: {
    adapter: adapter(),
    paths: {
      base: '/webster-js' // <-- Replace with your actual GitHub repo name
    }
  }
};
