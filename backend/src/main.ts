import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. Habilitar CORS para que el frontend pueda consumir la API desde otro origen
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 2. Habilitar prefijo global para la API REST
  app.setGlobalPrefix('api');

  // 3. Configurar las validaciones globales
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 3. Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Tienda Online API')
    .setDescription('API REST para la gestión de clientes, productos, categorías y órdenes')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // 4. Integrar Scalar en la ruta '/reference' (NO usar '/api' porque choca con los endpoints)
  app.use(
    '/reference',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );

  // 5. Iniciar el servidor usando el puerto dinámico de Render y escuchando en '0.0.0.0'
  const port = process.env.PORT || 3000; // <-- MODIFICADO: Lee el puerto de Render de forma dinámica
  await app.listen(port, '0.0.0.0');    // <-- MODIFICADO: Añadido '0.0.0.0' obligatorio para Render
  
  console.log(`🚀 Servidor corriendo en el puerto: ${port}`);
}
bootstrap();