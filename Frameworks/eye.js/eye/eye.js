function $(id) {
    return eye.common.id(id);
}

function tag(name) {
    return eye.common.tag(name);
}

function byClass(data) {
    return eye.common.byClass(data);
}

function obj(id) {
    return eye.common.route.getObjectById(id);
}

var eye = {};
eye.go = {};

eye.do = function (id, okFunction, parameters = undefined, errorFunction = () => {}) {
    let element = document.getElementById(id);
    if (typeof element !== 'undefined' && element !== null) {
        okFunction(element);
    } else {
        let time = setInterval(() => {
            element = document.getElementById(id);
            if (typeof element !== 'undefined' && element !== null) {
                clearInterval(time);
                okFunction(element);  
            }
        }, 500);
        setTimeout(() => {
            if (typeof element === 'undefined' || element === null) {
                console.error("Element not found");
            }
            clearInterval(time);
            errorFunction();
        }, 15000);
    }
};

eye.event = function (id, event, nameFunction, parameters = undefined) {
    console.log(nameFunction);
    eye.do(id, (element) =>{
        element.addEventListener(event, (element)=>{
            nameFunction(parameters)
        });
    }, parameters);
};

eye.script = function (json) {
    if (typeof json == 'object') {
        if (typeof json['id'] === null) {
            throw new Error("id is missing");
        } else {
            let object = {};
            json.$ = {};

            if (typeof json['route'] == 'string') {
                route = json['route'].split(".");
                array = eye['go'];
                for (var i = 0; i < route.length - 1; i++) {

                    if (typeof array[route[i]] === 'undefined') {
                        array[route[i]] = {};
                    }
                    array = array[route[i]];
                }
                array[route[route.length - 1]] = json;
                object = array[route[route.length - 1]];
            } else {
                eye['go'][json['id']] = json;
                object = eye['go'][json['id']];
            }

            if(typeof object.onCreate === "function"){
                object.onCreate(object);
            }

        }
    }
};

eye.common = {
    id: function (id, ) {

        return document.getElementById(id);

    },
    tag: function (tag) {
        return document.body.getElementsByTagName(tag);
    },
    byClass: function (data) {
        return document.getElementsByClassName(data);
    },
    cloneObject: function (object) {
        let clone = {};
        for (var key in object) {
            var value = object[key];
            if (typeof value != 'object') {
                clone[key] = value;
            } else {
                clone[key] = eye.common.cloneObject(value);
            }
        }
        return clone;
    },
    includeAttributes: function (div, attributes) {
        for (key in attributes) {
            div.setAttribute(key, attributes[key]);
        }
        return div;
    },
    route: {
        getObjectById: function (id) {
            return eye.common.route.getObject(eye.common.route.getStringRoute(id).route);
        },
        getStringRoute: function (id, object = undefined, route = "") {
            let ob = object;
            if (typeof object == 'undefined') {
                ob = eye['go'];
            }
            for (let i in ob) {
                let initialRoute = route;
                if (typeof ob['id'] !== undefined) {
                    if (ob['id'] == id) {
                        return {
                            route: route
                        };
                    } else {
                        if (route != "") {
                            route = route + "." + i;
                        } else {
                            route = i;
                        }
                        if (typeof ob[i] == 'object' && i !== '$') {
                            let res = eye.common.route.getStringRoute(id, ob[i], route);
                            if (typeof res == 'object') {
                                return res;
                            }
                        }
                    }
                }
                route = initialRoute;
            }
            return false;
        },
        getObject: function (route, id) {
            if (typeof route == "string") {
                route = route.split(".");
                array = eye['go'];
                response = undefined;
                for (var i = 0; i < route.length; i++) {
                    if (typeof array[route[i]] !== "undefined" && array[route[i]] !== null) {
                        array = array[route[i]];
                        response = array;
                    }
                }

                return response;
            }
            return undefined;
        },
    }
};

