import * as AWS from "aws-sdk";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { createLogger } from "../utils/logger";
import { ProductItem } from "../models/ProductItem";
import { ProductUpdate } from "../models/ProductUpdate";

const AWSXRay = require("aws-xray-sdk");
const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger("ProductsAccess");

export class ProductsAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly productsTable = process.env.PRODUCTS_TABLE,
    private readonly productCreatedIndex = process.env.PRODUCTS_CREATED_AT_INDEX
  ) {}

  async getAllProducts(userId: string): Promise<ProductItem[]> {
    logger.info("Getting all Products");
    const result = await this.docClient
      .query({
        TableName: this.productsTable,
        IndexName: this.productCreatedIndex,
        KeyConditionExpression: "userId = :pk",
        ExpressionAttributeValues: {
          ":pk": userId,
        },
      })
      .promise();

    const items = result.Items;
    return items as ProductItem[];
  }

  async createProduct(productItem: ProductItem): Promise<ProductItem> {
    logger.info("Create new product");

    await this.docClient
      .put({
        TableName: this.productsTable,
        Item: productItem,
      })
      .promise();

    return productItem;
  }

  async updateProduct(
    productId: String,
    userId: String,
    updateProductItem: ProductUpdate
  ): Promise<ProductUpdate> {
    logger.info("Update product");

    await this.docClient
      .update({
        TableName: this.productsTable,
        Key: {
          productId: productId,
          userId: userId,
        },
        UpdateExpression:
          "set #product_name = :name, dueDate = :dueDate, done = :done",
        ExpressionAttributeNames: {
          "#product_name": "name",
        },
        ExpressionAttributeValues: {
          ":name": updateProductItem.name,
          ":dueDate": updateProductItem.dueDate,
          ":done": updateProductItem.done,
        },
      })
      .promise();

    return updateProductItem;
  }

  async deleteProduct(productId: String, userId: String) {
    if (userId) {
      logger.info(`Deleting product ${userId}`);

      await this.docClient
        .delete(
          {
            TableName: this.productsTable,
            Key: {
              productId: productId,
              userId: userId,
            },
          },
          (err) => {
            if (err instanceof Error) {
              logger.info(`Cannot delete product ${err}`);
              throw new Error(`Cannot delete product ${err}`);
            }
          }
        )
        .promise();
      logger.info(`Successful delete product ${userId}`);
    } else {
      logger.info(`Cannot delete product ${userId}`);
    }
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
