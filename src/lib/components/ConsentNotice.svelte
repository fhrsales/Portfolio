<script>
	// A small notice for the analytics cookies. Until someone accepts, Google Analytics
	// counts visits without cookies (consent mode); the choice is remembered on this device.
	import { onMount } from 'svelte';
	import { language } from '$lib/i18n';

	let visible = false;

	onMount(() => {
		let stored = null;
		try {
			stored = localStorage.getItem('analytics-consent');
		} catch {
			/* private mode: ask every visit */
		}
		visible = !stored;
	});

	function choose(value) {
		try {
			localStorage.setItem('analytics-consent', value);
		} catch {
			/* nothing to remember it in */
		}
		if (typeof window.gtag === 'function') {
			window.gtag('consent', 'update', { analytics_storage: value });
		}
		visible = false;
	}

	$: text =
		$language === 'pt'
			? {
					body: 'Este site usa cookies do Google Analytics para contar visitas. Nada de publicidade.',
					accept: 'Aceitar',
					decline: 'Recusar'
				}
			: {
					body: 'This site uses Google Analytics cookies to count visits. No advertising.',
					accept: 'Accept',
					decline: 'Decline'
				};
</script>

{#if visible}
	<div class="consent" role="region" aria-label={$language === 'pt' ? 'Cookies' : 'Cookies'}>
		<p>{text.body}</p>
		<div class="actions">
			<button type="button" class="decline" on:click={() => choose('denied')}>{text.decline}</button>
			<button type="button" class="accept" on:click={() => choose('granted')}>{text.accept}</button>
		</div>
	</div>
{/if}

<style>
	.consent {
		position: fixed;
		left: 16px;
		right: 16px;
		bottom: 16px;
		z-index: 1000;
		max-width: 520px;
		margin: 0 auto;
		display: flex;
		align-items: center;
		gap: 16px;
		padding: 12px 14px 12px 18px;
		background: var(--color-light);
		color: var(--color-dark);
		border-radius: 10px;
		box-shadow: 0 6px 28px rgba(0, 0, 0, 0.18);
		font: 400 14px/1.4 var(--font-primary);
	}
	p {
		margin: 0;
		flex: 1;
	}
	.actions {
		display: flex;
		gap: 6px;
		flex-shrink: 0;
	}
	button {
		font: 600 13px var(--font-primary);
		border: 0;
		border-radius: 6px;
		padding: 9px 12px;
		min-height: 36px;
		cursor: pointer;
	}
	.decline {
		background: transparent;
		color: var(--color-dark);
	}
	.accept {
		background: var(--color-primary);
		color: var(--color-on-primary);
	}
	@media (max-width: 480px) {
		.consent {
			flex-direction: column;
			align-items: stretch;
			gap: 10px;
		}
		.actions {
			justify-content: flex-end;
		}
	}
</style>
