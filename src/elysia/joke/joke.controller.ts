// src/elysia/joke/joke.controller.ts
import { JokeService } from "./joke.service";

export class JokeController {
  private service = new JokeService();

  random = ({ query }: any) =>
    this.service.getRandomJoke(query.query, query.category);
  random2 = () => this.service.getSlowJoke();
  success = () => this.service.successDemo();
  reset = () => this.service.resetDemo();
  error = () => this.service.errorDemo();
}
