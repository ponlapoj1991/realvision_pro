
import React from 'react';
import { RealVisionLogo, RealVisionTitle, DashboardIcon, AIModelIcon, KnowledgeIcon, IntentIcon, ChatFlowIcon, ChatUserIcon, ModelGroupIcon, SettingIcon, PlaygroundIcon, LogsIcon, ChevronUpIcon } from './icons/Icons';

interface SidebarProps {
  isCollapsed: boolean;
}

const menuItems = [
  { title: 'Dashboard', icon: <DashboardIcon />, route: '#dashboard' },
  { title: 'AI Model', icon: <AIModelIcon />, route: '#ai-model' },
  { title: 'Knowledge Mgt', icon: <KnowledgeIcon />, route: '#knowledge', hasSubmenu: true },
  { title: 'Intent', icon: <IntentIcon />, route: '#intent', hasSubmenu: true },
  { title: 'Chat Flow', icon: <ChatFlowIcon />, route: '#chat-flow' },
  { title: 'Chat User Mgt', icon: <ChatUserIcon />, route: '#chat-user' },
  { title: 'Model Grouping', icon: <ModelGroupIcon />, route: '#model-group' },
  { title: 'Setting', icon: <SettingIcon />, route: '#setting', hasSubmenu: true },
  { title: 'Chat Playground', icon: <PlaygroundIcon />, route: '#chat-playground', active: true },
  { title: 'Logs', icon: <LogsIcon />, route: '#logs' },
];

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed }) => {
  return (
    <nav className={`bg-white transition-all duration-300 flex flex-col h-full border-r border-gray-200/60 ${isCollapsed ? 'w-[72px]' : 'w-[228px]'}`}>
      <div className="flex items-center h-12 flex-shrink-0 px-4 shadow-[inset_0_-4px_4px_-6px_#222]">
        <RealVisionLogo />
        {!isCollapsed && (
          <div className="ml-3 transition-opacity duration-300">
             <RealVisionTitle />
          </div>
        )}
      </div>

      <div className="flex-grow p-2 overflow-y-auto overflow-x-hidden">
        <div className="text-[#a6b0cf] text-xs font-semibold px-2 py-2.5 uppercase tracking-wider">
          {!isCollapsed && 'Menu'}
        </div>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.route}
                className={`flex items-center h-[42px] px-2 rounded-md mb-1 transition-colors ${
                  item.active
                    ? 'bg-[#1e22aa] text-white'
                    : 'text-[#61677d] hover:bg-[#1e22aa] hover:text-white'
                }`}
                title={isCollapsed ? item.title : ''}
              >
                <div className={`w-[38px] h-[38px] flex items-center justify-center ${item.active ? '[&_svg]:brightness-0 [&_svg]:invert' : ''}`}>
                  {item.icon}
                </div>
                {!isCollapsed && (
                  <span className="ml-2 text-sm font-semibold whitespace-nowrap">{item.title}</span>
                )}
                {!isCollapsed && item.hasSubmenu && (
                  <div className="ml-auto text-gray-400 group-hover:text-white">
                    <ChevronUpIcon />
                  </div>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-shrink-0 p-5 whitespace-nowrap overflow-hidden">
        {!isCollapsed && (
          <>
            <div className="text-[10px] font-semibold text-[#61677d]">1.4.0/23</div>
            <div className="text-[9px] text-[#b3b3b3] font-semibold leading-3">Update At: 2025-11-05 13:56</div>
            <div className="text-[9px] text-[#0057d8] mt-2">
              <a href="#" className="hover:underline">Privacy Policy</a> | <a href="#" className="hover:underline">Terms &amp; Conditions</a>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;
