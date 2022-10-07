/* Amplify Params - DO NOT EDIT
	API_SOFTAIMSNOTES_GRAPHQLAPIENDPOINTOUTPUT
	API_SOFTAIMSNOTES_GRAPHQLAPIIDOUTPUT
	API_SOFTAIMSNOTES_GRAPHQLAPIKEYOUTPUT
	AUTH_SOFTAIMSNOTES_USERPOOLID
	ENV
	REGION
Amplify Params - DO NOT EDIT */
import { default as fetch, Request } from 'node-fetch';

const GRAPHQL_ENDPOINT = process.env.API_SOFTAIMSNOTES_GRAPHQLAPIENDPOINTOUTPUT;
const GRAPHQL_API_KEY = process.env.API_SOFTAIMSNOTES_GRAPHQLAPIKEYOUTPUT;

const query = /* GraphQL */ `
  query LIST_NOTES {
    listNotes {
      items {
        id
        title
        Content
      }
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
export const handler = async (event) => {
  console.log(`EVENT: ${JSON.stringify(event)}`);

  /** @type {import('node-fetch').RequestInit} */
  const options = {
    method: 'POST',
    headers: {
      'x-api-key': GRAPHQL_API_KEY,
      authMode: "AMAZON_COGNITO_USER_POOLS"
    },
    body: JSON.stringify({ query,       authMode: "AMAZON_COGNITO_USER_POOLS"
  })
  };

  const request = new Request(GRAPHQL_ENDPOINT, options);

  let statusCode = 200;
  let body;
  let response;

  try {
    response = await fetch(request);
    body = await response.json();
    if (body.errors) statusCode = 400;
  } catch (error) {
    statusCode = 400;
    body = {
      errors: [
        {
          status: response.status,
          message: error.message,
          stack: error.stack
        }
      ]
    };
  }

  return JSON.stringify({
    statusCode,
    body: JSON.stringify(body)
  });
};
