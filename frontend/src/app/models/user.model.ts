//TODO: Images, base-64 encoding...
export class User {
    id: number;
    username: string;
    password: string;
    email: string;
    interests: string;
    coffeeType: string;
    profilePicture: string;

  constructor(
    id?: number,
    username?: string,
    password?: string,
    email?: string,
    interests?: string,
    coffeeType?: string,
    profilePicture?: string
  ) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.email = email;
    this.interests = interests;
    this.coffeeType = coffeeType;
    this.profilePicture = profilePicture;
  }
}
