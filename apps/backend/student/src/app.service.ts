import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entaty/student-rntaty';
import * as XLSX from 'xlsx';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async bulkCreate(students: Partial<Student>[]): Promise<Student[]> {
    try {
      return await this.studentRepo.save(students);
    } catch (error) {
      if (error.code === '23505') { // Unique constraint violation
        throw new BadRequestException('Duplicate email or enrollment number found');
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 10): Promise<{ data: Student[]; total: number }> {
    const [data, total] = await this.studentRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'DESC' },
    });
    return { data, total };
  }

  async generateExcel(): Promise<Buffer> {
    const students = await this.studentRepo.find();
    const worksheet = XLSX.utils.json_to_sheet(students);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  async searchStudents(query: string, page = 1, limit = 10): Promise<{ data: Student[]; total: number }> {
    const [data, total] = await this.studentRepo
      .createQueryBuilder('student')
      .where('student.firstName ILIKE :query', { query: `%${query}%` })
      .orWhere('student.lastName ILIKE :query', { query: `%${query}%` })
      .orWhere('student.email ILIKE :query', { query: `%${query}%` })
      .orWhere('student.enrollmentNumber ILIKE :query', { query: `%${query}%` })
      .skip((page - 1) * limit)
      .take(limit)
      .orderBy('student.id', 'DESC')
      .getManyAndCount();

    return { data, total };
  }
}
