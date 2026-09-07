<script>
	import { base } from '$app/paths';
	import { page } from '$app/stores';
	import ArchieRenderer from '$lib/components/ArchieRenderer.svelte';
	import ScrollerVideo from '$lib/components/ScrollerVideo.svelte';

	const tapuiTexts = [
		{ at: 0.14, text: '<strong>A few fragments are evidence.<br>Not an image.</strong>', class: 'headline' },
		{ at: 0.48, text: '<strong>Design connects what science knows<br>with what people can understand.</strong>', class: 'headline' },
		{ at: 0.82, text: '<strong>The reconstruction becomes<br>a hypothesis you can see.</strong>', class: 'headline' }
	];
</script>

{#if $page.params.slug === 'archive'}
	<section class="tapui-feature">
		<div class="tapui-intro">
			<p class="eyebrow">Scrollytelling / Information Design</p>
			<h2>Tapuiassauro — From evidence to understanding</h2>
			<p>The reconstruction was not illustration added after the reporting. It turned fragments, measurements, and scientific inference into something readers could understand.</p>
		</div>
		<ScrollerVideo
			src={`${base}/videos/tapui-scrolly.mp4`}
			srcMobile={`${base}/videos/tapui-scrolly.mp4`}
			srcDesktop={`${base}/videos/tapui-scrolly.mp4`}
			size="GG"
			texts={tapuiTexts}
			showGuide={false}
			height="360vh"
			objectFit="cover"
			showVignette={true}
		/>
	</section>
{/if}

<ArchieRenderer {base} />

<style>
	.tapui-feature {
		width: 100%;
		margin: 5rem auto 7rem;
	}
	.tapui-intro {
		width: min(720px, calc(100% - 40px));
		margin: 0 auto 2rem;
	}
	.tapui-intro .eyebrow {
		font-size: 0.82rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		opacity: 0.58;
		margin: 0 0 0.8rem;
	}
	.tapui-intro h2 {
		font-size: clamp(2rem, 5vw, 4.5rem);
		line-height: 0.98;
		letter-spacing: -0.045em;
		margin: 0 0 1.2rem;
	}
	.tapui-intro p:last-child {
		font-size: clamp(1rem, 1.6vw, 1.25rem);
		line-height: 1.5;
		max-width: 640px;
		opacity: 0.78;
	}
</style>
