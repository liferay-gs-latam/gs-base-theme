
import setGlobalUtilities from './src/utilities';
import formValidator from './src/modules/formValidator';
import nodeContentMatcher from './src/modules/nodeContentMatcher';
import breadcrumbMaker from './src/modules/breadcrumbMaker';
import FrontPaginator from './src/modules/FrontPaginator';

// Define global utilities
setGlobalUtilities();

// Define imports on global scope
window.formValidator = formValidator;
window.nodeContentMatcher = nodeContentMatcher;
window.breadcrumbMaker = breadcrumbMaker;
window.FrontPaginator = FrontPaginator;
