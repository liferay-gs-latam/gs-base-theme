import chunk from './utilities/chunk';
import debounce from './utilities/debounce';
import normalizeSearchString from './utilities/normalizeSearchString';
import scrollTo from './utilities/scrollTo';

var setGlobalUtilities = function() {
    
    window.debounce = debounce;
    window.scrollTo = scrollTo;
    window.normalizeSearchString = normalizeSearchString;
    String.prototype.normalizeSearchString = normalizeSearchString;
    window.chunk = chunk;
}

export default setGlobalUtilities



