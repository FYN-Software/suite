import Component from '@fyn-software/component/component.js';
import { property } from '@fyn-software/component/decorators.js';

export default class Icon extends Component<Icon>
{
    static localName = 'fyn-common-graphics-icon';
    static styles = [ 'fyn.suite.base', 'fyn.suite.fontawesome', 'global.theme' ];

    @property<Icon>({
        set(v)
        {
            if(v === undefined || v === null || typeof v === 'boolean')
            {
                v = [];
            }

            if(Array.isArray(v) !== true)
            {
                v = JSON.tryParse(v.replace(/(?<!\\)'/g, '"').replace(/\\'/g, "'"));
            }

            if(Array.isArray(v) !== true)
            {
                v = [ v ];
            }

            return v;
        }
    })
    public icons: Array<string> = [];

    @property()
    public type: string = 'fas';

    async initialize()
    {
        this.observe({
            icons: (o: Array<string>, n: Array<string>) => {
                // console.log(o, n);
                //
                // if(o?.length > 0 && n.length === 0)
                // {
                //     console.trace('WHY?!');
                // }
            },
        });
    }

    async ready()
    {

    }
}