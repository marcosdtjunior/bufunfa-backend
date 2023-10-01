const { PrismaClient } = require("@prisma/client");

export const prisma = new PrismaClient();

class includes {
  id?: number;
  name?: string;
  ceos?: boolean;
  employees?: boolean;
  statusExpenseId?: boolean;
  employeeTasks?: {
    include: {
      tasks: boolean;
    };
  };
  expenses?: boolean;
}

/**
 * Encontra um registro único em uma tabela específica baseado na consulta por um id ou um atributo único.
 * 
 * @param table O nome da tabela em que o registro será encontrado.
 * @param data Opcional. Os critérios de pesquisa para encontrar o registro, por exemplo pode ser usado id ou email.
 * @param includes Opcional. Os relacionamentos incluídos no resultado da consulta.
 * @returns O registro encontrado.
 */

export async function findUnique(table: string, data?: any, includes?: includes) {
  const where = data;
  const infos = await prisma[table].findUnique({
    where,
    include: includes ? includes : undefined,
  });
  return infos;
}

/**
 * Função para buscar vários registros em uma tabela específica com base em uma condição fornecida.
 *
 * @param table O nome da tabela do banco de dados na qual deseja buscar o registro.
 * @param data Opcional. Os critérios de pesquisa para encontrar o registro.
 * @param includes (opcional) Um objeto com opções de inclusão de relacionamentos.
 * @returns Uma Promise que resolve para o registro encontrado.
 */

export async function findMany(table: string, data?: any, includes?: includes) {
  const where = data;
  const infos = await prisma[table].findMany({
    where,
    include: includes ? includes : undefined,
  });
  return infos;
}

/**
 * Cria ou atualiza um registro em uma tabela específica.
 * @param table O nome da tabela em que o registro será criado ou atualizado.
 * @param data Os dados do registro a serem criados ou atualizados.
 * @param id Opcional. O valor da chave primária do registro a ser atualizado.
 * @returns O registro criado ou atualizado.
 */

export async function createOrUpdate(table: string, data: any, id?: number) {

  if (id) {
    return await prisma[table].update({
      where: { id },
      data: { ...data },
    });
  }

  return await prisma[table].create({
    data,
  });
}

/**
 * Exclui um registro de uma tabela específica com base no valor da chave primária.
 * @param table O nome da tabela em que o registro será excluído.
 * @param id O valor da chave primária do registro a ser excluído.
 * @returns O resultado da exclusão do registro.
 */

export async function deleteOne(table: string, id: number) {
  return await prisma[table].delete({
    where: { id: Number(id) },
  });
}

export async function findFirst(table: string, data: any) {

  const infos = await prisma[table].findFirst({
    where: data
  })

  return infos;
}