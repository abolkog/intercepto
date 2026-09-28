import './index.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router';

import Layout from '@/components/Layout.tsx';
import RulesPage from '@/pages/RulesPage';
import ImportExportPage from '@/pages/ImportExportPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<RulesPage />} />
          <Route path="import-export" element={<ImportExportPage />} />
        </Route>
      </Routes>
    </HashRouter>
  </StrictMode>,
);
