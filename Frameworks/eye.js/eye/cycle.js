eye.cycle = {
    time: null,
    start: function () {
        eye.cycle.time = setInterval(() => {
            eye.cycle.cycle(eye['go'], 0);
        }, 100);

    },
    stopCycle: function () {
        clearInterval(eye.cycle.time);
    },
    cycle: function (object, depth, html, first = false, idParent = undefined) {
        let ob = object;   
        if (typeof ob !== 'undefined') {
            var element;
            var error = false;
            if (depth > 0) {
                if (typeof ob['id'] === 'string') {
                    if (typeof eye.common.id(ob['id']) !== 'undefined' &&
                        eye.common.id(ob['id']) !== null) {
                        element = eye.common.id(ob['id']);
                        html = element.innerHTML;
                        depth = 0;
                    } else {
                        error = true;
                    }
                }
            }
            if (!error) {
                for (let i in ob) {

                    if (typeof ob[i] === 'object' &&
                        ob[i] !== null) {

                        if (i !== '$') {
          
                            ht = eye.cycle.cycle(ob[i], depth + 1, html, first, idParent);
                            if (typeof ht !== 'undefined') {
                                html = ht;
                            }
                        }

                    } else if (typeof ob[i] !== 'function') {

                        if (typeof ob['id'] === 'string') {
                       
                            html = eye.cycle.replaceVars(ob, i, html, idParent);

                            if (ob[i] !== ob['$'][i]) {

 
                                if (first == false) {
                                    
                                    element.innerHTML = html;
                                }

                                eye.cycle.changeCopys(ob['id'], html, 1);
                                ob['$'][i] = ob[i];
                            }
                        }
                    }

                }
            }

            if (depth > 0 || first) {
                return html;
            } else {
                return undefined;
            }

        }
        return undefined;
    },
    changeCopys: function (id, html, counter) {
        let element = eye.common.id(id + "-copy-" + counter);
        if (typeof element !== 'undefined' &&
            element !== null) {
            element.innerHTML = html;
            eye.cycle.changeCopys(id, html, counter + 1);
        }
    },
    replaceVars: function (object, key, html, idParent) {

        if (typeof html !== 'undefined') {

            if (typeof idParent !== 'undefined' && idParent !== null) {

                return eye.cycle.doubleReplace(object, key, html, idParent);

            } else {
                let route;
                let ob = eye.common.route.getObjectById(object['id']);
                if (typeof ob[route] == 'string') {
                    route = ob[route] + "." + key;
                } else {
                    route = ob['id'] + "." + key;
                }

                let regEx1 = ':{' + key + '}:';
                html = html.replace(new RegExp(regEx1, "g"), '<eye e="' + route + '">' + ob[key] + '</eye>');


                let regEx2 = '<eye e="' + route + '">.*?</eye>';
                html = html.replace(new RegExp(regEx2, "g"), '<eye e="' + route + '">' + ob[key] + '</eye>');

                return html
            }
        }
        return undefined;
    },
    doubleReplace: function (object, key, html, idParent) {
        if (typeof html !== 'undefined') {
            let route;  
            if (typeof object[route] == 'string') {
                route = object[route] + "." + key;
            } else {
                route = object['id'] + "." + key;
            }    
            let routeParent;
            let obParent = eye.common.route.getObjectById(idParent);
            if (typeof obParent[route] == 'string') {
                routeParent = obParent[route] + "." + key;
            } else {
                routeParent = obParent['id'] + "." + key;
            }
            let regEx1 = ':{' + key + '}:';
            html = html.replace(new RegExp(regEx1, "g"), '<eye e="' + route + '">' + object[key] + '</eye>');
            let regEx2 = '<eye e="' + routeParent + '">.*?</eye>';
            html = html.replace(new RegExp(regEx2, "g"), '<eye e="' + route + '">' + object[key] + '</eye>');
            
            return html
        }

    },
};

eye.cycle.start();