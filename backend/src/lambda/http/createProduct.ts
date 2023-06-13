import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateProductRequest } from '../../requests/CreateProductRequest'
import { getUserId } from '../utils';
import { createProduct } from '../../helpers/product'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newProduct: CreateProductRequest = JSON.parse(event.body)
    const userId = getUserId(event)
    const productResult = await createProduct(userId, newProduct)
    
    return {
      statusCode: 201,
      body: JSON.stringify({
        item: productResult
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
