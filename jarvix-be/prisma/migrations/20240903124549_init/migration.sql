-- CreateTable
CREATE TABLE "Task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "comment" TEXT,

    CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
);
