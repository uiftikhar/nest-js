import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { IdeaDto } from './idea.dto';

@Controller('idea')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Get()
  async showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  async createIdea(@Body() data: IdeaDto) {
    return this.ideaService.create(data);
  }

  @Get(':id')
  async readIdea(@Param('id') id: string) {
    return this.ideaService.readIdea(id);
  }

  @Put(':id')
  async updateIdea(
    @Param('id') id: string,
    @Body() data: Partial<IdeaDto>
  ) {
    return this.ideaService.update(id, data);
  }

  @Delete(':id')
  async deleteIdea(@Param('id') id: string) {
    return this.ideaService.destroy(id);
  }
}
