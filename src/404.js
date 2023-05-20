import { Link } from "react-router-dom";

const NoPage = () => {
    return (
    <div className="block">
        <Link className='myButtonNav' style={{ width: '200px' }} to="/" >Return to Home page</Link>
        <h2>Error - 404</h2>
        <h2>The requested page does not exist</h2>
    </div>
    )
  };
  
  export default NoPage;