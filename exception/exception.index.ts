import { BadRequestException, NotFoundException } from "@nestjs/common";

export const badRequestException = new BadRequestException();

export const notConfirmPasswordException = new BadRequestException(
  "Not Confirm Password"
);

export const notFoundTeacherNameException = new NotFoundException(
  "NotFound TeacherName"
);
