export declare type RegionToCountryMap<SupportedRegion extends string> = {
    [SR in SupportedRegion]?: Iso3166Alpha2Code[]
} & { fallback: SupportedRegion }