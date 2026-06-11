import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { AvailabilityService } from './services/availability.service';
import { CreateRecurringAvailabilityDto } from './dto/create-recurring-availability.dto';
import { UpdateRecurringAvailabilityDto } from './dto/update-recurring-availability.dto';
import { CreateCustomAvailabilityDto } from './dto/create-custom-availability.dto';
import { GetAvailabilityForDateQueryDto } from './dto/get-availability-for-date-query.dto';

@ApiTags('Doctor Availability')
@ApiBearerAuth()
@Roles('DOCTOR')
@UseGuards(JwtGuard, RolesGuard)
@Controller('doctor/availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @ApiOperation({
    summary: 'Create recurring availability window',
    description:
      'Adds a weekly recurring consultation window for the authenticated doctor.',
  })
  @ApiResponse({
    status: 201,
    description: 'Recurring availability created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid time range, duplicate window, or overlapping window',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - doctor role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Doctor profile not found',
  })
  @Post()
  createAvailability(@Body() dto: CreateRecurringAvailabilityDto, @Req() req) {
    return this.availabilityService.createAvailability(dto, req.user);
  }

  @ApiOperation({
    summary: 'Get all recurring availability windows',
    description:
      'Returns every recurring availability window configured by the authenticated doctor.',
  })
  @ApiResponse({
    status: 200,
    description: 'Recurring availability list returned successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - doctor role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Doctor profile not found',
  })
  @Get()
  getAvailability(@Req() req) {
    return this.availabilityService.getAvailability(req.user);
  }

  @ApiOperation({
    summary: 'Get availability for a specific date',
    description:
      'Returns custom availability overrides for the date when present; otherwise returns recurring availability for that weekday.',
  })
  @ApiQuery({
    name: 'date',
    required: true,
    example: '2026-06-15',
    description: 'Date in YYYY-MM-DD format',
  })
  @ApiResponse({
    status: 200,
    description: 'Resolved availability returned successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid date format',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - doctor role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Doctor profile not found',
  })
  @Get('date')
  getAvailabilityForDate(
    @Query() query: GetAvailabilityForDateQueryDto,
    @Req() req,
  ) {
    return this.availabilityService.getAvailabilityForDate(
      query.date,
      req.user,
    );
  }

  @ApiOperation({
    summary: 'Create custom availability override',
    description:
      'Creates a date-specific availability override that takes precedence over recurring availability.',
  })
  @ApiResponse({
    status: 201,
    description: 'Custom availability override created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid time range, date, or duplicate override',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - doctor role required',
  })
  @ApiResponse({
    status: 404,
    description: 'Doctor profile not found',
  })
  @Post('override')
  createOverride(@Body() dto: CreateCustomAvailabilityDto, @Req() req) {
    return this.availabilityService.createOverride(dto, req.user);
  }

  @ApiOperation({
    summary: 'Update recurring availability window',
    description:
      'Updates an existing recurring availability window owned by the authenticated doctor.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Recurring availability record ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Recurring availability updated successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid time range, duplicate window, or overlapping window',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not the owner of this availability',
  })
  @ApiResponse({
    status: 404,
    description: 'Recurring availability or doctor profile not found',
  })
  @Patch(':id')
  updateAvailability(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateRecurringAvailabilityDto,
    @Req() req,
  ) {
    return this.availabilityService.updateAvailability(id, dto, req.user);
  }

  @ApiOperation({
    summary: 'Delete recurring availability window',
    description:
      'Deletes a recurring availability window owned by the authenticated doctor.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Recurring availability record ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Recurring availability deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - not the owner of this availability',
  })
  @ApiResponse({
    status: 404,
    description: 'Recurring availability or doctor profile not found',
  })
  @Delete(':id')
  deleteAvailability(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.availabilityService.deleteAvailability(id, req.user);
  }
}
