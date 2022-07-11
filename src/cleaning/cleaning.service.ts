import { Injectable } from "@nestjs/common";
import { notFoundStudentIdException } from "src/exception/exception.index";
import { CleaningStudentDTO } from "src/cleaning/dto/cleaning-student.dto";
import { Cleaning } from "src/cleaning/entities/cleaning.entity";
import { CleaningRepository } from "src/cleaning/entities/cleaning.repository";
import { notFoundRoomIdException } from "src/exception/exception.index";
import { CleaningCheckDTO } from "src/room-cleaning/dto/cleaning-check.dto";
import { RoomCleaning } from "src/room-cleaning/entities/room-cleaning.entity";
import { RoomCleaningRepository } from "src/room-cleaning/entities/room-cleaning.repository";
import { Room } from "src/room/entities/room.entity";
import { RoomRepository } from "src/room/entities/room.repository";
import { User } from "src/user/entities/user.entity";
import { CleaningCheckResultDTO } from "src/room-cleaning/dto/cleaning-check-result.dto";
import { StudentCleaningCheckDTO } from "src/cleaning/dto/student-cleaning-check.dto";
import { utils, WorkBook, WorkSheet, writeFile } from "xlsx";
import { UserRepository } from "src/user/entities/user.repository";

@Injectable()
export class CleaningService {
  constructor(
    private readonly cleaningRepository: CleaningRepository,
    private readonly roomRepository: RoomRepository,
    private readonly roomCleaningRepository: RoomCleaningRepository,
    private readonly userRepository: UserRepository,
  ) {}

  public async saveCleaning(cleaning: Cleaning): Promise<Cleaning> {
    return this.cleaningRepository.save(cleaning);
  }

  public async cleaningCheck(roomId: number, cleaningCheck: CleaningCheckDTO) {
    let saved_student_list = [];
    const room: Room = await this.roomRepository.findOne(roomId);
    if (typeof room == "undefined") {
      throw notFoundRoomIdException;
    }
    const { light, plug, shoes, student_list, day } = cleaningCheck;
    let savedRoomCleaning: RoomCleaning;

    const foundRoomCleaning: RoomCleaning =
      await this.roomCleaningRepository.findOne({
        where: { room_id: roomId, day: day },
      });

    try {
      savedRoomCleaning = await this.roomCleaningRepository.save(
        new RoomCleaning({
          id:
            typeof foundRoomCleaning == "undefined"
              ? null
              : foundRoomCleaning.id,
          light: light ?? false,
          plug: plug ?? false,
          shoes: shoes ?? false,
          room_id: roomId,
          room: room,
          day: day,
        }),
      );
    } catch (error) {
      if (error.message.indexOf("foreign key constraint fails") !== -1) {
        throw notFoundRoomIdException;
      }
    }

    saved_student_list = await Promise.all(
      student_list.map(async (student) => {
        const foundCleaning: Cleaning = await this.cleaningRepository.findOne({
          where: { user_id: student.user_id, day: student.day },
        });

        const cleaning: Cleaning = await this.cleaningRepository.save(
          new Cleaning({
            id: typeof foundCleaning == "undefined" ? null : foundCleaning.id,
            ...student,
          }),
        );
        return new CleaningStudentDTO({
          clothes: cleaning.clothes,
          bedding: cleaning.bedding,
          personalplace: cleaning.personalplace,
          user_id: cleaning.user_id,
          day: cleaning.day,
        });
      }),
    );

    const cleaningCheckResult: CleaningCheckDTO = {
      light: savedRoomCleaning.light,
      plug: savedRoomCleaning.plug,
      shoes: savedRoomCleaning.shoes,
      day: savedRoomCleaning.day,
      student_list: saved_student_list,
    };

    return cleaningCheckResult;
  }

