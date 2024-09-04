import React, { useState, useMemo } from 'react';
import { useTable, usePagination } from 'react-table';
import Chart from './Chart';
import * as XLSX from 'xlsx';

const DataTable = ({ data }) => {
  const [selectedCategory1, setSelectedCategory1] = useState('');
  const [selectedCategory2, setSelectedCategory2] = useState('');

  const columns = useMemo(
    () => [
      { Header: 'ID', accessor: 'id_collecte' },
      { Header: 'CSP', accessor: 'csp_lbl' },
      { Header: 'Catégorie', accessor: 'cat_achat' },
      { Header: 'Période', accessor: 'date_collecte' },
      { Header: 'Valeur', accessor: 'montant_achat' }
    ],
    []
  );

  const filteredDataCategory1 = useMemo(() => {
    if (!selectedCategory1) return [];
    return data.filter(item => item.cat_achat === selectedCategory1);
  }, [data, selectedCategory1]);

  const filteredDataCategory2 = useMemo(() => {
    if (!selectedCategory2) return [];
    return data.filter(item => item.cat_achat === selectedCategory2);
  }, [data, selectedCategory2]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state: { pageIndex },
    prepareRow
  } = useTable(
    {
      columns,
      data: data || [],
      initialState: { pageIndex: 0, pageSize: 10 }
    },
    usePagination
  );

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, 'data.xlsx');
  };

  if (!data || data.length === 0) {
    return <div>Aucune donnée disponible.</div>;
  }

  return (
    <div>
      <div>
        <label>
          Catégorie 1:
          <select onChange={(e) => setSelectedCategory1(e.target.value)}>
            <option value="">Sélectionner une catégorie</option>
            <option value="Category1">Catégorie 1</option>
            <option value="Category2">Catégorie 2</option>
          </select>
        </label>
        <label>
          Catégorie 2:
          <select onChange={(e) => setSelectedCategory2(e.target.value)}>
            <option value="">Sélectionner une catégorie</option>
            <option value="Category1">Catégorie 1</option>
            <option value="Category2">Catégorie 2</option>
          </select>
        </label>
      </div>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, headerGroupIndex) => {
            const headerGroupProps = headerGroup.getHeaderGroupProps();
            return (
              <tr key={`headerGroup-${headerGroupIndex}`} {...headerGroupProps}>
                {headerGroup.headers.map((column, columnIndex) => {
                  const columnProps = column.getHeaderProps();
                  return <th key={`column-${columnIndex}`} {...columnProps}>{column.render('Header')}</th>;
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, rowIndex) => {
            prepareRow(row);
            const rowProps = row.getRowProps();
            return (
              <tr key={`row-${rowIndex}`} {...rowProps}>
                {row.cells.map((cell, cellIndex) => {
                  const cellProps = cell.getCellProps();
                  return <td key={`cell-${cellIndex}`} {...cellProps}>{cell.render('Cell')}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          Précédent
        </button>
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} sur {pageOptions.length}
          </strong>
        </span>
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          Suivant
        </button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {selectedCategory1 && <Chart data={filteredDataCategory1} />}
        {selectedCategory2 && <Chart data={filteredDataCategory2} />}
      </div>
      <button onClick={handleExport}>
        Exporter vers Excel
      </button>
    </div>
  );
};

export default DataTable;
