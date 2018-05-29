"use strict";

class App {
    constructor(selector){
        this.interface = document.querySelector(selector);
        this.components = {};
    }

    addComponent(component) {
        this.components[component.name] = component;
        component.model = this.proxify(component.model);
    }

    showComponent(name) {
        this.currentComponent = this.components[name];
        this.updateView();
        this.currentComponent.controller();
    }

    async updateView() {
        if (this.currentComponent) {
            this.interface.innerHTML = this.currentComponent.view();
        } else {
            this.interface.innerHTML = "<h3>Quotes not found</h3>"
        }
    }

    proxify(model) {
        const self = this;
        return new Proxy(model, {
            async set(target, property, value) {
                console.log('Changing', property, 'from', target[property], 'to', value);
                target[property] = value;
                self.updateView();
                self.currentComponent.controller();
            return true;
            }
        });
    }
}