<script>
 import { language } from '$lib/i18n';
</script>
        <div class="language-switch" role="group" aria-label="Idioma / Language">
            <button type="button" lang="pt-BR" aria-label="Português" aria-pressed={$language === 'pt'} on:click={() => language.set('pt')}>PT</button>
            <button type="button" lang="en" aria-label="English" aria-pressed={$language === 'en'} on:click={() => language.set('en')}>EN</button>
        </div>
<style>
    .language-switch { display: flex; gap: 4px; margin-left: 4px; flex-shrink: 0; }
    .language-switch button { font: 600 12px var(--font-primary); color: var(--color-dark); background: transparent; border: 0; border-radius: 4px; padding: 7px 5px; cursor: pointer; }
    /* larger touch targets only where fingers are used, so the desktop header keeps its one line */
    @media (pointer: coarse) { .language-switch button { min-width: 36px; min-height: 36px; } }
    .language-switch button[aria-pressed="true"] { color: var(--color-on-primary); background: var(--color-primary); }
</style>
