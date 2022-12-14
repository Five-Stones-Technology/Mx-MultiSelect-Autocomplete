/*import React, { Component, createElement, Fragment } from "react"

import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
export class FSAutocompleteUI extends Component {
  render() {
    let noOptionsText = this.props.noOptionsText ? this.props.noOptionsText : "";

    if(this.props.showSaveButton){
      return <>
    
      <Autocomplete 
                key = {this.props.key}
                multiple = {this.props.multiple}
                size="small"
                disabled = {this.props.disabled}
                filterSelectedOptions = {this.props.filterSelectedOptions}
                disableCloseOnSelect = {this.props.disableCloseOnSelect}
                options = {this.props.options}
                value = {this.props.value}
                getOptionLabel = {option => option.title}
                onChange = {this.props.onChange}
                onClose = {this.props.onClose}
                onOpen = {this.props.onOpen}
                noOptionsText = {noOptionsText}
                limitTags={this.props.limitTags}
                onInputChange={ this.props.onInputChange}
                getOptionSelected={(option, value) => option.title === value.title && option.key === value.key}
                renderOption={(option, { selected }) => (
                    <Fragment>
                    {this.props.showCheckboxes ? <Checkbox
                        checked={selected}
                    /> : null }
                    {option.title}
                    </Fragment>
                )}
                renderInput={params => (
                <TextField
                    {...params}
                    variant={this.props.variant}
                    label={this.props.label}
                    placeholder={this.props.placeholder}
                />
                )}
            />
            <div>
            <button onClick={this.props.onSave}>Save</button>
            </div>
            </>
    } else {
      return <>
    
      <Autocomplete 
                key = {this.props.key}
                multiple = {this.props.multiple}
                size="small"
                disabled = {this.props.disabled}
                filterSelectedOptions = {this.props.filterSelectedOptions}
                disableCloseOnSelect = {this.props.disableCloseOnSelect}
                options = {this.props.options}
                value = {this.props.value}
                getOptionLabel = {option => option.title}
                onChange = {this.props.onChange}
                onClose = {this.props.onClose}
                onOpen = {this.props.onOpen}
                noOptionsText = {noOptionsText}
                limitTags={this.props.limitTags}
                onInputChange={ this.props.onInputChange}
                getOptionSelected={(option, value) => option.title === value.title && option.key === value.key}
                renderOption={(option, { selected }) => (
                    <Fragment>
                    {this.props.showCheckboxes ? <Checkbox
                        checked={selected}
                    /> : null }
                    {option.title}
                    </Fragment>
                )}
                renderInput={params => (
                <TextField
                    {...params}
                    variant={this.props.variant}
                    label={this.props.label}
                    placeholder={this.props.placeholder}
                />
                )}
            />
            </>
    }
  }
}



*/



