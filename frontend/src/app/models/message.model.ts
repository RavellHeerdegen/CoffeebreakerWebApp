import { CoffeebreakUser } from "@app/models/coffeebreak-user.model";

export class Message {
  message: string;
  user: CoffeebreakUser;
  coffeebreakId: number;
  createdAt: string;
  createdAtIndicator: string;

  constructor(
    msg: string,
    user: CoffeebreakUser,
    coffeebreakId: number,
    createdAt?: string,
    createdAtIndicator?: string,
    updatedAt?: string
  ) {
    this.message = msg;
    this.user = user;
    this.coffeebreakId = coffeebreakId;
    this.createdAt = createdAt;
    this.createdAtIndicator = createdAtIndicator;
  }
}
