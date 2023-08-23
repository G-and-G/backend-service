import { Controller, Post, Get, Body } from '@nestjs/common';
// import { ReviewService } from './review.service';
import { ReviewService } from './reviews.service';
// import { CreateReviewDTO } from './dto/createReviewDTO';
import { CreateReviewDTO } from './dto/create-review.dto';
import { Review } from '@prisma/client'; // Import the Prisma Review type
import { ApiTags } from '@nestjs/swagger';
@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async createReview(@Body() reviewData: CreateReviewDTO): Promise<Review> {
    return this.reviewService.createReview(reviewData);
  }

  @Get()
  async getAllReviews(): Promise<Review[]> {
    return this.reviewService.getAllReviews();
  }
}
