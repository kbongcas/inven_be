import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { RegisterRequestDto } from "./dto/register-request.dto";
import { forwardRef } from "@nestjs/common/utils";
import { Inject } from "@nestjs/common/decorators";
import { Tokens } from "./types/tokens.type";
import * as argon2 from 'argon2';
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService 
  ) {}

  async registerLocal(registerRequestDto: RegisterRequestDto): Promise<Tokens> {

    const foundUser = await this.userService.findOneByEmail(registerRequestDto.email);
    if(foundUser) throw new ForbiddenException('Access Denied');
    
    const newUser = await this.userService.create({
      email: registerRequestDto.email,
      password: await this.hashData(registerRequestDto.password),
    })
    
    const tokens =  await this.getTokens(newUser.id, newUser.email);
    await this.updateRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }
  
  async signInLocal(signInRequestDto: RegisterRequestDto): Promise<Tokens> {
    const user = await this.userService.findOneByEmail(signInRequestDto.email);
    if(!user) throw new ForbiddenException('Access Denied');
    
    const passwordMatches = await argon2.verify(user.password, signInRequestDto.password)
    if(!passwordMatches) throw new ForbiddenException('Access Denied');

    const tokens =  await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }
  
  async logout(userId: number) {
    await this.updateRefreshToken(userId,  null);
  }
  
  async refreshToken(userId: number, refreshToken: string) {
    
    const user = await this.userService.findOneById(userId);
    if(!user) throw new ForbiddenException('Access Denied');

    if(!user.refreshToken) throw new ForbiddenException('Access Denied');
    
    const refreshTokenMatches = await argon2.verify(user.refreshToken , refreshToken);
    if(!refreshTokenMatches) throw new ForbiddenException('Access Denied');

    const tokens =  await this.getTokens(user.id, user.email);
    await this.updateRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }


  async getTokens(userId: number, email: string) {
    const expirationInMinutes = 15;
    const accessToken = await this.jwtService.signAsync({
      sub: userId,
      email
    }, {
      secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
      expiresIn: 60 * expirationInMinutes
    })
    const refreshToken = await this.jwtService.signAsync({
      sub: userId,
      email
    }, {
      secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: 60 * expirationInMinutes * 20
    })

    return {
      accessToken: accessToken,
      refreshToken: refreshToken
    };
  }
  
  hashData(data: string) {
    return argon2.hash(data);
  }
  
  async updateRefreshToken(userId: number, rt: string){
    const hash = rt ? await this.hashData(rt) : null;
    await this.userService.updateToken(userId ,hash)
  }
  
}
