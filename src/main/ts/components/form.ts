export class Validator {

    /**
     * Make validateFunction return true always if you don't need validation
     **/
    constructor(public $field, public $input, public required:boolean, public errorMessage, public validateFunction:(value) => boolean){

    }

    public updateValidationMessage(isValid) {
        let $validationMessage = this.$field.find('.validation-message');

        if(isValid) {
            this.$field.removeClass('invalid').addClass('valid');
            $validationMessage.remove();
        } else {
            this.$field.addClass('invalid').removeClass('valid');

            if($validationMessage.length) {
                $validationMessage.text(this.errorMessage);
            } else {
                $validationMessage = $(`<div class="validation-message">${this.errorMessage}</div>`).appendTo(this.$field);
            }
        }
    }

    public validate():boolean {
        let isValid = true,
            value = this.$input.val();

        if(this.required && (value === null || value === 'undefined' || value === '')) {
            isValid = false;
        }

        isValid = isValid && this.validateFunction(value);

        this.updateValidationMessage(isValid);
        return isValid;
    }
}

export class Form {

    constructor(public $form, public validators:Validator[]) {

    }

    public validateForm():boolean {
        let isValid:boolean = true;

        for(let validator of this.validators) {
            isValid = isValid && validator.validate();
        }

        return isValid
    }
}