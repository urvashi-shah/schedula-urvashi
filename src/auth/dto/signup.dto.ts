import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    example: 'Urvashi Shah',
  })
  name: string;

  @ApiProperty({
    example: 'urvashi@gmail.com',
  })
  email: string;

  @ApiProperty({
    example: 'Password@123',
  })
  password: string;

  @ApiProperty({
    example: 'DOCTOR',
  })
  role: string;
}