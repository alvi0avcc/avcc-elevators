import { Outlet, Link } from "react-router-dom";
import TopHeader from './js/top_header.js';

const Layout = () => {
  return (
    <>
    <TopHeader/>

    <Outlet />
    </>
  )
};

export default Layout;