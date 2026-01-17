// src/elysia/joke/joke.controller.ts
import { JokeService } from "./joke.service";

export class JokeController {
  private service = new JokeService();

  random = ({ query, env }: any) =>
    this.service.getRandomJoke(env, query.query, query.category);
  success = ({ env }: any) => this.service.successDemo(env);
  reset = ({ env }: any) => this.service.resetDemo(env);
  error = () => this.service.errorDemo();
  random2 = ({ env }: any) => this.service.getSlowJoke(env);
}
