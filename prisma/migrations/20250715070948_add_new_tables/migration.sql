-- CreateTable
CREATE TABLE "RegistrosIoT" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "temperatura" DOUBLE PRECISION NOT NULL,
    "humedad" DOUBLE PRECISION NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "RegistrosIoT_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlarmaGas" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gas" DOUBLE PRECISION NOT NULL,
    "usuarioId" INTEGER NOT NULL,

    CONSTRAINT "AlarmaGas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RegistrosIoT" ADD CONSTRAINT "RegistrosIoT_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlarmaGas" ADD CONSTRAINT "AlarmaGas_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
