
import setGlobalUtilities from './src/utilities';
import initHeader from './src/modules/Header/init'

// Define global utilities
setGlobalUtilities();


// Define imports on global scope
window.initHeader = initHeader;
initHeader();