import { Component, createElement } from "react";
import { AutocompleteUI } from "./components/AutocompleteUI";
import "./ui/AutocompleteMultiselect.css";

export default class AutocompleteMultiselect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            updateDate: null
        };
        this.autoCompleteKey = 0;
        this.onChange = this.changeValues.bind(this);
        this.onOpenDropdown = this.openDropdown.bind(this);
        this.onInputChange = this.inputChange.bind(this);
        this.triggerOnSelectAction = this.triggerOnSelectAction.bind(this);
        this.options = [];
        this.optionsSelected = [];
        this.initialized = false;

        // Initialize to true to make sure data is retrieved when initializing widget
        this.refreshData = true;

        this.loading = true;
        this.showToFewCharsText = false;

        this.isMultiSelect = this.props.multiple;
    }

    triggerOnSelectAction(){
        if(this.props.onSelect && this.props.onSelect.canExecute){
            this.props.onSelect.execute();
        }
    }

    componentDidUpdate(prevProps) {
        let refreshState = false;
        console.log("initialize");
        if (this.refreshData || this.props.dataSourceOptions !== prevProps.dataSourceOptions) {
            // Check if the datasource has been loaded
            if (this.props.dataSourceOptions.status === 'available') {
                // If the items have been changed or if data needs to be refreshed, change the options
                if (this.props.dataSourceOptions.items !== prevProps.dataSourceOptions.items) {
                    let optionsSelected = this.isMultiSelect ? [] : null;

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
                            let isItemDefaultSelected = this.props.defaultSelectedAttr && this.props.defaultSelectedAttr.get(item).value;
                            if (isItemDefaultSelected) {
                                if (this.isMultiSelect) {
                                    optionsSelected.push(option);
                                } else {
                                    optionsSelected = option;
                                }
                            }
                        } else {
                            // Else check if option is selected (based on the title). This is done since it can be the case that the options have been changed.
                            if (this.isMultiSelect) {
                                if (this.optionsSelected.find(option => option.title === optionTitle)) {
                                    optionsSelected.push(option);
                                }
                            } else if (this.optionsSelected !== null) {
                                if (this.optionsSelected.title === optionTitle) {
                                    optionsSelected = option;
                                }
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
                    this.loading = false;
                }
            }
        }

        if (refreshState) {
            this.setState({updateDate: new Date()});
        }
    }

    changeValues(event, newValue, reason, details) {
        // Store response in responseAttribute and call on change action
        // if(this.isMultiSelect){
        //     this.props.responseAttribute.setValue(JSON.stringify(newValue));
        // } else {
        //     let options = [];
        //     options.push(newValue);
        //     this.props.responseAttribute.setValue(JSON.stringify(options));
        // }

        this.props.responseAttribute.setValue(JSON.stringify(newValue));

        // Update the widget with the new values selected
        this.optionsSelected = newValue;
        this.triggerOnSelectAction();
        this.setState({updateDate: new Date()}); 
    }

    openDropdown() {
        //Code to execute on open of the dropdown
    }

    inputChange = (event, value, reason)  => {
        if (this.props.searchAfterXChars.value === undefined || value.length >= this.props.searchAfterXChars.value) {
            this.showToFewCharsText = false;
        } else {
            this.showToFewCharsText = true;
        }
        this.loading = true;
        // make sure to rerender the widget
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
        
        const noOptionsText = this.props.noOptionsText ? this.props.noOptionsText.value : "No Options";
        const placeholder = this.props.placeholder ? this.props.placeholder.value : "Placeholder tt";
        const limitTags = this.props.limitTags > 0 ? this.props.limitTags : undefined;

        let loadingText = undefined;
        if (this.showToFewCharsText) {
            loadingText = this.props.searchAfterXCharsText ? this.props.searchAfterXCharsText.value : "Enter at least " + this.props.searchAfterXChars.value + " characters";
        } else {
            loadingText = this.props.loadingText ? this.props.loadingText.value : undefined;
        }

        let loading = false;

        return <AutocompleteUI 
                    key = {this.autoCompleteKey}
                    multiple = {this.props.multiple}
                    disabled = {disabled}
                    disableCloseOnSelect = {this.props.disableCloseOnSelect}
                    options = {this.options}
                    value = {this.optionsSelected}
                    onChange = {this.onChange}
                    noOptionsText = {noOptionsText}
                    limitTags={limitTags}
                    showCheckboxes = {this.props.showCheckboxes}
                    placeholder={placeholder}
                    filterSelectedOptions={this.props.filterSelectedOptions}
                    onOpen = {this.onOpenDropdown}
                    loading = {loading}
                    loadingText = {loadingText}
                    onInputChange={this.onInputChange}
            />;
    }
}