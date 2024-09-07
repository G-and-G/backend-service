import { ApiProperty } from "@nestjs/swagger";
import { DeviceType } from "@prisma/client";
import { IsString } from "class-validator";

export class CreateDeviceDTO{
  @IsString()
  @ApiProperty()
  playerId:string;

  @IsString()
  @ApiProperty()
  deviceType:DeviceType;

  @IsString()
  @ApiProperty()
  deviceName:string;

}