// Creates a fake pagination (only in frontend, so watch out if you have too many items)
//

/*

    // USAGE: 

    var myPaginator = new FrontPaginator({
        itemsWrapperSelector: '.all-courses',
        itemsSelector: '.card',
        itemsPerPage: 4,
        hidePaginatorIfSinglePage: true, // optional
        showPreviousButton: false, // optional
        showNextButton: false, // optional
        templates: { // optional
            paginator: (data) => { return `
                <ul class="pagination" data-front-paginator>
                </ul>
            `; },

            page: (data) => { return `
                <li class="page-item" data-front-paginator-page="`+data.pageNumber+`" data-front-paginator-item>
                    <a class="page-link" href="#">`+data.label+`</a>
                </li>
            `; },

            previous: () => { return `
                <<li data-front-paginator-page="previous" data-front-paginator-item>
                    x
                </li>
            `; },

            next: () => { return `
                <li data-front-paginator-page="next" data-front-paginator-item>
                    x
                </li>
            `; }
        }
    })

*/


import chunk from "../utilities/chunk";

class FrontPaginator {

    // Initialization
    // -
    constructor(options={}) {

        var getOption = (key, defaultValue) => {
            if(options[key] != undefined && options[key] != null) {
                return options[key]
            } else {
                return defaultValue
            }
        }
        
        this.itemsWrapperSelector = getOption('itemsWrapperSelector', null);
        this.itemsSelector = getOption('itemsSelector', null);
        this.showPreviousButton = getOption('showPreviousButton', true);
        this.showNextButton = getOption('showNextButton', true);
        this.showPageNumbers = getOption('showPageNumbers', true);
        this.hidePaginatorIfSinglePage = getOption('hidePaginatorIfSinglePage', false);
        this.itemsPerPage = getOption('itemsPerPage', 10);
        this.currentPage = 1;
        
        // Templates
        this.templates = {

            paginator: (data) => { return `
                <nav class="d-flex justify-content-center mt-4" data-front-paginator>
                    <ul class="pagination" data-front-paginator-pages-wrapper>
                    </ul>
                </nav>
            `; },

            page: (data) => { return `
                <li class="page-item" data-front-paginator-page="`+data.pageNumber+`" data-front-paginator-item>
                    <a class="page-link" href="`+data.url+`">`+data.label+`</a>
                </li>
            `; },

            previous: () => { return `
                <li class="page-item" data-front-paginator-page="previous" data-front-paginator-item>
                    <a class="page-link" href="#"><i class="icon-chevron-left"></i></a>
                </li>
            `; },

            next: () => { return `
                <li class="page-item" data-front-paginator-page="next" data-front-paginator-item>
                    <a class="page-link" href="#"><i class="icon-chevron-right"></i></a>
                </li>
            `; }

        }

        this.customTemplates = getOption('templates', null);
        if(this.customTemplates) {

            let customTemplatesKeys = Object.keys(this.customTemplates);
            customTemplatesKeys.forEach(templateKey => {

                if(this.customTemplates[templateKey] && typeof this.customTemplates[templateKey] == "function") {
                    this.templates[templateKey] = this.customTemplates[templateKey];
                }

            })

        }   

        // Exec
        this.init();
        return this;
       
    }

    // Utils
    getTemplateNode(templateKey, data={}) {
        if(this.templates[templateKey]) {

            let element = document.createElement('div');
            element.innerHTML = this.templates[templateKey](data).trim();

            return element.children[0];
            
        } else {
            return null;
        }
    }

