import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('patient')
export class PatientController {
  @Roles('PATIENT')
  @UseGuards(JwtGuard, RolesGuard)
  @Get('profile')
  getProfile() {
    return {
      message: 'Patient Profile Accessed Successfully',
    };
  }
}