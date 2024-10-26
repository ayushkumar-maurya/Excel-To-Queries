import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import dataConversionStyles from '../styles/DataConversion';
import '../css/DataConversion.css';

const DataConversion = () => {
  const [progressValue, setProgressValue] = useState(0);
  const fileInput = useRef(null);
  const fileName = useRef('');

  const convertData = () => {
    const file = fileInput.current.files[0];

    if (file) {
      let fileNameWithExt = file.name;
      let extLoc = fileNameWithExt.lastIndexOf('.');
      fileName.current = fileNameWithExt.substring(0, extLoc !== -1 ? extLoc : fileNameWithExt.length);

      const reader = new FileReader();
  
      reader.onload = e => {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });
        setProgressValue(25);

        let dbTables = workbook.SheetNames.map(sheetName => {
          let sheet = workbook.Sheets[sheetName];
          let sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          return processData(sheetName, sheetData);
        });
        setProgressValue(50);

        const queries = getQueries(dbTables);
        setProgressValue(75);

        downloadSqlFile(queries);
        setProgressValue(100);
      };

      reader.readAsArrayBuffer(file);
    }
  }

  // Processing Records.
  const processData = (sheetName, sheetData) => {
    let columnNames, records;

    if(sheetData.length > 0) {
      columnNames = sheetData[0].map(columnName => columnName.toLowerCase());
      records = sheetData.slice(1).map(record => {
        return record.map(value => typeof value === 'string' ? value.replace("'", "''") : value)
      })
    };

    return {
      tableName: sheetName.toLowerCase(),
      columnNames: columnNames,
      records: records
    }
  }

  // Converting Records to SQL Queries.
  const getQueries = tables => {
    let queries = '';

    for (let table of tables) {
      queries += `-- ${table.tableName.toUpperCase()}\n`;

      for (let record of table.records) {
        let numOfCols = table.columnNames.length;

        if (numOfCols > 0) {
          queries += `INSERT INTO ${table.tableName} (${table.columnNames[0]}`
          for (let i = 1; i < numOfCols; i++)
            queries += `, ${table.columnNames[i]}`
          queries += `)\nVALUES ('${record[0]}'`
          for (let i = 1; i < numOfCols; i++)
            queries += `, '${record[i]}'`
          queries += ');\n'
        }
      }
      queries += '\n\n';
    }
    return queries;
  };

  // Downloading SQL File.
  const downloadSqlFile = queries => {
    const blob = new Blob([queries], { type: 'application/sql' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = fileName.current + '.sql';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  return (
    <div style={dataConversionStyles.main} className='main'>
      <div className="mb-0">
        <label htmlFor="file" className="form-label">Select Excel File</label>
        <input className="form-control" type="file" ref={fileInput} onChange={() => setProgressValue(0)} id="file" />
      </div>

      <div
        className="progress"
        role="progressbar"
        aria-label="Conversion Progress"
        aria-valuenow={progressValue}
        aria-valuemin="0"
        aria-valuemax="100"
        style={dataConversionStyles.progress}
      >
        <div
          className="progress-bar bg-success" style={{width: progressValue + '%'}}>{progressValue + '%'}</div>
      </div>

      <button type="button" className="btn btn-secondary" onClick={convertData}>Convert</button>

      <div className="alert alert-light" role="alert" style={dataConversionStyles.note}>
        Name of each sheet must be same as that of table.<br />
        Similarly, name of the table columns should be mentioned in the first row of each sheet.
      </div>
    </div>
  );
}

export default DataConversion;
