import { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import dataConversionStyles from '../styles/DataConversion';
import '../css/DataConversion.css';

const DataConversion = () => {
  const [progressValue, setProgressValue] = useState(0);
  const fileInput = useRef(null);
  const fileName = useRef('');

  const readFile = () => {
    setProgressValue(0);
  
    const file = fileInput.current.files[0];
    if (file) {      
      let fileNameWithExt = file.name;
      let extLoc = fileNameWithExt.lastIndexOf('.');
      fileName.current = fileNameWithExt.substring(0, extLoc !== -1 ? extLoc : fileNameWithExt.length);

      const reader = new FileReader();
  
      reader.onload = e => {
        const arrayBuffer = e.target.result;
        const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' });

        let excelData = workbook.SheetNames.map(sheetName => {
          let sheet = workbook.Sheets[sheetName];
          let sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          return { sheetName, sheetData };
        });

        console.log(excelData);
      };

      reader.readAsArrayBuffer(file);
    }
  }

  return (
    <div style={dataConversionStyles.main} className='main'>
      <div className="mb-0">
        <label htmlFor="file" className="form-label">Select Excel File</label>
        <input className="form-control" type="file" ref={fileInput} id="file" />
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

      <button type="button" className="btn btn-secondary" onClick={readFile}>Convert</button>

      <div className="alert alert-light" role="alert" style={dataConversionStyles.note}>
        Name of each sheet must be same as that of table.<br />
        Similarly, name of the table columns should be mentioned in the first row of each sheet.
      </div>
    </div>
  );
}

export default DataConversion;
