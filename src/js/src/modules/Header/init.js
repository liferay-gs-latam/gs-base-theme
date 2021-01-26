import { debounce } from 'lfrgs-js-utils'

const init = () => { 
    
    var headerNode = document.getElementById('header'); 
    var headerSpacerNode = document.getElementById('header-spacer'); 

    let setHeaderSpacerHeight = function() {
        let headerHeight = headerNode.clientHeight;
        headerSpacerNode.style.height = headerHeight+'px';
        headerNode.classList.add('fixed');
    }

    let handleResize = debounce(function() {
        setHeaderSpacerHeight();
    }, 250);


    window.removeEventListener('resize', handleResize);
    window.addEventListener('resize', handleResize);
    setHeaderSpacerHeight();
    

}

export default init