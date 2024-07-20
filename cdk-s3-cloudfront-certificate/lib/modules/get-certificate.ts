import { Construct } from "constructs";
import { Certificate } from "aws-cdk-lib/aws-certificatemanager";

interface StackProps {
  domainName: string;
}

export class GetCertificate {
  cert: Certificate;

  constructor(scope: Construct, props: StackProps) {
    const certificateArns = require("./../config/certificate-arns.json");
    const certificateArn = certificateArns[props.domainName];
    if (!certificateArn) {
      throw new Error(
        `Certificate ARN not found for domain name ${props.domainName}`
      );
    }

    const certName = `${props.domainName}-Cert`;

    this.cert = Certificate.fromCertificateArn(
      scope,
      certName,
      certificateArn
    ) as Certificate;
  }
}
