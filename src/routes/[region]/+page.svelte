<script lang="ts">
    import type { PageData } from './$types';
	// export let route: RouteParams;
    export let data: PageData;
</script>

<h1>Welcome to my site!</h1>

<p>
    This is an example of regional content for the <strong>{data.region}</strong> region.
</p>

<p>
    <span>Go <a href="/">back to the root</a> of the site</span>
</p>