import React from "react";
import {Component, Children} from "react";
import PropTypes from "prop-types";
import StoresAndServicesContext from "./context";

export class StoreProvider extends Component {
    static propTypes = {
        stores: PropTypes.object.isRequired,
        services: PropTypes.object.isRequired
    };

    render() {
        const {stores, services} = this.props;
        return (
            <StoresAndServicesContext.Provider value={{stores: stores, services: services}}>
                {Children.only(this.props.children)}
            </StoresAndServicesContext.Provider>
        );
    }
}

export class ContainerBase extends Component{
    static contextType = StoresAndServicesContext;
    constructor(props) {
        super(props);
        this._disposeFunctions = [];
    }

    subscribe(observable$, callback) {
        const sub = observable$.subscribe(callback);
        this._disposeFunctions.push(() => sub.unsubscribe());
    }

    componentWillUnmount() {
        this._disposeFunctions.forEach(d => d());
        this._disposeFunctions = [];
    }

    dispatch(action) {
        this.context.services.dispatcher.emit(action);
    }

    request(action) {
        this.context.services.dispatcher.request(action);
    }
}

