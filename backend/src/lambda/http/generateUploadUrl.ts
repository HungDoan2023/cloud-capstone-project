import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";
import { createAttachmentPresignedUrl } from "../../helpers/product";
import { getUserId } from "../utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const productId = event.pathParameters.productId;
    const userId = getUserId(event);
    const uploadUrl = await createAttachmentPresignedUrl(productId, userId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        uploadUrl
      }),
    };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
