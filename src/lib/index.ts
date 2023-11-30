// place files you want to import through the `$lib` alias in this folder.

const supportedAppRegions = ['au', 'uk'] as const;
export type SupportedAppRegion = typeof supportedAppRegions[number];