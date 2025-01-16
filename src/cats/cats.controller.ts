import { Controller, Get, Post, Param, Body, HttpException, HttpStatus } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post('add')
  async create(@Body() createCatDto: CreateCatDto): Promise<string> {
    this.catsService.create(createCatDto);
    return 'OK';
  }

  @Get('all')
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get(':id')
  findOne(@Param() params): string {
    console.log(params.id);
    return `This action returns a #${params.id} cat`;
  }

  @Get('err')
  async err() {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
