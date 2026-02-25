import { handler } from "./handler.js";

const event = {};

const response = await handler(event);
console.log(JSON.stringify(response, null, 2));
