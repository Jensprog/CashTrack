/**
 * Database connection utility using Prisma ORM
 * 
 * This file creates and exports a Prisma client instance that connects to the MySQL database.
 * It uses a global variable in development to prevent multiple connections during hot reloading.
 * 
 * The Prisma client provides an interface to perform CRUD operations on the database tables
 * that are defined in the schema.prisma file.
 */
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global;

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;