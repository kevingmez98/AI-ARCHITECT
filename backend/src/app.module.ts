// Define el 'plano' de la aplicación
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
// Configuración
@Module({
  // Registrar modulos (contenedor con servicios, controladores y otros elementos)
  imports: [ConfigModule.forRoot({ isGlobal: true })], // Importar otros modulos. en este caso registra y coloca globalmente el servicio de variables de entorno
  controllers: [], // Controladores de este modulo
  providers: [], // Servicios para administrar mediante inyección de dependencias
})
export class AppModule {}
