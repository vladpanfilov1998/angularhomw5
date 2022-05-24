import {environment} from "../../environments/environment";

const baseUrl = environment.baseUrl;

export const urls = {
  auth: `${baseUrl}/auth`,
  users: `${baseUrl}/users`,
  cars: `${baseUrl}/cars`,
}
