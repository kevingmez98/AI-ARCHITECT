// Define el 'plano' de la aplicación
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';

// Configuración
@Module({
  // Registrar modulos (contenedor con servicios, controladores y otros elementos)
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaModule], // Importar otros modulos. en este caso registra y coloca globalmente el servicio de variables de entorno
  controllers: [], // Controladores de este modulo
  providers: [], // Servicios para administrar mediante inyección de dependencias
})
export class AppModule {}
