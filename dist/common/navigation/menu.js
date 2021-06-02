import Component from '@fyn-software/component/component.js';
export default class Menu extends Component {
    async initialize() {
    }
    async ready() {
        this.on('fyn-common-navigation-item', {
            click: (e, t) => this.emit('select', t),
        });
    }
}
Menu.localName = 'fyn-common-navigation-menu';
Menu.styles = ['fyn.suite.base', 'global.theme'];
//# sourceMappingURL=menu.js.map