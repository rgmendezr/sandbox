eye.render = function (attributes, body) {

    if (typeof attributes.id !== 'undefined') {  

        let all = eye.common.tag(attributes.id);
        if (typeof all[0] !== 'undefined' ||
            all[0] != null || all[0] != undefined) {

            counterCopys = 0;
            counterElements = 1;
            while (all.length > 0) {
                let div = document.createElement('div');
                div = eye.common.includeAttributes(div, attributes);
                div.innerHTML = body;

                let old = all[0];
                
                all = eye.common.tag(attributes.id);
                if (all.length > 0) {

                    if (all[0].hasAttribute('id')) {

                        let newId = all[0].getAttribute('id');
                        let object = eye.common.route.getObjectById(attributes.id);
                        let newObject = eye.common.cloneObject(object);
                        let parent = JSON.parse(JSON.stringify(newId));
                        let array = eye['go'];
                        let newRoute = "";
                        if (counterElements == 1) {
                            let route = eye.common.route.getStringRoute(attributes.id).route;

                            if (route !== "") {
                                route = route.split(".");
                                for (var i = 0; i < route.length-1; i++) {
                                    array = array[route[i]];
                                    newRoute = newRoute + route[i] + ".";
                                }

                                newRoute = newRoute + route[route.length-1] + ".";
                                parent = route[route.length-1];
                                delete array[parent]
                                array[parent] = {};
                            } 
                            
                        }
                        newRoute = newRoute + newId;
                        if(typeof object['route'] === 'string'){
                                object.route = object.route + "." + attributes.id;
                        }
                        array[parent][attributes.id] = object;
                        newObject.id = newId;

                        console.log(typeof newObject['route']);

                        if(typeof newObject['route'] === 'string'){
                            newObject.route = newRoute;
                        }
                        
                        newObject["$"] = {};
                        array[parent][newId] = newObject;
                        console.log(array[parent][newId]);
                        div.innerHTML = eye.cycle.cycle(newObject, 0, div.innerHTML, true, object['id']);
                        div.setAttribute('id', newId);
                        counterElements++;
                    } else {
                        if(counterCopys > 0){
                            div.setAttribute('id', attributes.id + "-copy-" + counterCopys);
                        }
                        counterCopys++;
                    }
                }

                document.body.replaceChild(div, old);

            }

            
        }
    } else {
        console.error("Html tag id attribute not found");
    }
};