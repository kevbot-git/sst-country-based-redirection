import type { CloudFrontRequestEvent } from 'aws-lambda';

export const handler = async (event: CloudFrontRequestEvent) => {
    const request = event.Records[0].cf.request;
    const requestCountry = request.headers['cloudfront-viewer-country'];
    const host = request.headers.host?.[0]?.value;

    console.log('host', host);
    console.log('got viewer country!', requestCountry);
    console.log('request uri is', request.uri);

    // // This is what SST uses under the hood
    // if (request.uri.startsWith('/.well-known/')) {
    //     return request;
    // }

    // if (request.uri.endsWith('/')) {
    //     request.uri += 'index.html';
    // } else if (!(request.uri.split('/').pop() || '').includes('.')) {
    //     request.uri += '.html';
    // }

    // request.querystring = `?country=${requestCountry || 'unknown'}`

    // if (requestCountry) {
    //     return {
    //         status: 302,
    //         statusDescription: 'Found',
    //         headers: {
    //             location: {
    //                 value: `https://${host}/${requestCountry}/index.html`
    //             }
    //         }
    //     }
    // }

    return request
}