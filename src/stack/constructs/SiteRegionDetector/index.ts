import { Construct } from "constructs";
import { RedirectFunction } from './RedirectFunction';
import type { RegionToCountryMap, Site } from './types';
import { addBehaviorToSiteDistribution } from "./addBehaviourToSiteDistribution";

interface SiteRegionDetectorConfig<TSupportedRegion extends string> {
    site: Site,
    /**
     * @example mapRegionsToCountries()
     */
    regionToCountryMap: RegionToCountryMap<TSupportedRegion>,
}

/**
 * Hint: Pass union type of supported app regions for type-safety in regionToCountryMap
 */
export class SiteRegionDetector<TSupportedRegion extends string> extends Construct {
    readonly cdk: { redirectFunction: RedirectFunction<TSupportedRegion> };

    constructor(scope: Construct, id: string, { site, regionToCountryMap }: SiteRegionDetectorConfig<TSupportedRegion>) {
        super(scope, id);

        const redirectFunction = new RedirectFunction(scope, `${id}Function`, regionToCountryMap);
        this.cdk = { redirectFunction };

        addBehaviorToSiteDistribution({ site, redirectFunction });
    }
}