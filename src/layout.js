import { Outlet, Link } from "react-router-dom";
import TopHeader from './js/top_header.js';
import { Elevators } from "./js/elevators.js";

const Layout = (props) => {
  let site_path = window.location.hash;
  return (
    <>
    <TopHeader/>

    { site_path =='' ? '' : <AdditionalReportMenu/> }   

    <Outlet/>
    </>
  )
};

export default Layout;

function AdditionalReportMenu(){
  return (
    <div 
      id='menu' 
      className='block' 
      style={{ display:'flex', flexDirection: 'row', justifyContent: 'flex-end' }}
      >
      <button 
        style={{ width: '50px'}}
        onClick={ ()=>( window.print() ) }
        >Print</button>
    </div>
  )
}