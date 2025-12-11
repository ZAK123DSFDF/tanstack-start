import { JokeService } from "./joke.service";

export class JokeController {
    private service = new JokeService();

    random = () => this.service.getRandomJoke();
    redirect = () => this.service.redirectToDemo();

    success = () => this.service.successDemo();
    error = () => this.service.errorDemo();
}
