/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { IntroCoverView } from './components/IntroCoverView';
import { MainBookView } from './components/MainBookView';

export default function App() {
  const [view, setView] = useState<'intro' | 'main'>('intro');

  const handleOpenComplete = () => {
    setView('main');
  };

  const handleCloseToCover = () => {
    setView('intro');
  };

  return (
    <div className="min-h-screen bg-[#0d0d0f] text-stone-100 select-none">
      {view === 'intro' ? (
        <IntroCoverView onOpenComplete={handleOpenComplete} />
      ) : (
        <MainBookView onCloseToCover={handleCloseToCover} />
      )}
    </div>
  );
}
