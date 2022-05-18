export class UserLoginResponseDTO {
  constructor(init?: Partial<UserLoginResponseDTO>) {
    Object.assign(this, init);
  }

  authorization: string;
  id: number;
}
