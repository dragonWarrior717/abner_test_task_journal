import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Palette, Bell, Download, Upload, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';

export function SettingsPanel() {
  const [theme, setTheme] = React.useState('light');
  const [notifications, setNotifications] = React.useState(true);

  const settingsSections = [
    {
      title: 'Appearance',
      items: [
        {
          icon: theme === 'light' ? <Sun size={20} /> : <Moon size={20} />,
          label: 'Dark Mode',
          control: (
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            />
          ),
        },
        {
          icon: <Palette size={20} />,
          label: 'Custom Theme',
          control: (
            <Button variant="outline" size="sm">Customize</Button>
          ),
        },
      ],
    },
    {
      title: 'Notifications',
      items: [
        {
          icon: <Bell size={20} />,
          label: 'Daily Reminder',
          control: (
            <Switch
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          ),
        },
      ],
    },
    {
      title: 'Data Management',
      items: [
        {
          icon: <Download size={20} />,
          label: 'Export Data',
          control: (
            <Button variant="outline" size="sm">Export</Button>
          ),
        },
        {
          icon: <Upload size={20} />,
          label: 'Import Data',
          control: (
            <Button variant="outline" size="sm">Import</Button>
          ),
        },
        {
          icon: <Trash2 size={20} />,
          label: 'Clear All Data',
          control: (
            <Button variant="destructive" size="sm">Clear</Button>
          ),
        },
      ],
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {settingsSections.map((section, sectionIndex) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: sectionIndex * 0.1 }}
          className="bg-card-bg border border-card-border rounded-xl overflow-hidden"
        >
          <div className="p-6 border-b border-card-border">
            <h3 className="text-lg font-semibold">{section.title}</h3>
          </div>
          <div className="divide-y divide-card-border">
            {section.items.map((item, itemIndex) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: (sectionIndex * 0.1) + (itemIndex * 0.05) }}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.control}
              </motion.div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
} 