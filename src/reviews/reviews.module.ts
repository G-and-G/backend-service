import { Module } from "@nestjs/common";
import { ReviewController } from "./order.controller";
import { ReviewService } from "./reviews.service";

@Module({
    imports:[],
    controllers:[ReviewController],
    providers:[ReviewService]
})
export class ReviewModule {}