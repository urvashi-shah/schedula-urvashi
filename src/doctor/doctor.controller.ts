import {
    Controller,
    Get,
    Post,
    Body,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { JwtGuard } from '../auth/jwt/jwt.guard';
  import { RolesGuard } from '../auth/roles/roles.guard';
  import { Roles } from '../auth/roles/roles.decorator';
  import { DoctorService } from './doctor.service';
  import { CreateDoctorProfileDto } from './dto/create-doctor-profile.dto';
  import { Patch } from '@nestjs/common';
  import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
  
  @Controller('doctor')
  export class DoctorController {
    constructor(
      private readonly doctorService: DoctorService,
    ) {}
  
    @Roles('DOCTOR')
    @UseGuards(JwtGuard, RolesGuard)
    @Post('profile')
    createProfile(
      @Body() createDoctorProfileDto: CreateDoctorProfileDto,
      @Req() req,
    ) {
      return this.doctorService.createProfile(
        createDoctorProfileDto,
        req.user,
      );
    }
  
    @Roles('DOCTOR')
    @UseGuards(JwtGuard, RolesGuard)
    @Get('profile')
    getProfile(@Req() req) {
        return this.doctorService.getProfile(
          req.user,
        );
      }

   @Roles('DOCTOR')
   @UseGuards(JwtGuard, RolesGuard)
   @Patch('profile')
   updateProfile(
   @Body() updateDoctorProfileDto: UpdateDoctorProfileDto,
   @Req() req,
) {
  return this.doctorService.updateProfile(
    updateDoctorProfileDto,
    req.user,
  );
}
  }