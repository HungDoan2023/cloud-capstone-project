import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";

const AWSXRay = require("aws-xray-sdk");
const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger("Attach file storage");

export class AttachmentUtils {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly productsTable = process.env.PRODUCTS_TABLE
  ) {}

  async updateAttachmentUrl(
    productId: string,
    userId: string,
    url: string
  ): Promise<string> {
    logger.info("Update attachment url of PRODUCT");

    await this.docClient
      .update({
        TableName: this.productsTable,
        Key: {
          productId: productId,
          userId: userId,
        },
        UpdateExpression: "set attachmentUrl = :url",
        ExpressionAttributeValues: {
          ":url": url,
        },
      })
      .promise();

    return url;
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    logger.info("Creating a local DynamoDB instance");

    return new XAWS.DynamoDB.DocumentClient({
      region: "localhost",
      endpoint: "http://localhost:8000",
    });
  }

  return new XAWS.DynamoDB.DocumentClient();
}
