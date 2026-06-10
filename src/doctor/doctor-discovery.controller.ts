import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Query,
    Param,
    ParseIntPipe,
} from '@nestjs/common';

import {
    ApiBody,
    ApiOperation,
    ApiParam,
    ApiQuery,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

import { DoctorService } from './doctor.service';
import { DoctorRecommendationService } from './services/doctor-recommendation.service';
import { FindDoctorsQueryDto } from './dto/find-doctors-query.dto';
import { PaginatedDoctorsResponseDto } from './dto/paginated-doctors-response.dto';
import { RecommendDoctorDto } from './dto/recommend-doctor.dto';
import { DoctorRecommendationResponseDto } from './dto/doctor-recommendation-response.dto';
import { Specialization } from './enums/specialization.enum';

@ApiTags('Doctor Discovery')
@Controller('doctor')
export class DoctorDiscoveryController {
    constructor(
        private readonly doctorService: DoctorService,
        private readonly doctorRecommendationService: DoctorRecommendationService,
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
        summary:
            'Get AI-powered doctor recommendations from symptoms',
        description:
            'Maps patient symptoms to relevant specialties using OpenAI, then returns the top 3 most experienced matching doctors. Public endpoint — no authentication required.',
    })
    @ApiBody({ type: RecommendDoctorDto })
    @ApiResponse({
        status: 200,
        description:
            'Doctor recommendations based on symptoms',
        type: DoctorRecommendationResponseDto,
    })
    @ApiResponse({
        status: 400,
        description: 'Invalid symptoms input',
    })
    @ApiResponse({
        status: 502,
        description: 'Invalid OpenAI response',
    })
    @ApiResponse({
        status: 503,
        description:
            'Recommendation service unavailable or OpenAI failure',
    })
    @Post('recommend')
    recommend(
        @Body() recommendDoctorDto: RecommendDoctorDto,
    ) {
        return this.doctorRecommendationService.recommend(
            recommendDoctorDto.symptoms,
        );
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
