import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors, httpErrorHandler } from "middy/middlewares";
import { deleteProduct } from "../../helpers/product";
import { getUserId } from "../utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const PRODUCTId = event.pathParameters.PRODUCTId;
    const userId = getUserId(event);

    await deleteProduct(PRODUCTId, userId);

    return {
      statusCode: 201,
      body: JSON.stringify({}),
    };
  }
);

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true,
  })
);