  public async getCleaningCheck(roomId: number, day: string) {
    const student_list: StudentCleaningCheckDTO[] = [];

    const foundUsers: User[] = await this.userRepository.find({
      where: { room_id: roomId },
      order: { bed: "ASC" },
    });
    if (foundUsers.length === 0) {
      throw notFoundStudentIdException;
    }

    for (const user of foundUsers) {
      const cleaning: Cleaning = await this.cleaningRepository.findOne({
        where: { user_id: user.id, day: day },
      });

      if (cleaning == undefined) {
        student_list.push(
          new StudentCleaningCheckDTO({
            id: null,
            user_id: user.id,
            bed: user.bed,
            name: user.name,
            clothes: null,
            bedding: null,
            personalplace: null,
          }),
        );
      } else {
        student_list.push(
          new StudentCleaningCheckDTO({
            id: cleaning.id,
            user_id: user.id,
            bed: user.bed,
            name: user.name,
            clothes: cleaning.clothes,
            bedding: cleaning.bedding,
            personalplace: cleaning.personalplace,
          }),
        );
      }
    }

    const roomCleaning: RoomCleaning =
      await this.roomCleaningRepository.findOne({
        where: { room_id: roomId },
      });
    if (roomCleaning == undefined) {
      return new CleaningCheckResultDTO({
        ...{
          id: null,
          day: null,
          light: null,
          plug: null,
          shoes: null,
          room_id: roomId,
        },
        student_list: student_list,
      });
    } else {
      return new CleaningCheckResultDTO({
        ...roomCleaning,
        student_list: student_list,
      });
    }
  }

  public async getWeekRooms() {
    const roomList = await this.roomRepository.getRooms();

    return await Promise.all(
      roomList.map(async (room) => {
        const roomCleaningWeek =
          await this.roomCleaningRepository.getRoomCleaningWeek(room.id);

        return {
          roomId: room.id,
          results: await Promise.all(
            roomCleaningWeek.map(async (day) => {
              const bedInfos = await this.cleaningRepository.getbedInfo(
                room.id,
                day.day,
              );
              return {
                day: day.day,
                light: day.light,
                plug: day.plug,
                shoes: day.shoes,
                A: bedInfos[0],
                B: bedInfos[1],
                C: bedInfos[2],
              };
            }),
          ),
        };
      }),
    );
  }

  public async getExcelData() {
    const date: Date = new Date();
    const workbook: WorkBook = utils.book_new();
    let ws: WorkSheet = workbook.Sheets["Sheet1"];

    let content = [];

    const columns = utils.aoa_to_sheet(content);
    utils.book_append_sheet(workbook, columns, "sheet1");

    const positions = ["A1", "J2", "S2", "AB2", "AK2"];
    let mergeColumns = [0, 9, 18, 27, 36];
    let mergeList: any[] = [];
    let positionCounter = 0;

    let counter = 2;

    content.push([
      `청결호실 점검 결과표 (${date.getFullYear()}년 ${
        date.getMonth() + 1
      }월 ${this.weekNumberByMonth(date)}주)`,
    ]);

    const roomList = await this.roomRepository.getRoomsWithStudent();
    const existData = await this.roomRepository.getAllData();

    for (const room of roomList) {
      if (counter >= 50) {
        counter = 2;
        content = [];
        positionCounter += 1;
      }
      if (counter == 2) {
        content.push(["호실", "이름", "월", "화", "수", "목", "금", "비고"]);
      }
      for (const student of room.user) {
        const foundData: Room = existData.find(
          (existRoom, index, rooms) => existRoom.id == room.id,
        );
        const studentCleaning = [room.id.toString(), student.name];
        for (
          let i = 0;
          i <
          (typeof foundData == "undefined" ? 5 : foundData.roomcleaning.length);
          i++
        ) {
          if (!(typeof foundData == "undefined")) {
            studentCleaning.push(
              foundData.roomcleaning[i].light &&
                foundData.roomcleaning[i].plug &&
                foundData.roomcleaning[i].shoes &&
                student.cleaning[i].clothes &&
                student.cleaning[i].bedding &&
                (student.cleaning[i].personalplace ?? true)
                ? "O"
                : "X",
            );
          } else {
            studentCleaning.push("");
          }
        }
        content.push(studentCleaning);
      }
      if (room.user.length == 2) {
        content.push([room.id.toString(), "", "", "", "", "", "", ""]);
        mergeList.push({
          s: { c: mergeColumns[positionCounter], r: counter },
          e: {
            c: mergeColumns[positionCounter],
            r: counter + room.user.length,
          },
        });
        counter += 3;
      } else {
        mergeList.push({
          s: { c: mergeColumns[positionCounter], r: counter },
          e: {
            c: mergeColumns[positionCounter],
            r: counter + room.user.length - 1,
          },
        });
        counter += room.user.length;
      }
      ws = utils.sheet_add_aoa(ws, content, {
        origin: `${positions[positionCounter]}`,
      });
    }

    mergeList = this.titleMerge(mergeList);

    mergeList = this.separationSpaceMerge(mergeList);

    ws["!merges"] = mergeList;

    workbook.Sheets.sheet1 = ws;

    writeFile(
      workbook,
      `우정관-청결호실-점검-결과표${date.getFullYear()}-${
        date.getMonth() + 1
      }.xlsx`,
    );
  }

