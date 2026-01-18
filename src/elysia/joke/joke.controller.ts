// src/elysia/joke/joke.controller.ts
import { JokeService } from "./joke.service";

export class JokeController {
  private service = new JokeService();

  random = async ({ query }: any) =>
    await this.service.getRandomJoke(query.query, query.category);

  random2 = async () => await this.service.getSlowJoke();
  success = async () => await this.service.successDemo();
  reset = async () => await this.service.resetDemo();
  error = async () => await this.service.errorDemo();
  getRedis = async () => await this.service.getRedisValue();
  setRedis = async ({ body }: { body: { value: string } }) =>
    await this.service.setRedisValue(body.value);
  deleteRedis = async () => await this.service.deleteRedisValue();
}
