import { Construct } from "constructs";
import {
  Certificate,
  CertificateValidation,
} from "aws-cdk-lib/aws-certificatemanager";
import * as certificateArns from "../config/certificate-arns.json";

interface StackProps {
  certName: string;
  domainName: string;
}

export class CreateCertificate {
  cert: Certificate;

  constructor(scope: Construct, props: StackProps) {
    // This step is critical as it will halt the deployment process until you input the relevant CNAME records via your domain registrar.
    // Please ensure that you visit the following link: https://us-east-1.console.aws.amazon.com/acm/home?region=us-east-1#/certificates
    // Here, you can find the specific CNAME records that need to be incorporated.
    // It's worth noting that if you're utilizing Route53, you can conveniently skip this step. More details can be found in the following documentation:
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudfront-readme.html#domain-names-and-certificates
    this.cert = new Certificate(scope, props.certName, {
      certificateName: props.certName,
      domainName: props.domainName,
      validation: CertificateValidation.fromDns(),
    });

    // update certificate-arns.json
    // @ts-ignore
    certificateArns[props.domainName] = this.cert.certificateArn;
    require("fs").writeFileSync(
      __dirname + "/../config/certificate-arns.json",
      JSON.stringify(certificateArns, null, 2)
    );
  }
}