  private titleMerge(mergeList: any[]): any[] {
    mergeList.push({
      s: { c: 0, r: 0 },
      e: { c: 43, r: 0 },
    });

    return mergeList;
  }

  //공백줄 머지
  private separationSpaceMerge(mergeList: any[]): any[] {
    mergeList.push({
      s: { c: 8, r: 1 },
      e: { c: 8, r: 52 },
    });
    mergeList.push({
      s: { c: 17, r: 1 },
      e: { c: 17, r: 52 },
    });
    mergeList.push({
      s: { c: 26, r: 1 },
      e: { c: 26, r: 52 },
    });
    mergeList.push({
      s: { c: 35, r: 1 },
      e: { c: 35, r: 52 },
    });

    return mergeList;
  }

  public async getStudentCleaningWithStudentId(studentId: number) {
    return await this.userRepository.getStudentInfo(studentId);
  }

  public async getStudentCleaning(id: number) {
    const user: User = await this.userRepository.findOne({
      where: { id },
    });

    const roomCleaningWeek =
      await this.roomCleaningRepository.getRoomCleaningWeek(user.room_id);

    const results = await Promise.all(
      roomCleaningWeek.map(async (roomCleaning) => {
        const cleaning = await this.cleaningRepository.studentCleaningInfo(
          id,
          roomCleaning.day,
        );
        return {
          day: roomCleaning.day,
          light: roomCleaning.light,
          plug: roomCleaning.plug,
          shoes: roomCleaning.shoes,
          bedding: cleaning?.bedding,
          clothes: cleaning?.clothes,
          personalplace: cleaning?.personalplace,
        };
      }),
    );
    return {
      name: user.name,
      gcn: user.id,
      roomId: user.room_id,
      bed: user.bed,
      results,
    };
  }

  private weekNumberByMonth(dateFormat) {
    const inputDate = new Date(dateFormat);

    let year = inputDate.getFullYear();
    let month = inputDate.getMonth() + 1;

    const weekNumberBySunFnc = (paramDate) => {
      const year = paramDate.getFullYear();
      const month = paramDate.getMonth();
      const date = paramDate.getDate();

      const firstDate = new Date(year, month, 1);
      const lastDate = new Date(year, month + 1, 0);
      const firstDayOfWeek = firstDate.getDay() === 0 ? 7 : firstDate.getDay();
      const lastDayOfWeek = lastDate.getDay();

      const lastDay = lastDate.getDate();

      const fistWeekCheck = firstDayOfWeek == 7;
      const lastWeekCheck =
        lastDayOfWeek === 1 ||
        lastDayOfWeek === 2 ||
        lastDayOfWeek === 3 ||
        firstDayOfWeek === 5 ||
        firstDayOfWeek === 6;

      // 해당 달이 총 몇주까지 있는지
      const lastWeekNo = Math.ceil(firstDayOfWeek - 1 + lastDay / 7);

      // 날짜 기준으로 몇 주차 인지
      let weekNo: number | string = Math.ceil((firstDayOfWeek - 1 + date) / 7);
      if (weekNo === 1 && fistWeekCheck) {
        weekNo = "prev";
      } else if (weekNo === lastWeekNo && lastWeekCheck) {
        weekNo = "next";
      } else if (fistWeekCheck) {
        weekNo = weekNo - 1;
      }

      return weekNo;
    };

    let weekNo = weekNumberBySunFnc(inputDate);

    // 이전달의 마지막 주차일때
    const afterDate = new Date(year, month, 0);
    year = month === 1 ? year - 1 : year;
    month = month === 1 ? 12 : month - 1;
    weekNo = weekNumberBySunFnc(afterDate);

    if (weekNo === "next") {
      year = month === 12 ? year + 1 : year;
      month = month === 12 ? 1 : month + 1;
      weekNo = 1;
    }
    return weekNo;
  }
}
