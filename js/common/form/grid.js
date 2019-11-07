import * as Fyn from '../../../../component/fyn.js';
import * as Types from '../../../../data/types.js';

export default class Grid extends Fyn.Component
{
    static get properties()
    {
        return {
            columns: Types.List.type(Types.String),
            rows: Types.List.type(Types.String),
            selection: Types.List.type(Types.String),
            rowSelection: Types.String.default('none'),
            editable: Types.Boolean,
            resizable: Types.Boolean.default(true),
        };
    }

    initialize()
    {
        this.observe({
            rows: () => {},
            columns: () => {},
        });

        this.shadow.on('bar > fyn-common-form-button', {
            click: (e, t) => {
                switch(e.action)
                {
                    case 'add':
                        this.filter.value = '';

                        this.api.onFilterChanged();
                        this.api.updateRowData({ add: [ { key: '' } ] });
                        let id = this.api.rowModel.nodeManager.nextId - 1;

                        this.api.ensureIndexVisible(id);

                        setTimeout(() => this.api.startEditingCell({ rowIndex: id, colKey: 'key' }), 1);

                        return;

                    case 'delete':
                        this.selection = this.api.getSelectedRows().map(r => r.key);

                        return this.shadow.querySelector('#dataGridModal').open()
                            .then(() => this.shadow.querySelector('#deleteRowsDialog').show())
                            .then(([ r ]) =>
                            {
                                if(r === true)
                                {
                                    this.api.updateRowData({ remove: this.api.getSelectedRows() });

                                    this.emit('deleted', this.selection);

                                    this.selection = [];
                                }
                            })
                            .then(() => this.shadow.querySelector('#dataGridModal').close());
                }
            },
        });
        this.shadow.on('bar > fyn-common-form-input', {
            change: e => console.log(e),
        });
    }

    get filter()
    {
        return this.shadow.querySelector('fyn-common-form-input');
    }
}
