import { utilityExample } from './utilities/utility-example'

// Make utilities available into the global scope
var setGlobalUtilities = function() {
    
    window.utilityExample = utilityExample;

}

export default setGlobalUtilities
