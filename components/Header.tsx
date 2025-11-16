
import React from 'react';
import { AppGridIcon, ArrowDownIcon, DoubleArrowLeftIcon, DoubleArrowRightIcon } from './icons/Icons';

interface HeaderProps {
  onToggleSidebar: () => void;
  isSidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ onToggleSidebar, isSidebarCollapsed }) => {
  return (
    <header className="flex-shrink-0 bg-white h-12 flex items-center justify-between shadow-[inset_0_-4px_4px_-6px_#222] z-10">
      <div className="flex items-center h-full">
        <div className={`flex items-center h-full transition-all duration-300 ${isSidebarCollapsed ? 'w-[72px]' : 'w-[228px]'}`}>
             <button
                onClick={onToggleSidebar}
                className="w-full h-full flex items-center justify-center hover:bg-gray-100 transition-colors"
                title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              >
                {isSidebarCollapsed ? <DoubleArrowRightIcon /> : <DoubleArrowLeftIcon />}
            </button>
        </div>
      </div>
      <div className="flex items-center gap-6 px-4">
        <div className="flex items-center gap-4">
          <button className="text-[#61677D] hover:text-[#1e22aa]">
            <AppGridIcon />
          </button>
        </div>
        <div className="h-6 border-l border-[#d7ddec]"></div>
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-7 h-7 bg-gray-200 rounded-full overflow-hidden">
            <img src="https://picsum.photos/28/28" alt="User" />
          </div>
          <span className="text-xs font-medium group-hover:text-[#1e22aa] transition-colors">realvisiondi</span>
          <div className="text-[#1C1B1F] group-hover:text-[#1e22aa] transition-colors">
            <ArrowDownIcon />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;