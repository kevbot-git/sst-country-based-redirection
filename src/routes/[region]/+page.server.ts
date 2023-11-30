import { supportedAppRegions, supportedAppRegionsInclude } from '$lib/utils.js';
import { error } from '@sveltejs/kit';

/** @type {import('./$types').PageLoad} */
export function load({ params }) {
	if (supportedAppRegionsInclude(params.region)) {
		return { region: params.region };
	}

	throw error(404, `No content for region ${params.region}.`);
}