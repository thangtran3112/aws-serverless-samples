import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";
import {
  CloudFrontWebDistribution,
  HttpVersion,
  OriginAccessIdentity,
  PriceClass,
  ViewerCertificate,
  ViewerProtocolPolicy,
} from "aws-cdk-lib/aws-cloudfront";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";

interface StackProps {
  domainName: string;
  cert: Certificate;
  cfDistributionName: string;
  accessIdentity: OriginAccessIdentity;
  siteBucket: Bucket;
}

export class CreateCFDistribution {
  cfDist: CloudFrontWebDistribution;

  constructor(scope: Construct, props: StackProps) {
    const ROOT_INDEX_FILE = "index.html";
    const PROD_FOLDER = props.domainName;
    this.cfDist = new CloudFrontWebDistribution(
      scope,
      props.cfDistributionName,
      {
        comment: "CDK Cloudfront S3",
        viewerCertificate: ViewerCertificate.fromAcmCertificate(props.cert, {
          aliases: [props.domainName],
        }),
        defaultRootObject: ROOT_INDEX_FILE,
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        httpVersion: HttpVersion.HTTP2,
        priceClass: PriceClass.PRICE_CLASS_100, // the cheapest
        originConfigs: [
          {
            s3OriginSource: {
              originAccessIdentity: props.accessIdentity,
              s3BucketSource: props.siteBucket,
              originPath: `/${PROD_FOLDER}`,
            },
            behaviors: [
              {
                compress: true,
                isDefaultBehavior: true,
              },
            ],
          },
        ],
        // Allow SPA (React, Vue, etc.) to handle all errors internally
        errorConfigurations: [
          {
            errorCachingMinTtl: 300, // in seconds
            errorCode: 403,
            responseCode: 200,
            responsePagePath: `/${ROOT_INDEX_FILE}`,
          },
          {
            errorCachingMinTtl: 300, // in seconds
            errorCode: 404,
            responseCode: 200,
            responsePagePath: `/${ROOT_INDEX_FILE}`,
          },
        ],
      }
    );
  }
}
