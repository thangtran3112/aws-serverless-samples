import { CfnOutput, Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as elbv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";

export class EcsWithEc2LaunchTypeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, {
      ...props,
    });

    const vpc = new ec2.Vpc(this, `${id}_Vpc`, { maxAzs: 2 });

    const cluster = new ecs.Cluster(this, `${id}_EcsCluster`, { vpc });
    cluster.addCapacity("DefaultAutoScalingGroup", {
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
    });

    // Create Task Definition
    const taskDefinition = new ecs.Ec2TaskDefinition(this, `${id}_TaskDef`);
    const container = taskDefinition.addContainer(`${id}_web`, {
      image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      memoryLimitMiB: 512,
    });

    container.addPortMappings({
      containerPort: 80,
      hostPort: 8080,
      protocol: ecs.Protocol.TCP,
    });

    // Create Service
    const service = new ecs.Ec2Service(this, `${id}_Service`, {
      cluster,
      taskDefinition,
    });

    // Create ALB
    const lb = new elbv2.ApplicationLoadBalancer(this, `${id}_LB`, {
      vpc,
      internetFacing: true,
    });
    const listener = lb.addListener(`${id}_PublicListener`, {
      port: 80,
      open: true,
    });

    // Attach ALB to ECS Service
    listener.addTargets(`${id}_ECS`, {
      port: 8080,
      targets: [
        service.loadBalancerTarget({
          containerName: `${id}_web`,
          containerPort: 80,
        }),
      ],
      // include health check (default is none)
      healthCheck: {
        interval: Duration.seconds(60),
        path: "/health",
        timeout: Duration.seconds(5),
      },
    });

    new CfnOutput(this, `${id}_LoadBalancerDNS`, {
      value: lb.loadBalancerDnsName,
    });
  }
}
