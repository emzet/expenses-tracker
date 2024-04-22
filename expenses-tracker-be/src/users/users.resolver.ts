import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { UsersService } from './users.service';
import { UserInput } from '../graphql';
import { GetCurrentUser, GetCurrentUserId, Public } from '../common/decorators';
import { RtGuard } from '../common/guards';

@Resolver('Users')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Mutation('signup')
  signup(@Args('userInput') createUserInput: UserInput) {
    return this.usersService.signup(createUserInput);
  }

  @Public()
  @Mutation('login')
  login(@Args('userInput') createUserInput: UserInput) {
    return this.usersService.signin(createUserInput);
  }

  @Mutation('logout')
  logout(@GetCurrentUserId() userId: string) {
    return this.usersService.logout(userId);
  }

  @Public()
  @UseGuards(RtGuard)
  @Mutation('refresh')
  refresh(
    @GetCurrentUserId() userId: string,
    @GetCurrentUser('refreshToken') refreshToken: string,
  ) {
    return this.usersService.refreshToken(userId, refreshToken);
  }
}
