import Component from '@fyn-software/component/component.js';
export default class Menu extends Component {
    static localName = 'fyn-common-navigation-menu';
    static styles = ['fyn.suite.base'];
    async initialize() {
    }
    async ready() {
        this.on('fyn-common-navigation-item', {
            click: (e, t) => this.emit('select', t),
        });
    }
}
//# sourceMappingURL=menu.js.map