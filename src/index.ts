import { Component, createElement } from "react";
import DoxJS from "doxjs";
import * as PropTypes from "prop-types";

export class Provider<T> extends Component<T, any> {
    static contextTypes = {
        dox: PropTypes.object,
        store: PropTypes.object
    }
    static childContextTypes = Provider.contextTypes;
    private dox: DoxJS<T>;

    constructor(props) {
        super(props);
        this.dox = props.dox;
    }

    getChildContext() {
        if (this.dox) {
            return {
                dox: this.dox,
                store: this.dox.observe()
            }
        } else {
            let dox = new DoxJS({});
            return {
                dox,
                store: dox.observe()
            }
        }
    }

    render() {
        return this.props.children;
    }

}

export function connect(component) {

    return class HOC<T> extends Component<any, any> {
        static contextTypes = {
            dox: PropTypes.object,
            store: PropTypes.object
        }
        private dox: DoxJS<T>;

        constructor(props) {
            super(props);
            this.dox = this.context.dox;
        }

        render() {
            return createElement(component, {
                ...this.props,
                dox: this.dox,
                ...this.dox.observe()
            }, this.props.children);
        }
    }

}
