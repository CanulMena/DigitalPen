-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('ADMIN', 'USUARIO');

-- CreateEnum
CREATE TYPE "StatusArticulo" AS ENUM ('ACTIVO', 'DESACTIVO');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,
    "rol" "Rol" NOT NULL DEFAULT 'USUARIO',

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Articulo" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripción" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "status" "StatusArticulo" NOT NULL DEFAULT 'ACTIVO',
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "Articulo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_nombre_key" ON "Usuario"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_correo_key" ON "Usuario"("correo");

-- AddForeignKey
ALTER TABLE "Articulo" ADD CONSTRAINT "Articulo_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
