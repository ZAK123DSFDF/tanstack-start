import { JokeService } from "./joke.service";

export class JokeController {
  private service = new JokeService();

  random = ({ query }: { query: { query?: string; category?: string } }) => {
    return this.service.getRandomJoke(query.query, query.category);
  };
  random2 = () => this.service.getSlowJoke();
  redirect = () => this.service.redirectToDemo();

  success = () => this.service.successDemo();
  error = () => this.service.errorDemo();
}
