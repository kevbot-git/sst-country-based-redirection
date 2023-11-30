
export const supportedAppRegions = ['au', 'uk'] as const

export type SupportedRegion = typeof supportedAppRegions[number]

export function supportedAppRegionsInclude(queryRegion: string) {
    return (supportedAppRegions as ReadonlyArray<string>).includes(queryRegion)
}