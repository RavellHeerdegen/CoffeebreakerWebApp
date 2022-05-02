export class CoffeebreakUser {
  id: number;
  username: string;
  interest: string;
  coffeeType: string;
  profilePicture: string;

  constructor(
    id: number,
    username: string,
    interest?: string,
    type?: string,
    picture?: string
  ) {
    this.id = id;
    this.username = username;
    this.interest = interest;
    this.coffeeType = type;
    this.profilePicture = picture;
  }
}
