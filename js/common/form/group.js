import * as Fyn from 'http://fyn-software.cpb/component/fyn.js';

export default class Group extends Fyn.Component
{
    static get properties()
    {
        return { label: '' };
    }
}
