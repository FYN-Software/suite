import FormAssociated from '@fyn-software/component/formAssociated.js';
export default class Datetime extends FormAssociated {
    async initialize() {
    }
    async ready() {
        this.shadow.on('fyn-common-form-input', {
            click: () => {
                const rect = this.getBoundingClientRect();
                this.style.setProperty('--x', `${rect.x + rect.width / 2}px`);
                this.style.setProperty('--y', `${rect.bottom}px`);
                this.attributes.toggle('open');
            },
        });
        document.on({
            click: (e) => {
                if (e.composedPath().includes(this) === false) {
                    this.removeAttribute('open');
                }
            },
        });
    }
}
Datetime.localName = 'fyn-common-form-button';
Datetime.styles = ['fyn.suite.base', 'global.theme'];
//# sourceMappingURL=datetime.js.map