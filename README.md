# projectrefuge-unsc-mongo-vue
Frontend for ICRC UNSC initiative

## Setup Instructions to Host on AWS Amplify

### Step 1: Create a Cloudformation Template

1. Create a new directory for your Cloudformation template:
   ```sh
   mkdir cloudformation-template
   cd cloudformation-template
   ```

2. Create a `cloudformation-template.yml` file with the following content:
   ```yaml
   AWSTemplateFormatVersion: '2010-09-09'
   Resources:
     LambdaExecutionRole:
       Type: 'AWS::IAM::Role'
       Properties:
         AssumeRolePolicyDocument:
           Version: '2012-10-17'
           Statement:
             - Effect: Allow
               Principal:
                 Service: lambda.amazonaws.com
               Action: 'sts:AssumeRole'
         Policies:
           - PolicyName: LambdaExecutionPolicy
             PolicyDocument:
               Version: '2012-10-17'
               Statement:
                 - Effect: Allow
                   Action:
                     - 'logs:CreateLogGroup'
                     - 'logs:CreateLogStream'
                     - 'logs:PutLogEvents'
                   Resource: '*'
     LambdaFunction:
       Type: 'AWS::Lambda::Function'
       Properties:
         Handler: src/server.handler
         Role: !GetAtt LambdaExecutionRole.Arn
         Code:
           S3Bucket: YOUR_S3_BUCKET_NAME
           S3Key: YOUR_S3_KEY
         Runtime: nodejs14.x
     ApiGateway:
       Type: 'AWS::ApiGateway::RestApi'
       Properties:
         Name: 'projectrefuge-unsc-mongo-vue-api'
     ApiGatewayResource:
       Type: 'AWS::ApiGateway::Resource'
       Properties:
         ParentId: !GetAtt ApiGateway.RootResourceId
         PathPart: '{proxy+}'
         RestApiId: !Ref ApiGateway
     ApiGatewayMethod:
       Type: 'AWS::ApiGateway::Method'
       Properties:
         AuthorizationType: 'NONE'
         HttpMethod: 'ANY'
         ResourceId: !Ref ApiGatewayResource
         RestApiId: !Ref ApiGateway
         Integration:
           IntegrationHttpMethod: 'POST'
           Type: 'AWS_PROXY'
           Uri: !Sub
             - 'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${LambdaFunction.Arn}/invocations'
             - LambdaFunction.Arn: !GetAtt LambdaFunction.Arn
     LambdaPermission:
       Type: 'AWS::Lambda::Permission'
       Properties:
         Action: 'lambda:InvokeFunction'
         FunctionName: !Ref LambdaFunction
         Principal: 'apigateway.amazonaws.com'
   ```

### Step 2: Deploy the Cloudformation Template

1. Package the Cloudformation template:
   ```sh
   aws cloudformation package --template-file cloudformation-template.yml --s3-bucket YOUR_S3_BUCKET_NAME --output-template-file packaged-template.yml
   ```

2. Deploy the Cloudformation stack:
   ```sh
   aws cloudformation deploy --template-file packaged-template.yml --stack-name projectrefuge-unsc-mongo-vue-stack --capabilities CAPABILITY_IAM
   ```

### Step 3: Update Your Front-End Code

1. Update the API endpoint in your Vue.js application:
   Replace the `localhost:3000` URL with the URL provided by API Gateway after deploying the Cloudformation stack.

2. Update the `src/App.vue` file to use the new API endpoint:
   ```javascript
   axios.get(`https://<api-gateway-url>/search?q=${this.query}&limit=${this.limit}`)
   ```

3. Redeploy your front-end application to AWS Amplify.
