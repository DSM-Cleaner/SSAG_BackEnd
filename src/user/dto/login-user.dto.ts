export class loginUserDTO {
  constructor(init?: Partial<loginUserDTO>) {
    Object.assign(this, init);
  }

  code: string;
}
