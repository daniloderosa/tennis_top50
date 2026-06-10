import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

// Config minimale: serve anche al language server di VS Code, che senza
// questo file tenta di leggere la config da vite.config.js via API CJS
// di Vite (rimossa) e mostra un falso errore sui file .svelte.
export default {
  preprocess: vitePreprocess(),
};
