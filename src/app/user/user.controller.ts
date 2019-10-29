import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UsePipes,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';
import { ValidationPipe } from '../shared/validation.pipe';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('api/users')
  async showAllUsers(@Query('page') page: number) {
    return this.userService.showAll(page);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() data: UserDto) {
    return this.userService.login(data);
  }

  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() data: UserDto) {
    return this.userService.register(data);
  }
}
