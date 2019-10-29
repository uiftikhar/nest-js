import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { User } from '../user/user.decorator';
import { AuthGuard } from '../shared/guards/auth.guard';
import { ValidationPipe } from '../shared/validation.pipe';
import { CommentDto } from './comment.dto';

@Controller('api/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get('idea/:id')
  async showCommentsByIdea(@Param('id') id: string) {
    return this.commentService.showByIdeaId(id);
  }

  @Get('user/:id')
  async showCommentsByUser(@Param('id') id: string) {
    return this.commentService.showByUserId(id);
  }

  @Get(':id')
  async showComment(@Param('id') id: string) {
    return this.commentService.show(id);
  }

  @Delete(':id')
  @UseGuards(new AuthGuard())
  async destroyComment(
    @Param('id') id: string,
    @User('id') user: string
  ) {
    return this.commentService.destroy(id, user);
  }

  @Post('idea/:id')
  @UseGuards(new AuthGuard())
  @UsePipes(new ValidationPipe())
  async createComment(
    @Param('id') idea: string,
    @User('id') user: string,
    @Body() data: CommentDto
  ) {
    return this.commentService.create(idea, user, data);
  }
}
