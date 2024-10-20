import contentStyles from "../styles/Content";
import DataConversion from "./DataConversion"

const Content = () => {
  return (
      <div style={contentStyles.main}>
        <DataConversion />
      </div>
  );
}

export default Content;
