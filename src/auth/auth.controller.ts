import { Controller, Post, HttpCode, HttpStatus, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterRequestDto } from "./dto/register-request.dto";
import { MessageBody } from "@nestjs/websockets";
import { Tokens } from './types/tokens.type'
import { SignInRequestDto} from "./dto/signin-request.dto";
import { GetCurrentUserId } from "../common/decorators/get-current-user-id.decorator";
import { GetCurrentUser } from "../common/decorators/get-current-user.decorator";
import { AccessTokenGuard } from "../common/guards/access-token.guard";
import { RefreshTokenGuard } from "../common/guards/refresh-token.guard";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerLocal(@MessageBody() registerRequestDto: RegisterRequestDto ): Promise<Tokens>{
    return await this.authService.registerLocal(registerRequestDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  async signInLocal(@MessageBody() singInRequestDto: SignInRequestDto): Promise<Tokens> {
    console.log('signInLocal Called')
    return await this.authService.signInLocal(singInRequestDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post('logout')
  async logout(@GetCurrentUserId() id: number) {
      console.log('logout Called')
      return await this.authService.logout(id);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  async refreshTokens(@GetCurrentUserId() userId: number, @GetCurrentUser("refreshToken") refreshToken: string): Promise<Tokens> {
    console.log('refreshTokens Called')
    return await this.authService.refreshToken(userId, refreshToken);
  }
}
