# projectrefuge-unsc-mongo-vue
Frontend for ICRC UNSC initiative

## Setup Instructions to Host on AWS Amplify

### Step 1: Create a Serverless Function

1. Create a new directory for your Lambda function:
   ```sh
   mkdir lambda-function
   cd lambda-function
   ```

2. Initialize a new Node.js project:
   ```sh
   npm init -y
   ```

3. Install necessary dependencies:
   ```sh
   npm install express serverless-http mongodb
   ```

4. Create a `serverless.yml` file with the following content:
   ```yaml
   service: projectrefuge-unsc-mongo-vue

   provider:
     name: aws
     runtime: nodejs14.x
     region: us-east-1

   functions:
     app:
       handler: src/server.handler
       events:
         - http:
             path: /
             method: any
         - http:
             path: /{proxy+}
             method: any

   plugins:
     - serverless-offline

   custom:
     serverless-offline:
       port: 3000

   resources:
     Resources:
       MongoDBAccessRole:
         Type: AWS::IAM::Role
         Properties:
           AssumeRolePolicyDocument:
             Version: '2012-10-17'
             Statement:
               - Effect: Allow
                 Principal:
                   Service: lambda.amazonaws.com
                 Action: sts:AssumeRole
           Policies:
             - PolicyName: MongoDBAccessPolicy
               PolicyDocument:
                 Version: '2012-10-17'
                 Statement:
                   - Effect: Allow
                     Action:
                       - "secretsmanager:GetSecretValue"
                     Resource: "*"
   ```

### Step 2: Deploy the Serverless Function

1. Install the Serverless Framework globally:
   ```sh
   npm install -g serverless
   ```

2. Deploy the function:
   ```sh
   serverless deploy
   ```

### Step 3: Update Your Front-End Code

1. Update the API endpoint in your Vue.js application:
   Replace the `localhost:3000` URL with the URL provided by API Gateway after deploying the serverless function.

2. Update the `src/App.vue` file to use the new API endpoint:
   ```javascript
   axios.get(`https://<api-gateway-url>/search?q=${this.query}&limit=${this.limit}`)
   ```

3. Redeploy your front-end application to AWS Amplify.
