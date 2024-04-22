import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { UserDto } from '../db/users/dto/user.dto';
import { Tokens } from '../graphql';
import { RtGuard } from '../common/guards';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';

@Controller('user')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post('signup')
  @ApiCreatedResponse()
  signup(@Body() userDto: UserDto): Promise<Tokens> {
    return this.usersService.signup(userDto);
  }

  @Public()
  @Post('signin')
  @ApiOkResponse()
  signin(@Body() userDto: UserDto): Promise<Tokens> {
    return this.usersService.signin(userDto);
  }

  @Post('logout')
  @ApiOkResponse()
  logout(@GetCurrentUserId() userId: string) {
    this.usersService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Post('refresh')
  @ApiOkResponse()
  refreshToken(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.usersService.refreshToken(userId, refreshToken);
  }
}
