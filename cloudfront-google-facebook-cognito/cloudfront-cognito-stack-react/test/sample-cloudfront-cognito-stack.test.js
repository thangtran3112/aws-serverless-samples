"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cdk = require("aws-cdk-lib");
const assertions_1 = require("aws-cdk-lib/assertions");
const SampleCloudfrontCognitoStack = require("../lib/InfrastructureStack");
test('SQS Queue and SNS Topic Created', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new SampleCloudfrontCognitoStack.SampleCloudfrontCognitoStackStack(app, 'MyTestStack');
    // THEN
    const template = assertions_1.Template.fromStack(stack);
    template.hasResourceProperties('AWS::SQS::Queue', {
        VisibilityTimeout: 300
    });
    template.resourceCountIs('AWS::SNS::Topic', 1);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlLWNsb3VkZnJvbnQtY29nbml0by1zdGFjay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2FtcGxlLWNsb3VkZnJvbnQtY29nbml0by1zdGFjay50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQW1DO0FBQ25DLHVEQUF5RDtBQUN6RCwyRUFBMkU7QUFFM0UsSUFBSSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtJQUMzQyxNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUMxQixPQUFPO0lBQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSw0QkFBNEIsQ0FBQyxpQ0FBaUMsQ0FBQyxHQUFHLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDckcsT0FBTztJQUVQLE1BQU0sUUFBUSxHQUFHLHFCQUFRLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRTNDLFFBQVEsQ0FBQyxxQkFBcUIsQ0FBQyxpQkFBaUIsRUFBRTtRQUNoRCxpQkFBaUIsRUFBRSxHQUFHO0tBQ3ZCLENBQUMsQ0FBQztJQUNILFFBQVEsQ0FBQyxlQUFlLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDakQsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHsgVGVtcGxhdGUsIE1hdGNoIH0gZnJvbSAnYXdzLWNkay1saWIvYXNzZXJ0aW9ucyc7XG5pbXBvcnQgKiBhcyBTYW1wbGVDbG91ZGZyb250Q29nbml0b1N0YWNrIGZyb20gJy4uL2xpYi9JbmZyYXN0cnVjdHVyZVN0YWNrJztcblxudGVzdCgnU1FTIFF1ZXVlIGFuZCBTTlMgVG9waWMgQ3JlYXRlZCcsICgpID0+IHtcbiAgY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcbiAgLy8gV0hFTlxuICBjb25zdCBzdGFjayA9IG5ldyBTYW1wbGVDbG91ZGZyb250Q29nbml0b1N0YWNrLlNhbXBsZUNsb3VkZnJvbnRDb2duaXRvU3RhY2tTdGFjayhhcHAsICdNeVRlc3RTdGFjaycpO1xuICAvLyBUSEVOXG5cbiAgY29uc3QgdGVtcGxhdGUgPSBUZW1wbGF0ZS5mcm9tU3RhY2soc3RhY2spO1xuXG4gIHRlbXBsYXRlLmhhc1Jlc291cmNlUHJvcGVydGllcygnQVdTOjpTUVM6OlF1ZXVlJywge1xuICAgIFZpc2liaWxpdHlUaW1lb3V0OiAzMDBcbiAgfSk7XG4gIHRlbXBsYXRlLnJlc291cmNlQ291bnRJcygnQVdTOjpTTlM6OlRvcGljJywgMSk7XG59KTtcbiJdfQ==