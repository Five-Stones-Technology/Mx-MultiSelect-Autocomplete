import React, { Component, createElement, Fragment } from "react";

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';

import "./ui/FSMultiSelect.css";
// import { blue } from "@material-ui/core/colors";
export default class FSMultiSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updateDate: null
        };
        this.autoCompleteKey = 0;
        this.onChange = this.changeValues.bind(this);
        this.onOpen = this.onOpen.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onSave = this.onSave.bind(this);
        this.options = [];
        this.optionsSelected = [];
        this.initialized = false;

        this.isOpen = false;
        this.isSaving = false;

        // Initialize to true to make sure data is retrieved when initializing widget
        this.refreshData = true;
        this.isMultiSelect = this.props.multiple;
    }

    componentDidUpdate(prevProps) {
        let refreshState = false;

        // Refresh the data if the refreshAttribute has been set to true
        if (!prevProps.refreshAttribute?.value && this.props.refreshAttribute?.value) {
            this.props.refreshAttribute.setValue(false);
            this.autoCompleteKey++;
            // Make sure data and state will be refreshed
            this.refreshData = true;
            refreshState = true;
        }
            // Check if the datasource has been loaded
            if (this.props.dataSourceOptions?.status === 'available') {
                // If the items have been changed or if date needs to be refreshed, change the options
                if (this.refreshData || this.props.dataSourceOptions.items !== prevProps.dataSourceOptions.items) {
                    let optionsSelected = [];

                    // Map the options and get the selected ones
                    this.options = this.props.dataSourceOptions.items.map(item => {
                        const optionTitle = this.props.titleAttr.get(item).value;
                        const option = {title: optionTitle};
                        //If key is used, add key to the option
                        if (this.props.keyAttr) {
                            option.key = this.props.keyAttr.get(item).value;
                        }
                        // If data needs to be refreshed, get default options
                        if (this.refreshData) {
                            let isItemDefaultSelected = false;
                            isItemDefaultSelected = this.props.defaultSelectedAttr && this.props.defaultSelectedAttr.get(item).value;

                            if (isItemDefaultSelected) {
                                optionsSelected.push(option);
                            }
                        } else {
                            // Else check if option is selected (based on the title). This is done since it can be the case that the options have been changed.
                            if (this.optionsSelected.find(option => option.title === optionTitle)) {
                                optionsSelected.push(option);
                            }
                        }
                        return option;
                    })
                    refreshState = true;
                    this.initialized = true;
                    this.refreshData = false;
                    this.optionsSelected = optionsSelected;
                    // Store response in responseAttribute
                    this.props.responseAttribute.setValue(JSON.stringify(optionsSelected));
                }
            }

        if (refreshState) {
            this.setState({updateDate: new Date()});
        }
    }

    onOpen(event){
        this.isOpen = true;
        if(this.props.onOpen && this.props.onOpen.canExecute){
            this.props.onOpen.execute();
        }
    }

    onClose(event, sReason){
        this.isOpen = false;
        setTimeout(() => {
            this.triggerCloseEvent();
        }, 333);
    }

    triggerCloseEvent(){
        if(!this.isSaving){
            if(this.props.onClose && this.props.onClose.canExecute){
                this.props.onClose.execute();
            }
        }
        this.isSaving = false;
    }

    onSave(){
        this.isSaving = true;
        if(this.props.onSave && this.props.onSave.canExecute){
            this.props.onSave.execute();
        }
    }

    changeValues(event, newValue, reason, details) {
        // Store response in responseAttribute and call on change action
        if(!this.isMultiSelect){
            const length = newValue.length;
            if(length > 1){
                let newArray = [];
                newArray.push(newValue[1]);
                newValue = newArray;
            } else if(length === 1) {
                newValue.splice(1);
            } else {
                newValue = [];
            }
        }

        this.props.responseAttribute.setValue(JSON.stringify(newValue));
        this.optionsSelected = newValue;

        if(this.props.onChange && this.props.onChange.canExecute){
            this.props.onChange.execute();
        }
        this.setState({updateDate: new Date()}); 
    }

    render() {
        // Do not render the widget if it is not initialized yet
        if(!this.initialized) {
            return ''
        }

        // If the disabled property is not filled, the widget will be editable
        let disabled = this.props.editable ? !this.props.editable.value : false;
        // Check if user has rights on response attribute
        if(!disabled && this.props.responseAttribute.readOnly) {
            console.warn('Autocomplete Multiselect: User has no rights to change the response attribute.')
            disabled = true;
        }
        
        const limitTags = this.props.limitTags > 0 ? this.props.limitTags : undefined;
        const placeholder = this.props.placeholder ? this.props.placeholder.value : "Placeholder";
        const noOptionsText = this.props.noOptionsText ? this.props.noOptionsText.value : "No Options";

      return (
            <Autocomplete
                key = {this.autoCompleteKey}
                multiple = {this.isMultiSelect}
                size="small"
                disabled = {disabled}
                disableCloseOnSelect = {this.props.disableCloseOnSelect}
                options = {this.options}
                value = {this.optionsSelected}
                onChange = {this.onChange}
                onOpen = {this.onOpen}
                onClose = {this.onClose}
                filterSelectedOptions={this.props.filterSelectedOptions}
                limitTags={limitTags}
                placeholder={placeholder}
                noOptionsText = {noOptionsText}
                getOptionSelected={(option, value) => option.title === value.title && option.key === value.key}
                renderOption={(option, { selected }) => (
                    <Fragment>
                    {this.props.showCheckboxes ? <Checkbox
                        checked={selected}
                    /> : null }
                    <span class="test-font">{option.title}</span>
                    </Fragment>
                )}
                renderInput={params => (
                    <TextField
                        {...params}
                        className=""
                        placeholder={placeholder}
                    />
                )}
            />
      )
    }

}