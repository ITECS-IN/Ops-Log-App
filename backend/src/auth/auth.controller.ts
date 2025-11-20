import { Body, Controller, Post, Put, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() body: any) {
    // body: { email, password, companyName }
    return this.authService.signup(body);
  }

  @Put('change-password')
  async changePassword(@Body() body: any, @Req() req: any) {
    // body: { currentPassword, newPassword }
    // req.user contains the decoded Firebase token from middleware
    return this.authService.changePassword(req.user, body);
  }
}
