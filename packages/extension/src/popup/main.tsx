import { createRoot } from 'react-dom/client';
import { Settings } from './Settings.js';

const container = document.getElementById('root');
if (container) createRoot(container).render(<Settings />);
