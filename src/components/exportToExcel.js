/**
 * @fileoverview Module d'exportation de données vers un fichier Excel.
 * @requires xlsx
 * @requires file-saver
 */
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**
 * Exporter les données filtrées vers un fichier Excel.
 * 
 * @function exportToExcel
 * @param {Object[]} data - Un tableau d'objet  s représentant les données à exporter.
 * @param {string} filename - Le nom du fichier Excel à générer (sans l'extension).
 * @throws {Error} Lance une erreur si la création du fichier Excel échoue.
 */
export const exportToExcel = (data, filename) => {
  
  // Création d'une feuille de calcul à partir des données JSON
  const ws = XLSX.utils.json_to_sheet(data);
  
  // Création d'un nouveau classeur
  const wb = XLSX.utils.book_new();
  
  // Ajout de la feuille de calcul au classeur
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  
  // Conversion du classeur en un buffer d'octets
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

  // Création d'un Blob à partir du buffer
  const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });

  // Sauvegarde du Blob en tant que fichier Excel
  saveAs(dataBlob, `${filename}.xlsx`);
};
