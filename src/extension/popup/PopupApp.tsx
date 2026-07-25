import React from 'react';
import { Card, Typography, Button, Badge } from '@/components';
import { isChromeExtension } from '@/config/chrome.config';

export const PopupApp: React.FC = () => {
  const handleOpenSidePanel = () => {
    if (isChromeExtension() && chrome.sidePanel && typeof chrome.sidePanel.open === 'function') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.sidePanel.open({ tabId: tabs[0].id });
        }
      });
    }
  };

  return (
    <div className="w-[320px] p-4 bg-zinc-950 text-zinc-100 flex flex-col gap-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 font-bold text-white text-xs">
            P
          </div>
          <Typography as="h1" variant="h3" className="text-sm font-bold tracking-tight">
            PostKit V2
          </Typography>
        </div>
        <Badge variant="info" className="text-[10px] font-mono">v2.0</Badge>
      </div>

      <Card variant="bordered" className="p-3">
        <Typography variant="caption" className="text-zinc-400 leading-relaxed">
          Open the PostKit Side Panel to start creating LinkedIn posts.
        </Typography>
      </Card>

      <Button variant="primary" size="sm" onClick={handleOpenSidePanel} className="w-full font-medium">
        Open Side Panel
      </Button>
    </div>
  );
};
