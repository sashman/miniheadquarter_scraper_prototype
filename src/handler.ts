export interface Event {
  [key: string]: unknown;
}

export interface Response {
  statusCode: number;
  body: string;
}

export async function handler(_event: Event): Promise<Response> {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "ok" }),
  };
}
