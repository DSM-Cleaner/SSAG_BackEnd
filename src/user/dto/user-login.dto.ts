export class userLoginDTO {
  constructor(init?: Partial<userLoginDTO>) {
    Object.assign(this, init);
  }

  code: string;
}
