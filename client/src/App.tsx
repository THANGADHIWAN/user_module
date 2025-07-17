import React, { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Sidebar } from './components/Sidebar';
import { UserManagement } from './components/UserManagement';
import { WorkflowManager } from './components/workflow/WorkflowManager';
import { DigitalSignatures } from './components/DigitalSignatures';
import { Notifications } from './components/Notifications';
import { SystemSettings } from './components/SystemSettings';
import { HelpSupport } from './components/HelpSupport';
import { CustomFields } from './components/CustomFields';

function App() {
  const [activeModule, setActiveModule] = useState('users');

  const renderModule = () => {
    switch (activeModule) {
      case 'users':
        return <UserManagement />;
      case 'workflows':
        return (
          <ReactFlowProvider>
            <WorkflowManager />
          </ReactFlowProvider>
        );
      case 'signatures':
        return <DigitalSignatures />;
      case 'notifications':
        return <Notifications />;
      case 'custom-fields':
        return <CustomFields />;
      case 'settings':
        return <SystemSettings />;
      case 'help':
        return <HelpSupport />;
      default:
        return <UserManagement />;
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex">
      <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-hidden bg-gray-50">
          {renderModule()}
        </main>
      </div>
    </div>
  );
}

export default App;