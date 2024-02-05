import { LightningElement, track } from 'lwc';

export default class ContactForm extends LightningElement {
    @track firstName = '';
    @track lastName = '';
    @track email = '';
    @track phone = '';
    @track title = '';

    handleInputChange(event) {
        const fieldName = event.target.name;
        this[fieldName] = event.target.value;
    }

    handleSave() {
        console.log('First Name:', this.firstName);
        console.log('Last Name:', this.lastName);
        console.log('Email:', this.email);
        console.log('Phone:', this.phone);
        console.log('Title:', this.title);
    }
}