    init() {

        this.itemsWrapperNode = document.querySelector(this.itemsWrapperSelector);
        this.itemsNodes = (this.itemsSelector) ? this.itemsWrapperNode.querySelectorAll(this.itemsSelector) : null;
        this.pagedItems = chunk(Array.from(this.itemsNodes), this.itemsPerPage);

        if(!this.itemsWrapperNode) {
            return;
        }

        if(this.itemsWrapperNode.querySelector('*[data-front-paginator]')) {
            let el = this.itemsWrapperNode.querySelector('*[data-front-paginator]');
            el.parentNode.removeChild(el)   
        }

        if(!this.pagedItems.length) {
            return;
        }

        
        var pageN = 0;
        this.pagedItems.forEach((items) => {
            pageN++;
            items.forEach((item) =>{
                item.setAttribute('data-front-paginator-page', pageN);
            })
        })
    
        this.paginatorNode = this.getTemplateNode('paginator');
        this.paginatorNodePagesWrapper = this.paginatorNode.querySelector('*[data-front-paginator-pages-wrapper]');
        if(!this.paginatorNodePagesWrapper) {
            this.paginatorNodePagesWrapper = this.paginatorNode;
        }
        
        this.previousButtonNode = this.getTemplateNode('previous');
        this.nextButtonNode = this.getTemplateNode('next');

        var paginatorPagesNodes = [];
        var i = 0;
        this.pagedItems.forEach((items) => {
            i++;
            paginatorPagesNodes.push(this.getTemplateNode('page', {
                url: '#',
                pageNumber: i,
                label: i
            }));
        })

        if(!(this.hidePaginatorIfSinglePage && this.pagedItems.length === 1)) {

            // Append all paginator items
            if(this.showPreviousButton) {
                this.paginatorNodePagesWrapper.appendChild(this.previousButtonNode);
            }
            if(this.showPageNumbers) {
                paginatorPagesNodes.forEach((pageNode) => {
                    this.paginatorNodePagesWrapper.appendChild(pageNode);
                })
            }
            if(this.showNextButton) {
                this.paginatorNodePagesWrapper.appendChild(this.nextButtonNode);
            }

            var paginatorItemClickHandler = event => {

                event.preventDefault();
                if(event.currentTarget.getAttribute('data-front-paginator-page')) {
                    var pageN = event.currentTarget.getAttribute('data-front-paginator-page');
                } else {
                    pageN = 1;
                }

                this.goToPage(pageN);

            };

            var paginatorItemLinkClickHandler = event => {
                event.preventDefault();
            }

            // Bind click event
            this.paginatorNodePagesWrapper.querySelectorAll('*[data-front-paginator-item]').forEach(paginatorItem => {
                paginatorItem.removeEventListener('click', paginatorItemClickHandler);
                paginatorItem.addEventListener('click', paginatorItemClickHandler);

                // Remove link event (if there is a link element (<a/>)
                let itemLink = this.paginatorNodePagesWrapper.querySelector('a');
                if(itemLink) {
                    itemLink.removeEventListener('click', paginatorItemLinkClickHandler);
                    itemLink.addEventListener('click', paginatorItemLinkClickHandler);
                }

            })

            // All set! Add paginator node and go to first page
            this.itemsWrapperNode.appendChild(this.paginatorNode);

        }

        if(this.itemsNodes.length > this.itemsPerPage) {
            this.goToPage(1);
        }

    }

    goToPage(pageNumber) {

        // Hide all pages
        this.itemsNodes.forEach((item) =>{
            item.classList.add('d-none');
        })
        this.itemsWrapperNode.querySelectorAll('*[data-front-paginator-item]').forEach((page) => {
            page.classList.remove('active');
        });

        // Previous and next behaviours
        if(pageNumber == 'previous') {
            pageNumber = this.currentPage-1;     
        }
        if(pageNumber == 'next') {
            pageNumber = this.currentPage+1;
        }

        pageNumber = Number(pageNumber);
        
        // Check pageN validity and enable its corresponding items
        if(this.pagedItems[pageNumber-1]) {
            let items = this.pagedItems[pageNumber-1];
            items.forEach((item) =>{
                item.classList.remove('d-none');
            })
            this.currentPage = pageNumber;
            this.itemsWrapperNode.querySelector('*[data-front-paginator-item][data-front-paginator-page="'+this.currentPage+'"]').classList.add('active')
            
        } else {
            let items = this.pagedItems[this.currentPage-1];
            items.forEach((item) => {
                item.classList.remove('d-none');
            })
            this.itemsWrapperNode.querySelector('*[data-front-paginator-item][data-front-paginator-page="'+this.currentPage+'"]').classList.add('active')
        }

        // Disable/enable previous and next button
        if(this.currentPage == 1) {
            this.previousButtonNode.classList.add('disabled');
        } else {
            this.previousButtonNode.classList.remove('disabled');
        }

        if(this.currentPage == this.pagedItems.length) {
            this.nextButtonNode.classList.add('disabled');
        } else {
            this.nextButtonNode.classList.remove('disabled');
        }

    }


    previous() {
        this.goToPage(this.currentPage - 1)
    }
    next() {
        this.goToPage(this.currentPage + 1)
    }

}

export default FrontPaginator