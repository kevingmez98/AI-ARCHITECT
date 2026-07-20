// Considerado el encendido
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config'; // Servicio de variables de configuración
import { AppModule } from './app.module'; // Modulo raiz

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // Crea la aplicación
  const configService = app.get(ConfigService); // Obtiene la instancia de configService

  app.setGlobalPrefix('api'); // prefijo global de la app

  const port = configService.get<number>('PORT', 3000); // Configurar el puerto, si no encuentra port en el .env usa 3000
  await app.listen(port); // aceptar conexiones
}
bootstrap();
