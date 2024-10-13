import fileInputStyles from '../styles/FileInput';
import '../css/FileInput.css';

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
    </div>
  );
}

export default FileInput;
