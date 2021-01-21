
/*

<input id="matchInput">

<ul>
    <li node-content-matcher-instance="INSTANCE_ID" node-content-matcher-instance-item-index="0" node-content-match="queryString for the number omne">

        <div>
            <h2 node-content-match>Item header number one</h2>
            <div>
                <span node-content-match="alt text movei"><img src="sadas"></span>
            </div>
        </div>

    </li>


    <li node-content-matcher-instance="INSTANCE_ID" node-content-matcher-instance-item-index="1" node-content-match="ueryString for the number two">

        <div>
            <h2 node-content-matcher-content-of-instance="INSTANCE_ID" node-content-matcher-content-of-instance-item-index="1" node-content-match>item header 2</h2>
            <div>
                <span node-content-match="alt text movei"><img src="sadas"></span>
            </div>
        </div>

    </li>
</ul>

// mark found guy and all parents
*/

class NodeContentMatcher {

    constructor(instanceIdentifier, options={}) {

        this.instanceIdentifier = instanceIdentifier;
        this.options = options;

        return {
            match: this.match
        }

    }

    match(query, callback) {

        let items = document.querySelectorAll('*[node-content-matcher-instance='+this.instanceIdentifier+']');
        let matches = [];
        let i = -1;
        if(query.length > 0) {

            // Get matching nodes
            items.forEach(item => {
                
                item.removeAttribute('node-content-matcher-found');
                item.removeAttribute('node-content-matcher-found-item');

                let itemIndex = item.attributes['node-content-matcher-instance-item-index'].value;

                let contentNodes = document.querySelectorAll('*[node-content-matcher-content-of-instance="'+this.instanceIdentifier+'"][node-content-matcher-content-of-instance-item-index="'+itemIndex+'"]');
                let hasMatches = false;
                let hasItemMatches = false;
                let matchingContentNodes = [];

                // Match on item attr (node-content-match)
                if(item.attributes['node-content-matcher-string'] && item.attributes['node-content-matcher-string'].value != '') {
                    if(normalizeSearchString(item.attributes['node-content-matcher-string'].value).indexOf(normalizeSearchString(query)) != -1) {
                        hasMatches = true;
                        hasItemMatches = true;
                    }
                }

                // Content nodes match
                contentNodes.forEach(contentNode => {
                    
                    contentNode.removeAttribute('node-content-matcher-found');

                    let targetString = "";
                    if(contentNode.attributes['node-content-matcher-string'] && contentNode.attributes['node-content-matcher-string'].value.length > 0) {
                        targetString = contentNode.attributes['node-content-matcher-string'].value;
                    } else {
                        targetString = contentNode.textContent;
                    }
                    
                    targetString = normalizeSearchString(targetString.trim());
                    
                    if(targetString.indexOf(normalizeSearchString(query)) != -1) {
                        contentNode.setAttribute('node-content-matcher-found', 'true');
                        matchingContentNodes.push(contentNode);
                        hasMatches = true;
                    }

                });

                if(hasMatches) {
                    item.setAttribute('node-content-matcher-found', 'true');

                    if(hasItemMatches) {
                        item.setAttribute('node-content-matcher-found-item', 'true');
                    }

                    matches.push({
                        item: item,
                        nodes: matchingContentNodes
                    })
                }

            });

        } else {
            items.forEach(item => {
                
                item.removeAttribute('node-content-matcher-found');

            })
        }

        if(callback && typeof callback === "function") {
            callback(matches);
        } else {
            return matches;
        }
    
    }

}

export default NodeContentMatcher;