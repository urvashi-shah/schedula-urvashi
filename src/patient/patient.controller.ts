import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Req,
    UseGuards,
  } from '@nestjs/common';
  import { JwtGuard } from '../auth/jwt/jwt.guard';
  import { RolesGuard } from '../auth/roles/roles.guard';
  import { Roles } from '../auth/roles/roles.decorator';
  import { PatientService } from './patient.service';
  import { CreatePatientProfileDto } from './dto/create-patient-profile.dto';
  import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
  
  @Controller('patient')
  export class PatientController {
    constructor(
      private readonly patientService: PatientService,
    ) {}
  
    @Roles('PATIENT')
    @UseGuards(JwtGuard, RolesGuard)
    @Post('profile')
    createProfile(
      @Body() createPatientProfileDto: CreatePatientProfileDto,
      @Req() req,
    ) {
      return this.patientService.createProfile(
        createPatientProfileDto,
        req.user,
      );
    }
  
    @Roles('PATIENT')
    @UseGuards(JwtGuard, RolesGuard)
    @Get('profile')
    getProfile(@Req() req) {
      return this.patientService.getProfile(
        req.user,
      );
    }
  
    @Roles('PATIENT')
    @UseGuards(JwtGuard, RolesGuard)
    @Patch('profile')
    updateProfile(
      @Body() updatePatientProfileDto: UpdatePatientProfileDto,
      @Req() req,
    ) {
      return this.patientService.updateProfile(
        updatePatientProfileDto,
        req.user,
      );
    }
  }