'use strict';

import * as Fyn from '/js/fyn.js';

export default class Grid extends Fyn.Component
{
    initialize()
    {
        this.observe({
            rows: {
                changed: () => {
                    if(this.api === undefined || Array.isArray(this.rows) !== true)
                    {
                        return;
                    }

                    this.api.setRowData(this.rows);

                    this.autoSize();
                },
            },
            headers: {
                changed: () => {
                    if(Array.isArray(this.headers) !== true)
                    {
                        return;
                    }

                    this.agGrid.columnDefs = this.headers;
                },
            },
        });

        this.on('bar > fyn-common-form-button', {
            click: (e, t) => {
                switch(t.role)
                {
                    case 'add':
                        this.filter.value = '';

                        this.api.onFilterChanged();
                        this.api.updateRowData({ add: [{ key: '' }] });
                        let id = this.api.rowModel.nodeManager.nextId - 1;

                        this.api.ensureIndexVisible(id);

                        setTimeout(() => this.api.startEditingCell({ rowIndex: id, colKey: 'key' }), 1);

                        return;

                    case 'delete':
                        this.selection = this.api.getSelectedRows().map(r => r.key);

                        return this.shadow.querySelector('#dataGridModal').open()
                            .then(() => this.shadow.querySelector('#deleteRowsDialog').show())
                            .then(([r]) => {
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

        this.on('bar > fyn-common-form-input', {
            change: e => {
                if(this.api === undefined)
                {
                    return;
                }

                this.api.onFilterChanged();
            },
        });
    }

    ready()
    {
        let row = null;

        this.agGrid.gridOptions = {
            columnDefs: [],
            rowData: [],
            editType: 'fullRow',
            animateRows: true,
            enableFilter: false,
            rowSelection: this.rowSelection,
            enableSorting: true,
            singleClickEdit: true,
            enableColResize: this.resizable,
            enableCellChangeFlash: true,
            suppressMovableColumns: true,
            stopEditingWhenGridLosesFocus: false,
            overlayLoadingTemplate: '<modal open fit><i class="fas fa-circle-notch fa-10x fa-spin"></i></modal>',
            isExternalFilterPresent: () => true,
            doesExternalFilterPass: n => Object.values(n.data)
                .filter(v => v !== null && typeof v !== 'object')
                .some(v => v.toLowerCase().includes(
                    this.filter.value.toLowerCase()
                )),
            onCellClicked: e => {
                this.emit('click', e);
            },
            onRowEditingStarted: e => {
                row = Fyn.Extends.clone(e.data);
            },
            onRowValueChanged: e => {
                if(row !== null && Object.entries(e.data).some(([k, v]) => (row[k] || null) !== v))
                {
                    this.emit('change', e.data);
                }

                row = null;
            },
        };
    }

    autoSize()
    {
        this.columnApi.autoSizeColumns(this.columnApi.getAllColumns().map(c => c.colId))
    }

    get filter()
    {
        return this.shadow.querySelector('fyn-common-form-input');
    }

    get agGrid()
    {
        let g = this.shadow.querySelector('#agGrid');

        // console.dir(g);

        return g;
    }

    get api()
    {
        try
        {
            return this.agGrid.api;
        }
        catch(e)
        {
            return undefined;
        }
    }

    get columnApi()
    {
        return this.agGrid.columnApi;
    }

    static get properties()
    {
        return {
            headers: [],
            rows: [],
            selection: [],
            rowSelection: 'none',
            editable: false,
            resizable: true,
        };
    }
}