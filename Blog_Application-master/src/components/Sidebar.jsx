import React from "react";
import {
  Home,
  Library,
  User,
  FileText,
  BarChart2,
} from "lucide-react";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <aside className="sidebar">
    
     <div className="logo" style={{marginLeft:"20px",marginRight:"20px"}}>CONTENTS</div>

      <NavItem icon={<Home size={20} />} label="Home" />
      <NavItem icon={<Library size={20} />} label="Library" />
       <Link to="/profile"><NavItem icon={<User size={20} />} label="Profile" /></Link>
      <NavItem icon={<FileText size={20} />} label="Stories" />
      <NavItem icon={<BarChart2 size={20} />} label="Stats" />
    </aside>
  );
};

const NavItem = ({ icon, label }) => {
  return (
    <div className="nav-item">
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </div>
  );
};

export default Sidebar;
