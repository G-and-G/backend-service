import { Injectable } from '@nestjs/common';
// import { PrismaService } from './prisma.service'; // Your Prisma service
// import { CreateReviewDTO } from './dto/createReviewDTO';
import { PrismaClient, Review } from '@prisma/client'; // Import the Prisma Review type
import { CreateReviewDTO } from './dto/create-review.dto';
const prisma = new PrismaClient();
@Injectable()
export class ReviewService {
  constructor() {
    //
  }

  async createReview(reviewData: CreateReviewDTO): Promise<Review> {
    const { user_id, product_id, description, title, rating } = reviewData;

    return prisma.review.create({
      data: {
        user: { connect: { id: user_id } },
        // product: { connect: { menuItem_id: product_id } },
        description,
        title,
      },
    });
  }

  async getAllReviews(): Promise<Review[]> {
    return prisma.review.findMany();
  }
}
