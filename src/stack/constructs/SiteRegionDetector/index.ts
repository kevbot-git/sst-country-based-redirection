import { Construct } from "constructs";
import { Function, FunctionCode } from 'aws-cdk-lib/aws-cloudfront';
import cloudfrontOrigins from 'aws-cdk-lib/aws-cloudfront-origins';
import type { StaticSite } from 'sst/constructs';
import { RedirectFunction } from './RedirectFunction';
import type { RegionToCountryMap } from './types';
import { addBehaviorToSiteDistribution } from "./addBehaviourToSiteDistribution";

interface SiteRegionDetectorConfig<TSupportedRegion extends string> {
    site: StaticSite,
    /**
     * @example mapRegionsToCountries()
     */
    regionToCountryMap: RegionToCountryMap<TSupportedRegion>,
}

export class SiteRegionDetector<TSupportedRegion extends string> extends Construct {
    constructor(scope: Construct, id: string, { site, regionToCountryMap }: SiteRegionDetectorConfig<TSupportedRegion>) {
        super(scope, id);

        const redirectFunction = new RedirectFunction(scope, `${id}Function`, regionToCountryMap);

        addBehaviorToSiteDistribution({ site, redirectFunction });
    }
}