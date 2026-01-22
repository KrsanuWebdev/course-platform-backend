import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { MongooseExceptionFilter } from './shared/filters/mongoose-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // transform: true,
    }),
  );
  app.useGlobalFilters(new MongooseExceptionFilter());

  await configureSwagger(app);
  app.enableCors();
  await app.listen(process.env.APP_PORT, () => {
    console.log(`server run on port ${process.env.APP_PORT}`);
  });
}

if (process.env.NODE_ENV == 'dev') {
  bootstrap();
}

async function configureSwagger(app: any) {
  if (process.env.SWAGGERUI == 'enable') {
    const options = new DocumentBuilder().setTitle('Course Platform API').setDescription('APIs for Category, SubCategory, and Course management').setVersion('1.0.0').addBearerAuth().build();
    let document = SwaggerModule.createDocument(app, options);
    document.tags = [
      { name: 'App Module', description: "Application Core API'S" },
      { name: 'Category Module', description: 'APIs for Category management' },
    ];

    SwaggerModule.setup('swagger', app, document);
  }
}
