import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
constructor(
@InjectRepository(User)
private userRepository: Repository<User>,


private jwtService: JwtService,


) {}

async signup(
  
name: string,
email: string,
password: string,
role: string,
) {
  this.logger.log(`Signup attempt: ${email}`);
  const existingUser = await this.userRepository.findOne({
    where: { email },
  });
  
  if (existingUser) {
    this.logger.warn(
      `Duplicate signup attempt: ${email}`,
    );
    throw new ConflictException('Email already registered');
  }
const hashedPassword = await bcrypt.hash(password, 10);


const user = this.userRepository.create({
  name,
  email,
  password: hashedPassword,
  role,
});

await this.userRepository.save(user);
this.logger.log(
  `User registered successfully: ${email}`,
);

return {
  message: 'User registered successfully',
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
};


}

async login(email: string, password: string) {
  this.logger.log(`Login attempt: ${email}`);  
const user = await this.userRepository.findOne({
where: { email },
});

if (!user) {
  this.logger.warn(
    `Invalid login attempt: ${email}`,
  );
  throw new UnauthorizedException('Invalid credentials');
}

const isPasswordValid = await bcrypt.compare(
  password,
  user.password,
);

if (!isPasswordValid) {
  this.logger.warn(
    `Invalid login attempt: ${email}`,
  );
  throw new UnauthorizedException('Invalid credentials');
}

const payload = {
  sub: user.id,
  email: user.email,
  role: user.role,
};
this.logger.log(
  `Login successful: ${email}`,
);
return {
  
  access_token: this.jwtService.sign(payload),
  role: user.role,
  email: user.email,
};


}
}
