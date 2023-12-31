import { ProductsAccess } from "./productsAccess";
import { AttachmentUtils } from "./attachmentUtils";
import { ProductUpdate } from "../models/ProductUpdate";
import { ProductItem } from "../models/ProductItem";
import { CreateProductRequest } from "../requests/CreateProductRequest";
import { UpdateProductRequest } from "../requests/UpdateProductRequest";
import { createLogger } from "../utils/logger";
import * as uuid from "uuid";
import * as AWS from "aws-sdk";

const logger = createLogger("PRODUCTs business logic");
const s3 = new AWS.S3({
  signatureVersion: "v4",
});

const bucketName = process.env.ATTACHMENT_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const productAccess = new ProductsAccess();
const attachmentUtils = new AttachmentUtils();

export async function getAllProducts(userId: string): Promise<ProductItem[]> {
  return productAccess.getAllProducts(userId);
}

export async function createProduct(
  userId: string,
  createProductRequest: CreateProductRequest
): Promise<ProductItem> {
  const itemId = uuid.v4();

  return await productAccess.createProduct({
    productId: itemId,
    userId: userId,
    name: createProductRequest.name,
    dueDate: createProductRequest.dueDate,
    createdAt: new Date().toISOString(),
    done: false,
  });
}

export async function updateProduct(
  productId: string,
  userId: string,
  updateProductRequest: UpdateProductRequest
): Promise<ProductUpdate> {
  return await productAccess.updateProduct(productId, userId, {
    name: updateProductRequest.name,
    dueDate: updateProductRequest.dueDate,
    done: updateProductRequest.done,
  });
}

export async function deleteProduct(productId: string, userId: string) {
  await productAccess.deleteProduct(productId, userId);
}

export async function createAttachmentPresignedUrl(
  productId: string,
  userId: string
) {
  logger.info("create attachment presigned url");
  const imageId = uuid.v4();
  const url = `https://${bucketName}.s3.amazonaws.com/${imageId}`;
  await attachmentUtils.updateAttachmentUrl(productId, userId, url);
  return getUploadUrl(imageId);
}

function getUploadUrl(imageId: string) {
  logger.info("get upload url");
  logger.info("urlExpiration:", urlExpiration);
  return s3.getSignedUrl("putObject", {
    Bucket: bucketName,
    Key: imageId,
    Expires: Number(urlExpiration),
  });
}
