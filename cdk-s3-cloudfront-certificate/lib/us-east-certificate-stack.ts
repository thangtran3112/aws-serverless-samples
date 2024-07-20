import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { CreateCertificate } from "./modules/create-certificate";
import { WEBSITES } from "./config/websites";

export interface CreateCertificateProps {
  certName: string;
  domainName: string;
}

export class UsEastCertificateStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, {
      ...props,
    });

    const domainNames = WEBSITES.map((website) => website.domain);
    const uniqueDomainNames = [...new Set(domainNames)];

    for (const domainName of uniqueDomainNames) {
      const certName = `${domainName}-Cert`;
      this.createCertificate({ certName, domainName });
    }
  }

  createCertificate(props: CreateCertificateProps) {
    return new CreateCertificate(this, {
      domainName: props.domainName,
      certName: props.certName,
    }).cert;
  }
}
