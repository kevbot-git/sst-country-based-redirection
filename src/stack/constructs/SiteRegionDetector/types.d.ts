import type { Iso3166Alpha2Code } from "iso-3166-ts";
import type { StaticSite, SvelteKitSite } from "sst/constructs"

export declare type RegionToCountryMap<SupportedRegion extends string> = {
    [SR in SupportedRegion]?: Iso3166Alpha2Code[]
} & { fallback: SupportedRegion }

export declare type Site = StaticSite | SvelteKitSite;