eye.require = {
    eye: function (route) {
        eye.require.start(route + ".eye");
    },
    html: function (route) {
        eye.require.start(route + ".html");
    },
    custom: function (route) {
        eye.require.start(route);
    },
    start: function (route) {
        fetch(route).then(function (response) {
            response.text().then(data => {
                let script = eye.require.include.script(data);
                if (script !== null) {
                    let scriptTag = document.createElement('script');
                    scriptTag.innerHTML = script[1];
                    document.body.appendChild(scriptTag);
                }
                let style = eye.require.include.style(data);

                if (style !== null) {
                    let styleTag = document.createElement('style');
                    styleTag.innerHTML = style[1];
                    document.head.appendChild(styleTag);
                }
                let html = eye.require.include.html(data);
                if (html !== null) {
                    let attributesHTML = eye.require.process.separateAttributes(html[1]);
                    eye.render(attributesHTML, html[2]);
                }
            });
        });
    },
    include: {
        script: function (data) {
            regExp = /<script.*>([\s\S]*)<\/script>/g;
            return regExp.exec(data);
        },
        style: function (data) {
            regExp = /<style.*>([\s\S]*)<\/style>/g;
            return regExp.exec(data);
        },
        html: function (data) {
            regExp = /<html *(.*)>([\s\S]*)<\/html>/g;
            return regExp.exec(data);
        }
    },
    process: {
        separateAttributes: function (data) {
            let attributes = [];
            explode = data.split(" ");
            let regExp = /(\S+)=["']?((?:.(?!["']?\s+(?:\S+)=|[>"']))+.)["']?/;
            for (let i = 0; i < explode.length; i++) {

                if (explode[i] != "") {
                    let array = regExp.exec(explode[i]);
                    attributes[array[1]] = array[2];
                }
            }
            return attributes;
        },
    },
};

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

                let onCreate = () => {};
                let json = {};

                let old = all[0];
                let container = old.parentElement;

                if (all.length > 0) {

                    if (all[0].hasAttribute('id')) {

                        let newId = all[0].getAttribute('id');
                        let object = eye.common.route.getObjectById(attributes.id);
                        if(typeof object.onCreate === "function"){
                            onCreate = object.onCreate;
                            json = object;
        
                        }
                        if (typeof object !== 'undefined') {
                            let newObject = eye.common.cloneObject(object);
                            let parent = JSON.parse(JSON.stringify(newId));
                            let array = eye['go'];
                            let newRoute = "";
                            if (counterElements == 1) {
                                let route = eye.common.route.getStringRoute(attributes.id).route;

                                if (route !== "") {
                                    route = route.split(".");
                                    for (var i = 0; i < route.length - 1; i++) {
                                        array = array[route[i]];
                                        newRoute = newRoute + route[i] + ".";
                                    }

                                    newRoute = newRoute + route[route.length - 1] + ".";
                                    parent = route[route.length - 1];
                                    delete array[parent]
                                    array[parent] = {};
                                }
                            }

                            newRoute = newRoute + newId;
                            if (typeof object['route'] === 'string') {
                                object.route = object.route + "." + attributes.id;
                            }
                            array[parent][attributes.id] = object;
                            newObject.id = newId;

                            if (typeof newObject['route'] === 'string') {
                                newObject.route = newRoute;
                            }

                            newObject["$"] = {};
                            array[parent][newId] = newObject;
                            if(typeof array[parent][newId].onCreate === "function"){
                                onCreate = newObject.onCreate;
                                json = newObject;
                            }
                            div.innerHTML = eye.cycle.cycle(newObject, 0, div.innerHTML, true, object['id']);
                            counterElements++;
                        }
                    } else {
                        if (counterCopys > 0) {
                            div.setAttribute('id', attributes.id + "-copy-" + counterCopys);
                        }
                        counterCopys++;
                    }
                }

                let newAttributes = all[0].attributes;
                for (let i = 0; i < newAttributes.length; i++) {
                    if(newAttributes[i].name == 'class'){
                        let classList = newAttributes[i].value.split(" ");
                        for(let i = 0; i < classList.length; i++){
                            if(classList[i] !== ""){
                                div.classList.add(classList[i]);
                            }
                        }
                    }else{
                        div.setAttribute(newAttributes[i].name, newAttributes[i].value);
                    }
                }
                container.replaceChild(div, old);   

                onCreate(json);

                all = eye.common.tag(attributes.id);
            }
        }
    } else {
        console.error("Html tag id attribute not found");
    }
};

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
                html = html.replace(new RegExp(regEx1, "g"), '<eye id="' + route + '">' + ob[key] + '</eye>');


                let regEx2 = '<eye id="' + route + '">.*?</eye>';
                html = html.replace(new RegExp(regEx2, "g"), '<eye id="' + route + '">' + ob[key] + '</eye>');

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
                routeParent = obParent[route] + "-" + key;
            } else {
                routeParent = obParent['id'] + "-" + key;
            }
            let regEx1 = ':{' + key + '}:';
            html = html.replace(new RegExp(regEx1, "g"), '<span e="' + route + '">' + object[key] + '</span>');
            let regEx2 = '<span e="' + routeParent + '">.*?</span>';
            html = html.replace(new RegExp(regEx2, "g"), '<span e="' + route + '">' + object[key] + '</span>');

            return html
        }

    },
};

eye.cycle.start();