import { Controller, Get, Param, Res } from "@nestjs/common";
import { Response } from "express";
import { unlink } from "fs";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/file/:fileName")
  fileDownload(
    @Res() res: Response,
    @Param("fileName") fileName: string,
  ): void {
    res.download(process.env.FILE_PATH + decodeURIComponent(fileName));
    setTimeout(() => {
      unlink(decodeURIComponent(fileName), (err) => {
        if (err != null) {
          console.log("파일 삭제 실패");
        }
      });
    }, 3000);
  }
}
