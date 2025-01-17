import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from '../types/cat.interface';
import { HttpResponse } from '../types/interface';

@Controller('cats')
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private configService: ConfigService,
  ) {}

  @Post('add')
  async create(@Body() createCatDto: CreateCatDto): Promise<string> {
    this.catsService.create(createCatDto);
    return 'OK';
  }

  @Get('all')
  async findAll(): Promise<HttpResponse<Cat[]>> {
    // 读取环境变量并写配置的demo
    const ENV_NAME = this.configService.get<string>('ENV_NAME');
    const logger = new Logger();
    logger.log(`当前环境：${ENV_NAME}`);

    const arr: Cat[] = this.catsService.findAll();
    return {
      code: 0,
      message: '',
      data: arr,
    };
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
