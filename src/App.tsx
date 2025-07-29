import { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { ToastProvider } from './contexts/ToastContext';
import { Sidebar } from './components/Sidebar';
import { UserManagement } from './components/UserManagement';
import { WorkflowManager } from './components/workflow/WorkflowManager';
import { DigitalSignatures } from './components/DigitalSignatures';
import { SignatureTemplates } from './components/SignatureTemplates';
import { SignatureDocuments } from './components/SignatureDocuments';
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
      case 'signature-templates':
        return <SignatureTemplates />;
      case 'signature-documents':
        return <SignatureDocuments />;
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
    <ToastProvider>
      <div className="h-screen bg-gray-50 flex">
        <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-hidden bg-gray-50">
            {renderModule()}
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;