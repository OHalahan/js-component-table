class ExtButton extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = '<button class="app__button"></button>';
        this._button = this.querySelector('button');

        switch(this.getAttribute('role')) {
            case 'delCol':
                this._button.classList.add('app__button--del');
                this._button.innerHTML = '-';
                this._initMouseHandler();
                break;
            case 'delRow':
                this._button.classList.add('app__button--del');
                this._button.innerHTML = '-';
                this._initMouseHandler();
                break;
            case 'addCol':
                this._button.classList.add('app__button--add');
                this._button.classList.add('app__button--add--col');
                this._button.innerHTML = '+';
                break;
            case 'addRow':
                this._button.classList.add('app__button--add');
                this._button.classList.add('app__button--add--row');
                this._button.innerHTML = '+';
                break;
        }

    }

    _initMouseHandler() {
        this._button.addEventListener('mouseover',() => {
            this._button.style.visibility = 'visible';
        });
        this._button.addEventListener('mouseleave',() => {
            this._button.style.visibility = 'hidden';
        });
        this._button.addEventListener('click',() => {
            this._button.style.visibility = 'hidden';
        });
    }

    set action(passedFunc) {
        this._button.addEventListener('click', passedFunc);
    }

    set visible(flag) {
        this._button.style.visibility = flag ? 'visible' : 'hidden';
    }

    set positionX(pos) {
        this._button.style.left = `${pos}px`;
    }

    set positionY(pos) {
        this._button.style.top = `${pos}px`;
    }
}

class ExtTable extends HTMLElement {

    constructor() {
        super();

        this._resetControls();

        this.innerHTML = '<table class="app__table"></table>';
        this._table = this.querySelector('table');

        this.addEventListener('mouseover',() => {
            this.dispatchEvent(new CustomEvent(
                'managecontrols',
                {detail: {
                    visible: true,
                    posX: this._currX,
                    posY: this._currY
                }}
            ));
        });
        this.addEventListener('mouseleave',() => {
            this.dispatchEvent(new CustomEvent(
                'managecontrols',
                {detail: {
                    visible: false,
                    posX: this._currX,
                    posY: this._currY
                }}
            ));
        });
    }

    connectedCallback(){
        this._initTable();
    }

    _resetControls() {
        this._currRow = this._currColumn = this._currY = this.currX = null;
    }

    _initTable() {
        for (let i=0; i < 4; i++) {
            this.addRow();
        }
        for (let i=0; i < 4; i++) {
            this.addColumn();
        }
    }

    _addCell(row, place) {
        let cell = row.insertCell(place);

        cell.classList.add('app__table__cell');
        cell.addEventListener('mouseover', () => {
            this._currColumn = cell.cellIndex;
            this._currX = cell.getBoundingClientRect()['left'];
        });
    }

    get rows() {
        return this._table.rows ? this._table.rows.length : 0;
    }

    get columns() {
        return this.rows ? this._table.rows[0].cells.length : 0;
    }

    addRow() {
        let row = this._table.insertRow(this.rows);
        row.addEventListener('mouseover', () => {
            this._currRow = row.rowIndex;
            this._currY = row.getBoundingClientRect()['top'];
        });
        if (row.cells.length < this.columns) {
            for (let place=0; place < this.columns; place++) {
                this._addCell(row, place);
            }
        }
    }

    addColumn() {
        let place = this.columns;
        for (let row of this._table.rows) {
            this._addCell(row, place);
        }
    }

    delRow() {
        this._table.deleteRow(this._currRow);
        this._resetControls();
    }

    delColumn() {
        for (let row of this._table.rows) {
            row.deleteCell(this._currColumn);
        }
        this._resetControls();
    }
}

class AppDrawer extends HTMLElement {
    constructor() {
        super();

        this.innerHTML =`
            <ext-button role="delRow" class="app__del__col__container"></ext-button>
            <div class="app__column">
                <ext-button role="delCol" class="app__del__row__container"></ext-button>
                <ext-table></ext-table>
                <ext-button role="addRow"></ext-button>
            </div>
            <ext-button role="addCol"></ext-button>
        `;

        this.extTable = this.querySelector('ext-table');
        this.delColBtn = this.querySelector("ext-button[role='delCol']");
        this.delRowBtn = this.querySelector("ext-button[role='delRow']");

        this.querySelector("ext-button[role='addRow']").action = () => this.extTable.addRow();
        this.querySelector("ext-button[role='addCol']").action = () => this.extTable.addColumn();
        this.delColBtn.action = () => this.extTable.delColumn();
        this.delRowBtn.action = () => this.extTable.delRow();

        this.extTable.addEventListener('managecontrols', (event) => {
            this.delColBtn.visible = (this.extTable.columns === 1) ? false : event.detail.visible;
            this.delRowBtn.visible = (this.extTable.rows === 1) ? false : event.detail.visible;

            this.delColBtn.positionX = event.detail.posX;
            this.delRowBtn.positionY = event.detail.posY;
        });
    }

}

window.customElements.define('ext-button', ExtButton);
window.customElements.define('ext-table', ExtTable);
window.customElements.define('app-drawer', AppDrawer);
