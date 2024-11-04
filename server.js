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
        S3Bucket: rf-unsc-icrc-infrabucket
        S3Key: function.zip
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
          - 'arn:aws:apigateway:${AWS::Region}:lambda:path/2015-03-31/functions/${LambdaFunctionArn}/invocations'
          - LambdaFunctionArn: !GetAtt LambdaFunction.Arn
  LambdaPermission:
    Type: 'AWS::Lambda::Permission'
    Properties:
      Action: 'lambda:InvokeFunction'
      FunctionName: !Ref LambdaFunction
      Principal: 'apigateway.amazonaws.com'
Outputs:
  ApiUrl:
    Description: "API Gateway endpoint URL for Prod environment"
    Value: !Sub "https://${ApiGateway}.execute-api.${AWS::Region}.amazonaws.com/prod"