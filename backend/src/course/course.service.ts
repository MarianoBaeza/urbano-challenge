import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { Course } from './entities/course.entity';
import { CourseQuery } from './query/course.query';

@Injectable()
export class CourseService {
  async save(createCourseDto: CreateCourseDto): Promise<Course> {
    return await Course.create({
      ...createCourseDto,
      dateCreated: new Date(),
    }).save();
  }

  async findAll(courseQuery: CourseQuery): Promise<Course[]> {
    const query = Course.createQueryBuilder('course');

    if (courseQuery.name) {
      query.andWhere('course.name ILIKE :name', {
        name: `%${courseQuery.name}%`,
      });
    }

    if (courseQuery.description) {
      query.andWhere('course.description ILIKE :description', {
        description: `%${courseQuery.description}%`,
      });
    }

    return await query
      .orderBy('course.name', 'ASC')
      .addOrderBy('course.description', 'ASC')
      .getMany();
  }

  async findById(id: string): Promise<Course> {
    const course = await Course.findOne(id);
    if (!course) {
      throw new HttpException(
        `Could not find course with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.findById(id);
    return await Course.create({ id: course.id, ...updateCourseDto }).save();
  }

  async delete(id: string): Promise<string> {
    const course = await this.findById(id);
    await Course.delete(course);
    return id;
  }

  async count(): Promise<number> {
    return await Course.count();
  }
}
