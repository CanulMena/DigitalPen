/*
  Warnings:

  - You are about to drop the column `descripción` on the `Articulo` table. All the data in the column will be lost.
  - Added the required column `descripcion` to the `Articulo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `introduccion` to the `Articulo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Articulo" DROP COLUMN "descripción",
ADD COLUMN     "descripcion" TEXT NOT NULL,
ADD COLUMN     "introduccion" TEXT NOT NULL;
