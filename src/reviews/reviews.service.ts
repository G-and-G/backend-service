import { Injectable } from '@nestjs/common';
// import { PrismaService } from './prisma.service'; // Your Prisma service
import { PrismaService } from 'prisma/prisma.service';
// import { CreateReviewDTO } from './dto/createReviewDTO';
import { CreateReviewDTO } from './dto/create-review.dto';
import { Review } from '@prisma/client'; // Import the Prisma Review type

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(reviewData: CreateReviewDTO): Promise<Review> {
    const { user_id, product_id, description, rating } = reviewData;

    return this.prisma.review.create({
      data: {
        user: { connect: { id: user_id } },
        product: { connect: { menuItem_id: product_id } },
        description,
        rating,
        date: new Date(),
      },
    });
  }

  async getAllReviews(): Promise<Review[]> {
    return this.prisma.review.findMany();
  }
}
