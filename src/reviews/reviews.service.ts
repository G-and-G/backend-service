import { Injectable } from '@nestjs/common';
// import { PrismaService } from './prisma.service'; // Your Prisma service
import { PrismaService } from 'prisma/prisma.service';
// import { CreateReviewDTO } from './dto/createReviewDTO';
import { CreateReviewDTO } from './dto/create-review.dto';
import { PrismaClient, Review } from '@prisma/client'; // Import the Prisma Review type
const prisma = new PrismaClient();
@Injectable()
export class ReviewService {
  constructor() {}

  async createReview(reviewData: CreateReviewDTO): Promise<Review> {
    const { user_id, product_id, description, rating } = reviewData;

    return prisma.review.create({
      data: {
        user: { connect: { id: user_id } },
        product: { connect: { menuItem_id: product_id } },
        description,
        createdAt: new Date(),
      },
    });
  }

  async getAllReviews(): Promise<Review[]> {
    return prisma.review.findMany();
  }
}
