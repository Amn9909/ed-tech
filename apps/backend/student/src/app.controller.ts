import { BadRequestException, Controller, Get, Post, UploadedFile, UseInterceptors, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { extname } from 'path';
import { diskStorage } from 'multer';
import * as XLSX from 'xlsx';
import { Response } from 'express';

@ApiTags('Students')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx|xls)$/)) {
          return cb(new BadRequestException('Only Excel files are allowed!'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 10 * 1024 * 1024 }, // Max 10MB
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      const workbook = XLSX.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      if (!Array.isArray(data) || data.length === 0) {
        throw new BadRequestException('Uploaded file contains no valid data.');
      }

      if (data.length > 5000) {
        throw new BadRequestException('Cannot upload more than 5000 records.');
      }

      const students = data.map((record: any) => ({
        firstName: record.firstName,
        lastName: record.lastName,
        email: record.email,
        mobileNumber: record.mobileNumber,
        dateOfBirth: record.dateOfBirth,
        gender: record.gender,
        address: record.address,
        enrollmentNumber: record.enrollmentNumber,
        course: record.course,
        batch: record.batch,
      }));

      return this.appService.bulkCreate(students);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Get('students')
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getStudents(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.appService.findAll(page, limit);
  }

  @Get('students/search')
  @ApiQuery({ name: 'query', required: true, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchStudents(
    @Query('query') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.appService.searchStudents(query, page, limit);
  }

  @Get('students/export')
  async exportStudents(@Res() res: Response) {
    const buffer = await this.appService.generateExcel();
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=students.xlsx',
    });
    res.send(buffer);
  }
}
