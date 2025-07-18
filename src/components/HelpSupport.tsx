import React, { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Mail, 
  Phone, 
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Search,
  Book,
  Video,
  FileText
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  message: string;
  timestamp: string;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How do I create a new user account?',
    answer: 'To create a new user account, navigate to User Management, click "Add User", fill in the required information including name, email, role, and privileges, then click "Create User".',
    category: 'User Management'
  },
  {
    id: '2',
    question: 'How do I set up digital signatures?',
    answer: 'Go to Digital Signatures module, create a template, configure the signature fields, and assign signers. Users need to have digital signature enabled in their profile.',
    category: 'Digital Signatures'
  },
  {
    id: '3',
    question: 'How do I create a workflow?',
    answer: 'In the Workflow Builder, click "Create Workflow", drag nodes from the sidebar to the canvas, connect them by dragging from node handles, and configure each node\'s properties.',
    category: 'Workflows'
  },
  {
    id: '4',
    question: 'What are the different user roles available?',
    answer: 'Available roles include Admin, Lab Manager, QA Officer, QC Analyst, Analyst Trainee, Auditor, Regulatory Affairs, and IT Support. Each role has different privilege levels.',
    category: 'User Management'
  },
  {
    id: '5',
    question: 'How do I export user data?',
    answer: 'In the User Management module, use the "Export CSV" button to download user data. You can filter users before exporting to get specific data sets.',
    category: 'Data Export'
  },
  {
    id: '6',
    question: 'How do I configure system notifications?',
    answer: 'Go to System Settings, navigate to Notifications section, and configure email templates, recipients, and trigger conditions for various system events.',
    category: 'System Configuration'
  }
];

export const HelpSupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chat' | 'contact' | 'faq' | 'resources'>('chat');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      message: 'Hello! I\'m your Pharma LIMS assistant. How can I help you today?',
      timestamp: new Date().toISOString()
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [faqSearch, setFaqSearch] = useState('');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: newMessage,
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setNewMessage('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: getBotResponse(newMessage),
        timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('user') || message.includes('account')) {
      return 'To manage users, go to the User Management module. You can create, edit, and delete user accounts, assign roles and privileges, and manage digital signatures.';
    } else if (message.includes('workflow')) {
      return 'The Workflow Builder allows you to create approval processes. Drag nodes from the sidebar, connect them, and configure properties for each step.';
    } else if (message.includes('signature')) {
      return 'Digital Signatures can be configured in the Digital Signatures module. Create templates, set up signature fields, and manage document workflows.';
    } else if (message.includes('help') || message.includes('support')) {
      return 'I can help you with user management, workflows, digital signatures, and system configuration. What specific topic would you like assistance with?';
    } else {
      return 'I understand you need help. Could you please be more specific about what you\'d like assistance with? I can help with user management, workflows, digital signatures, and more.';
    }
  };

  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
    faq.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
    faq.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  const faqCategories = [...new Set(faqs.map(faq => faq.category))];

  const tabs = [
    { id: 'chat', label: 'AI Assistant', icon: MessageCircle },
    { id: 'contact', label: 'Contact Support', icon: Mail },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'resources', label: 'Resources', icon: Book }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600">Get assistance with Pharma LIMS</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 overflow-hidden">
        {activeTab === 'chat' && (
          <div className="h-full flex flex-col max-w-4xl mx-auto">
            {/* Chat Messages */}
            <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 overflow-y-auto mb-4">
              <div className="space-y-4">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.type === 'bot' && (
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    {message.type === 'user' && (
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-500 flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'contact' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
                <p className="text-gray-600 mb-4">Get help via email</p>
                <a
                  href="mailto:support@pharmalims.com"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  support@pharmalims.com
                </a>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Phone Support</h3>
                <p className="text-gray-600 mb-4">Call us for immediate assistance</p>
                <a
                  href="tel:+1-800-PHARMA-1"
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  +1-800-PHARMA-1
                </a>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
                <p className="text-gray-600 mb-4">Chat with our support team</p>
                <button className="text-purple-600 hover:text-purple-800 font-medium">
                  Start Chat
                </button>
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Hours</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Business Hours</h4>
                  <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM EST</p>
                  <p className="text-gray-600">Saturday: 9:00 AM - 2:00 PM EST</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Emergency Support</h4>
                  <p className="text-gray-600">24/7 emergency support available</p>
                  <p className="text-gray-600">For critical system issues only</p>
                  <a href="tel:+1-800-EMERGENCY" className="text-red-600 hover:text-red-800 font-medium">
                    +1-800-EMERGENCY
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* FAQ Categories */}
            <div className="flex flex-wrap gap-2">
              {faqCategories.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.map((faq) => (
                <div key={faq.id} className="bg-white rounded-lg border border-gray-200">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">{faq.question}</h3>
                      <span className="text-sm text-blue-600">{faq.category}</span>
                    </div>
                    {expandedFAQ === faq.id ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Resource Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Book className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">User Manual</h3>
                <p className="text-gray-600 mb-4">Comprehensive guide to using Pharma LIMS</p>
                <button className="text-blue-600 hover:text-blue-800 font-medium">
                  Download PDF
                </button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Video className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Video Tutorials</h3>
                <p className="text-gray-600 mb-4">Step-by-step video guides</p>
                <button className="text-green-600 hover:text-green-800 font-medium">
                  Watch Videos
                </button>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">API Documentation</h3>
                <p className="text-gray-600 mb-4">Technical documentation for developers</p>
                <button className="text-purple-600 hover:text-purple-800 font-medium">
                  View Docs
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-900">Getting Started Guide</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="h-8 w-8 bg-green-100 rounded flex items-center justify-center">
                    <Video className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-gray-900">Training Videos</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="h-8 w-8 bg-purple-100 rounded flex items-center justify-center">
                    <Book className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-gray-900">Best Practices</span>
                </a>
                <a href="#" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className="h-8 w-8 bg-orange-100 rounded flex items-center justify-center">
                    <HelpCircle className="h-4 w-4 text-orange-600" />
                  </div>
                  <span className="text-gray-900">Troubleshooting</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};