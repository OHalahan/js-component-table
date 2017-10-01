class ExtButton extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = '<button></button>';
        this._button = this.querySelector('button');

        switch(this.getAttribute('role')) {
            case 'delCol':
                console.log('its del col');
                break;
            case 'delRow':
                console.log('its del row');
                break;
            case 'addCol':
                console.log('its add col');
                break;
            case 'addRow':
                console.log('its add row');
                break;
        }
    }

    set action(passedFunc) {
        this._button.addEventListener('click', passedFunc);
    }

    set visible(flag) {
        this._button.style.visibility = flag ? 'visible' : 'hidden';
    }

}

class ExtTable extends HTMLElement {

    constructor() {
        super();

        this._currRow = this._currColumn = null;

        this.innerHTML = '<table></table>';
        this._table = this.querySelector('table');

        this.addEventListener('mouseover',() => {
            this._showControls = true;
            this.dispatchEvent(new CustomEvent('showcontrols', { detail: true }));
        });
        this.addEventListener('mouseleave',() => {
            this.dispatchEvent(new CustomEvent('showcontrols', { detail: false }));
        });
    }

    connectedCallback(){
        this._initTable();
    }

    _initTable() {
        for (let i=0; i < 4; i++) {
            this.addRow();
        }
        for (let i=0; i < 4; i++) {
            this.addColumn();
        }
    }

    get _rows() {
        return this._table.rows ? this._table.rows.length : 0;
    }

    get _columns() {
        return this._rows ? this._table.rows[0].cells.length : 0;
    }

    addRow() {
        let row = this._table.insertRow(this._rows);
        row.addEventListener('mouseover', () => this._currRow = row.rowIndex);
        if (row.cells.length < this._columns) {
            for (let place=0; place <= this._columns; place++) {
                let cell = row.insertCell(place);
                cell.addEventListener('mouseover', () => this._currColumn = cell.cellIndex);
            }
        }
    }

    addColumn() {
        let place = this._columns;
        for (let row of this._table.rows) {
            let cell = row.insertCell(place);
            cell.addEventListener('mouseover', () => this._currColumn = cell.cellIndex);
        }
    }

    delRow() {
        this._table.deleteRow(this._currRow);
    }

    delColumn() {
        for (let row of this._table.rows) {
            row.deleteCell(this._currColumn);
        }
    }
}

class AppDrawer extends HTMLElement {
    constructor() {
        super();
        this.innerHTML =`
            <ext-button role="delCol"></ext-button>
            <ext-button role="delRow"></ext-button>
            <ext-table></ext-table>
            <ext-button role="addCol"></ext-button>
            <ext-button role="addRow"></ext-button>
        `;
        this.extTable = this.querySelector('ext-table');
        this.querySelector("ext-button[role='addRow']").action = () => this.extTable.addRow();
        this.querySelector("ext-button[role='addCol']").action = () => this.extTable.addColumn();
        this.delColBtn = this.querySelector("ext-button[role='delCol']");
        this.delRowBtn = this.querySelector("ext-button[role='delRow']");

        this.extTable.addEventListener('showcontrols', (event) => {
            [this.delColBtn, this.delRowBtn].forEach(btn => btn.visible = event.detail);
        });
    }

}

/**
https://developers.google.com/web/fundamentals/web-components/customelements
https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements
https://www.w3.org/TR/html5/tabular-data.html#the-table-element
https://developer.mozilla.org/en-US/docs/Web/Web_Components/Custom_Elements/Custom_Elements_with_Classes
https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements
*/

window.customElements.define('ext-button', ExtButton);
window.customElements.define('ext-table', ExtTable);
window.customElements.define('app-drawer', AppDrawer);

/**
 * cannot extend existing HTMLElement classes e.g. HTMLButtonElement
 * https://bugs.chromium.org/p/chromium/issues/detail?id=619062
 * https://bugs.chromium.org/p/chromium/issues/detail?id=618606
 */
