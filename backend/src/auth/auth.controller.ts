import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: any) {
    // body: { email, password, companyName }
    return this.authService.signup(body);
  }

  @Post('users')
  async createUser(@Body() body: any, @Req() req: any) {
    return this.authService.createUser(req.user, body);
  }

  @Get('users')
  async listUsers(@Req() req: any) {
    return this.authService.listUsers(req.user);
  }

  @Put('users/:uid')
  async updateUser(
    @Param('uid') uid: string,
    @Body() body: any,
    @Req() req: any,
  ) {
    return this.authService.updateUser(req.user, uid, body);
  }

  @Delete('users/:uid')
  async deleteUser(@Param('uid') uid: string, @Req() req: any) {
    return this.authService.deleteUser(req.user, uid);
  }

  @Post('users/:uid/reset-password')
  async resetUserPassword(@Param('uid') uid: string, @Req() req: any) {
    return this.authService.resetUserPassword(req.user, uid);
  }

  @Put('change-password')
  async changePassword(@Body() body: any, @Req() req: any) {
    // body: { currentPassword, newPassword }
    // req.user contains the decoded Firebase token from middleware
    return this.authService.changePassword(req.user, body);
  }
}
