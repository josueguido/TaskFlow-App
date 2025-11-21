import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
  projectName?: string;
  boardName?: string;
  onNewTask?: () => void;
  onProjectSelect?: (projectId: string) => void;
  onManageColumns?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  projectName,
  boardName,
  onNewTask,
  onProjectSelect,
  onManageColumns,
}) => {
  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      <Sidebar
        onProjectSelect={onProjectSelect}
        onManageColumns={onManageColumns}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          projectName={projectName}
          boardName={boardName}
          onNewTask={onNewTask}
        />
        
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};