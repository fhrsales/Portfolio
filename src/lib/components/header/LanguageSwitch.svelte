<script>
 import { language } from '$lib/i18n';
</script>
        <div class="language-switch" role="group" aria-label="Idioma / Language">
            <button type="button" lang="pt-BR" aria-label="PT, Português" aria-pressed={$language === 'pt'} on:click={() => language.set('pt')}>PT</button>
            <button type="button" lang="en" aria-label="EN, English" aria-pressed={$language === 'en'} on:click={() => language.set('en')}>EN</button>
        </div>
<style>
    .language-switch { display: flex; gap: 2px; margin-left: 4px; flex-shrink: 0; }
    /* round, like the theme toggle beside it */
    .language-switch button { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; font: 600 12px var(--font-primary); color: var(--color-dark); background: transparent; border: 0; border-radius: 50%; padding: 0; cursor: pointer; }
    .language-switch button:hover,
    .language-switch button:focus-visible { background: color-mix(in srgb, var(--color-dark) 8%, transparent); outline: none; }
    .language-switch button[aria-pressed="true"] { color: var(--color-on-primary); background: var(--color-primary); }
    .language-switch button[aria-pressed="true"]:hover,
    .language-switch button[aria-pressed="true"]:focus-visible { background: color-mix(in srgb, var(--color-primary) 85%, var(--color-dark)); }
</style>
