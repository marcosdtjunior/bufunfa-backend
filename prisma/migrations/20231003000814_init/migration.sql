-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "photo" TEXT,
    "background" TEXT,
    "type" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ceo" (
    "userId" INTEGER NOT NULL,
    "cpf" TEXT NOT NULL,

    CONSTRAINT "ceo_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slogan" TEXT,
    "description" TEXT,
    "cnpj" TEXT NOT NULL,
    "logo" TEXT,
    "salary" INTEGER NOT NULL,
    "ceoId" INTEGER NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "userId" INTEGER NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "employeeCompany" (
    "employeeId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,

    CONSTRAINT "employeeCompany_pkey" PRIMARY KEY ("employeeId","companyId")
);

-- CreateTable
CREATE TABLE "task" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "value" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "task_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employeeTask" (
    "employeeId" INTEGER NOT NULL,
    "taskId" INTEGER NOT NULL,
    "employeeStatus" TEXT NOT NULL DEFAULT 'a fazer',
    "ceoStatus" TEXT NOT NULL DEFAULT 'pendente',

    CONSTRAINT "employeeTask_pkey" PRIMARY KEY ("employeeId","taskId")
);

-- CreateTable
CREATE TABLE "expense" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "value" INTEGER NOT NULL,
    "type" BOOLEAN NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employeeExpense" (
    "employeeId" INTEGER NOT NULL,
    "expenseId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "employeeExpense_pkey" PRIMARY KEY ("employeeId","expenseId")
);

-- CreateTable
CREATE TABLE "loan" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "accepted" BOOLEAN NOT NULL DEFAULT false,
    "employeeId" INTEGER NOT NULL,

    CONSTRAINT "loan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ceo_cpf_key" ON "ceo"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "company_cnpj_key" ON "company"("cnpj");

-- AddForeignKey
ALTER TABLE "ceo" ADD CONSTRAINT "ceo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company" ADD CONSTRAINT "company_ceoId_fkey" FOREIGN KEY ("ceoId") REFERENCES "ceo"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employeeCompany" ADD CONSTRAINT "employeeCompany_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employeeCompany" ADD CONSTRAINT "employeeCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "task" ADD CONSTRAINT "task_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employeeTask" ADD CONSTRAINT "employeeTask_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employeeTask" ADD CONSTRAINT "employeeTask_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES "task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expense" ADD CONSTRAINT "expense_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employeeExpense" ADD CONSTRAINT "employeeExpense_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employeeExpense" ADD CONSTRAINT "employeeExpense_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan" ADD CONSTRAINT "loan_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
