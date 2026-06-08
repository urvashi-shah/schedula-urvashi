import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('doctor')
export class DoctorController {
  @Roles('DOCTOR')
  @UseGuards(JwtGuard, RolesGuard)
  @Get('profile')
  getProfile() {
    return {
      message: 'Doctor Profile Accessed Successfully',
    };
  }
}