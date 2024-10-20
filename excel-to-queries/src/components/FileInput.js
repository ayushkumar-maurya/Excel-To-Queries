import fileInputStyles from '../styles/FileInput';
import '../css/fileInput.css';

const FileInput = () => {
  return (
    <div style={fileInputStyles.main} className='main'>
      <div className="mb-0">
        <label htmlFor="file" className="form-label">Select Excel File</label>
        <input className="form-control" type="file" id="file" />
      </div>

      <div
        className="progress"
        role="progressbar"
        aria-label="Conversion Progress"
        aria-valuenow="25"
        aria-valuemin="0"
        aria-valuemax="100"
        style={fileInputStyles.progress}
      >
        <div className="progress-bar bg-success" style={{width: '25%'}}>25%</div>
      </div>

      <button type="button" className="btn btn-secondary">Convert</button>

      <div className="alert alert-light" role="alert" style={fileInputStyles.note}>
        Name of each sheet must be same as that of table.<br />
        Similarly, name of the table columns should be mentioned in the first row of each sheet.
      </div>
    </div>
  );
}

export default FileInput;
