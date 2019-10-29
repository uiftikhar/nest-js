import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
} from '@nestjs/common';

import { IdeaService } from './idea.service';
import { IdeaDto } from './idea.dto';
import { ValidationPipe } from '../shared/validation.pipe';
import { AuthGuard } from '../shared/guards/auth.guard';
import { User } from '../user/user.decorator';

@Controller('api/ideas')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Get()
  async showAllIdeas() {
    return this.ideaService.showAll();
  }

  @Post()
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  async createIdea(@User('id') userId, @Body() data: IdeaDto) {
    return this.ideaService.create(userId, data);
  }

  @Get(':id')
  async readIdea(@Param('id') id: string) {
    return this.ideaService.readIdea(id);
  }

  @Put(':id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  async updateIdea(
    @User('id') userId: string,
    @Param('id') id: string,
    @Body() data: Partial<IdeaDto>
  ) {
    return this.ideaService.update(id, userId, data);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  async deleteIdea(
    @Param('id') id: string,
    @User('id') userId: string
  ) {
    return this.ideaService.destroy(id, userId);
  }

  @Post(':id/bookmark')
  @UseGuards(new AuthGuard())
  async bookmarkIdea(
    @Param('id') id: string,
    @User('id') userId: string
  ) {
    return this.ideaService.bookmark(id, userId);
  }

  @Delete(':id/bookmark')
  @UseGuards(new AuthGuard())
  async removeBookmarkIdea(
    @Param('id') id: string,
    @User('id') userId: string
  ) {
    return this.ideaService.removeBookmark(id, userId);
  }

  @Post(':id/upvote')
  @UseGuards(new AuthGuard())
  async upvote(@Param('id') id: string, @User('id') userId: string) {
    return this.ideaService.upvote(id, userId);
  }

  @Post(':id/downvote')
  @UseGuards(new AuthGuard())
  async downvote(
    @Param('id') id: string,
    @User('id') userId: string
  ) {
    return this.ideaService.downvote(id, userId);
  }
}
