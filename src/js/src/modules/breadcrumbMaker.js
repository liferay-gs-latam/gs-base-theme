
// Breadcrumb maker
// --
var breadcrumbMaker = function(data) {

    if (data == undefined && data == ""){
        data={}
    };
    
    // This script assumes the presence of an unique breadcrumb portlet
    var breadcrumb = $('.breadcrumb');

    // Get current last item of breadcrumb (fake or not)
    var getBreadcrumbLastItem = function() { 
        return breadcrumb.find('.breadcrumb-item:last-child') 
    };

    var forgeBreadcrumbItemNode = function(name, url) {
        
        if(url && url != undefined) {
            var nodeStr = `
            <li class="breadcrumb-maker__item breadcrumb-item">
                            
                <a class="breadcrumb-link" href="`+url+`" title="`+name+`">
                    <span class="breadcrumb-text-truncate">`+name+`</span>
                </a>
        
            </li>
            `;
        } else {

            var nodeStr = `
            <li class="breadcrumb-maker__item breadcrumb-item">
                            
                <span class="breadcrumb-text-truncate">`+name+`</span>
        
            </li>
            `;

        }
        

                    

        let node = $.parseHTML(nodeStr);
        return node;

    };

    var updateLastItemClickBinding = function() {

        let lastItem = $(getBreadcrumbLastItem());
        lastItem.off('click.breadcrumbMaker_lastBreadcrumbItemClick').on('click.breadcrumbMaker_lastBreadcrumbItemClick', function() {
            if(typeof data.onClickLastBreadcrumbItem === "function") {
                data.onClickLastBreadcrumbItem(lastItem);
            }
        })

    };

    var addBreadcrumbItem = function(name, url) {
        
        let breadcrumbNode = $(forgeBreadcrumbItemNode(name, url));

        // Update last item click binding
        updateLastItemClickBinding();

        // Append new item
        let newItem = breadcrumbNode.appendTo(breadcrumb);

        // Call event and pass new Item
        if(typeof data.onAddBreadcrumbItem === "function") {
            data.onAddBreadcrumbItem(newItem);
        }
        
    };

    var removeLastBreadcrumbItem = function() {
        
        let lastItem = getBreadcrumbLastItem();

        if(lastItem.hasClass('breadcrumb-maker__item')) {
            lastItem.remove();
        }

        let newLastItem = getBreadcrumbLastItem();
        // Call event and pass the updated last item
        if(typeof data.onRemoveLastBreadcrumbItem === "function") {
            data.onRemoveLastBreadcrumbItem(newLastItem);
        }

        updateLastItemClickBinding();
        
    };


    return {

        breadcrumb: breadcrumb,
        addBreadcrumbItem: addBreadcrumbItem,
        removeLastBreadcrumbItem: removeLastBreadcrumbItem,
        getBreadcrumbLastItem: getBreadcrumbLastItem

    };

}

export default breadcrumbMaker;