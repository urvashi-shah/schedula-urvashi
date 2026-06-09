import {
    BadRequestException,
    Controller,
    Get,
    Query,
    Param,
    ParseIntPipe,
} from '@nestjs/common';

import {
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { DoctorService } from './doctor.service';
import { FindDoctorsQueryDto } from './dto/find-doctors-query.dto';
import { PaginatedDoctorsResponseDto } from './dto/paginated-doctors-response.dto';
import { Specialization } from './enums/specialization.enum';

@ApiTags('Doctor Discovery')
@Controller('doctor')
export class DoctorDiscoveryController {
    constructor(
        private readonly doctorService: DoctorService,
    ) {}

    @ApiOperation({
        summary: 'List doctors with search, filters, and pagination',
    })
    @ApiQuery({
        name: 'search',
        required: false,
        description:
            'Search by doctor name (partial, case-insensitive)',
        example: 'rahul',
    })
    @ApiQuery({
        name: 'specialization',
        required: false,
        enum: Specialization,
        description: 'Filter by specialization',
        example: Specialization.CARDIOLOGIST,
    })
    @ApiQuery({
        name: 'page',
        required: false,
        description: 'Page number (default: 1)',
        example: 1,
    })
    @ApiQuery({
        name: 'limit',
        required: false,
        description: 'Results per page (default: 10)',
        example: 10,
    })
    @ApiQuery({
        name: 'availability',
        required: false,
        description:
            'Filter by availability. true = doctors with availability data',
        example: true,
    })
    @ApiResponse({
        status: 200,
        description: 'Paginated list of doctors',
        type: PaginatedDoctorsResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid query parameters',
    })
    @Get()
    findAll(@Query() query: FindDoctorsQueryDto) {
        return this.doctorService.findAll(query);
    }

    @ApiOperation({
        summary: 'Get doctor details by ID',
    })
    @ApiParam({
        name: 'id',
        description: 'Doctor ID',
        example: 1,
    })
    @ApiResponse({
        status: 200,
        description: 'Complete doctor profile',
    })
    @ApiResponse({
        status: 404,
        description: 'Doctor not found',
    })
    @Get(':id')
    findById(
        @Param(
            'id',
            new ParseIntPipe({
                exceptionFactory: () =>
                    new BadRequestException(
                        'Invalid doctor id',
                    ),
            }),
        )
        id: number,
    ) {
        return this.doctorService.findById(id);
    }
}
