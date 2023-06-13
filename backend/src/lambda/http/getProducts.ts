import "source-map-support/register";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as middy from "middy";
import { cors } from "middy/middlewares";
import { getAllProducts } from "../../helpers/product";
import { getUserId } from "../utils";

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event);
    const PRODUCTs = await getAllProducts(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        items: PRODUCTs,
      })
    }
  }
);

handler.use(
  cors({
    credentials: true,
  })
);
