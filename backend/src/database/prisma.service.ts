/*Prisma 7 necesita un adapter para comunicarse con MariaDB. 
Ese adapter se configura una única vez dentro de PrismaService. 
PrismaService es el punto de acceso a la base de datos dentro de NestJS y 
gestiona automáticamente la apertura y cierre de conexiones. 

Posteriormente, los repositorios (o los servicios, según la arquitectura)
 utilizan PrismaService para ejecutar consultas sin tener que preocuparse 
 por la configuración de la conexión. */
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

 @Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    const adapter = new PrismaMariaDb({
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT || '3306', 10),
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      connectionLimit: 5,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
