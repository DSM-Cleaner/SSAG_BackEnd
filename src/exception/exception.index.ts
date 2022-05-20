import { BadRequestException, NotFoundException } from "@nestjs/common";

export const badRequestException = new BadRequestException();

export const notConfirmPasswordException = new BadRequestException(
  "Not Confirm Password",
);

export const notFoundTeacherNameException = new NotFoundException(
  "NotFound TeacherName",
);

export const notFoundTeacherIdException = new NotFoundException(
  "NotFound TeacherId",
);

export const notFoundStudentIdException = new NotFoundException(
  "NotFound StudentId",
);

export const notFoundRoomIdException = new NotFoundException("NotFound RoomId");
