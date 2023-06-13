import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { updateProduct } from '../../helpers/product'
import { UpdateProductRequest } from '../../requests/UpdateProductRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const productId = event.pathParameters.productId
    const updatedProduct: UpdateProductRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const updatedProductItem = await updateProduct(productId, userId, updatedProduct);

    return {
      statusCode: 200,
      body: JSON.stringify({
        updatedProductItem
      })
    };
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
