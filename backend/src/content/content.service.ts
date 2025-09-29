import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CourseService } from '../course/course.service';
import { CreateContentDto, UpdateContentDto } from './dto/content.dto';
import { Content } from './entities/content.entity';
import { ContentQuery } from './query/content.query';

@Injectable()
export class ContentService {
  constructor(private readonly courseService: CourseService) {}

  async save(
    courseId: string,
    createContentDto: CreateContentDto,
  ): Promise<Content> {
    const { name, description } = createContentDto;
    const course = await this.courseService.findById(courseId);
    return await Content.create({
      name,
      description,
      course,
      dateCreated: new Date(),
    }).save();
  }

  async findAll(contentQuery: ContentQuery): Promise<Content[]> {
    const qb = Content.createQueryBuilder('content')
      .orderBy('content.name', 'ASC')
      .addOrderBy('content.description', 'ASC');

    for (const [key, value] of Object.entries(contentQuery)) {
      if (value) {
        qb.andWhere(`content.${key} ILIKE :${key}`, { [key]: `%${value}%` });
      }
    }

    return qb.getMany();
  }

  async findById(id: string): Promise<Content> {
    const content = await Content.findOne(id);

    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }

    return content;
  }

  async findByCourseIdAndId(courseId: string, id: string): Promise<Content> {
    const content = await Content.findOne({ where: { courseId, id } });
    if (!content) {
      throw new HttpException(
        `Could not find content with matching id ${id}`,
        HttpStatus.NOT_FOUND,
      );
    }
    return content;
  }

  async findAllByCourseId(
    courseId: string,
    contentQuery: ContentQuery,
  ): Promise<Content[]> {
    const qb = Content.createQueryBuilder('content')
      .where('content.courseId = :courseId', { courseId })
      .orderBy('content.name', 'ASC')
      .addOrderBy('content.description', 'ASC');

    for (const [key, value] of Object.entries(contentQuery)) {
      if (value) {
        qb.andWhere(`content.${key} ILIKE :${key}`, { [key]: `%${value}%` });
      }
    }

    return qb.getMany();
  }

  async update(
    courseId: string,
    id: string,
    updateContentDto: UpdateContentDto,
  ): Promise<Content> {
    const content = await this.findByCourseIdAndId(courseId, id);
    return await Content.create({ id: content.id, ...updateContentDto }).save();
  }

  async delete(courseId: string, id: string): Promise<string> {
    const content = await this.findByCourseIdAndId(courseId, id);
    await Content.delete(content);
    return id;
  }

  async count(): Promise<number> {
    return await Content.count();
  }
}
