import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule,{cors:true});
  const config=new DocumentBuilder()
  .setTitle('Swagger Grab and Go')
  .setDescription('The Grab and Go API description')
  .setVersion('1.0')
  .build();

  const document=SwaggerModule.createDocument(app,config);
  SwaggerModule.setup('api',app,document);
    app.useGlobalPipes(new ValidationPipe({whitelist:true}))
  await app.listen(3000);
}
bootstrap();
