// Autor:      Lucas Alvarenga (lb.am.alvarenga@uel.br)
// Descrição:  Converte planilhas que seguem o padrão
//             estabelecido por '../template.xlsx' em
//             statements SQL compatíveis com as tabe
//             las definidas em '../../tables.sql' pa
//             ra facilitar o carregamento de dados.
// Criação:    2022-06-26

import { log } from ".";

import ExcelJS from "exceljs";

const xls2sql = async (fn: string) => {
  let res = "";

  const wk = new ExcelJS.Workbook();
  await wk.xlsx.readFile(fn);
  log.debug(`Opened workbook '${fn}'`);
  const ws = wk.worksheets[0];

  const cols = ws.columns;
  const prds = cols.shift()?.values;
  /* @ts-ignore */
  const date = prds!.splice(0, 2)[1].toISOString().split("T")[0];

  // For each  supermarket
  cols.forEach((col) => {
    const queryValues: any[] = [];
    if (!col.values) return;

    log.debug(`Building query for supermarket '${col.values[1]}'...`);

    // Build query for each product
    prds!.forEach((pr_id, i) => {
      // Contruct a query
      // "Date"      , "supermarket_uid", "product_uid", "Price"
      // '2022-06-26', 'XXXXXXXX'       , 'XXXXXXXX'   , '0.00'
      const values = `('${date}','${col.values![1]}','${pr_id}','${(
        col.values![i + 2] as any
      ).toFixed(2)}')`;

      queryValues.push(values);
    });

    const query = `INSERT INTO public.timeseries ("Date", "supermarket_uid", "product_uid", "Price") VALUES ${queryValues};`;
    log.debug(query);

    res += query;
  });

  return res;
};

export default xls2sql;
