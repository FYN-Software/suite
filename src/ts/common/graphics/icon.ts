import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';
import { tryParse } from '@fyn-software/core/function/json.js';
import { setAttributeOnAssert } from '@fyn-software/core/function/dom.js';

export default class Icon extends Component<Icon, {}>
{
    static localName = 'fyn-common-graphics-icon';
    static styles = [ 'fyn.suite.base', 'fyn.suite.fontawesome' ];

    #icons: Array<string> = [];

    @property()
    public type: string = 'fas';

    async initialize()
    {
        this.observe({
            icons: () => setAttributeOnAssert(this, this.#icons.length > 0, 'shown'),
        });
    }

    async ready()
    {

    }

    @property()
    get icons(): Array<string>
    {
        return this.#icons;
    }
    set icons(v: any)
    {
        if (v === undefined || v === null || typeof v === 'boolean') {
            v = [];
        }
        if (v === '')
        {
            v = [];
        }
        if (Array.isArray(v) !== true && typeof v === 'string') {
            v = tryParse(v.replace(/(?<!\\)'/g, '"').replace(/\\'/g, "'")) ?? v;
        }
        if (Array.isArray(v) !== true) {
            v = [v];
        }
        this.#icons = v;
    }
}