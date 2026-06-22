import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';

import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { SlotService } from './services/slot.service';

@ApiTags('Slots')
@Controller()
export class SlotController {
  constructor(
    private readonly slotService: SlotService,
  ) { }

  @ApiOperation({
    summary: 'Get available slots for a doctor',
  })
  @ApiParam({
    name: 'doctorId',
    example: 51,
    description: 'Doctor profile id',
  })
  @ApiQuery({
    name: 'date',
    example: '2026-06-22',
    description: 'Date in YYYY-MM-DD format',
  })
  @Get('doctor/:doctorId/slots')
  getSlots(
    @Param(
      'doctorId',
      ParseIntPipe,
    )
    doctorId: number,

    @Query('date')
    date: string,
  ) {
    return this.slotService.getSlots(
      doctorId,
      date,
    );
  }
  @ApiOperation({
    summary:
      'Find next available appointment date',
  })
  @ApiParam({
    name: 'doctorId',
    example: 51,
    description:
      'Doctor profile id',
  })
  @Get(
    'doctor/:doctorId/next-available',
  )
  findNextAvailableDate(
    @Param(
      'doctorId',
      ParseIntPipe,
    )
    doctorId: number,
  ) {
    return this.slotService.findNextAvailableDate(
      doctorId,
    );
  }
}