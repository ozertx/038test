// main

// alert('hello');

console.log("hello table");


function Table(view) {
    this.view = view
    this.tableView = null
    this.titleView = null
    this.buttonsView = null
    this.rows = []

    this.length = () => this.rows.length
    this.onChange = () => {}

    // DOM -------------------------
    this.setTitle = ( str = '' ) => this.titleView.innerHTML = str

    this.addRow = ( item = { X:0, Y:0 } ) => {
        item.X += 0.00
        item.Y += 0.00

        // DOM
        //  if (this.tableView == null) this.createDomTable()
        let div = document.createElement('div');
        div.className = 'tableRow'

        this.buildRowDom( div, item )
        // div.addEventListener('click', () => {})

        this.tableView.appendChild(div)

        // abstract
        item.view = div
        this.rows.push(item)
        this.onChange()
    }

    this.deleteRow = ( index = 0 ) => {
        if( !(index in this.rows) ) return
        this.tableView.removeChild(this.rows[index].view)
        this.rows.splice(index, 1)
        this.onChange()
    }

    this.wipe = () => {
        do this.deleteRow()
        while ( this.length()>0 )
    }

    this.addButton = ( str = '', listener ) => {
        let div = document.createElement('div');
        div.className = 'tableButton'
        div.innerHTML = str
        div.addEventListener('click', () => listener(this) )
        view.appendChild(div)
    }

    this.createDomTable = () => { // dep
        let div = document.createElement('div');
        div.className = 'table'
        this.tableView = view.appendChild(div)
    }


    this.buildRowDom = ( view, item, options = {} ) => {

        if( 'header' in options ) {
            let header = null
            let lView = null

            lView = document.createElement('div');
            lView.className = 'tableRow'
            view.appendChild(lView)

            header = document.createElement('div');
            header.classList.add('tableHeader')
            header.classList.add('flex1')
            header.innerHTML = 'X'
            lView.appendChild(header)

            header = document.createElement('div');
            header.classList.add('tableHeader')
            header.classList.add('flex1')
            header.innerHTML = 'Y'
            lView.appendChild(header)

            header = document.createElement('div');
            header.classList.add('tableHeader')
            header.classList.add('flex20px')
            lView.appendChild(header)
        }
        else {
            let edit1 = document.createElement('input');
            edit1.classList.add('tableInput')
            edit1.classList.add('flex1')
            // edit1.readOnly = true
            edit1.addEventListener('keypress', () => {
                item.X = parseFloat(edit1.value)
                this.onChange()
            })
            edit1.value = item.X
            view.appendChild(edit1)

            let edit2 = document.createElement('input');
            edit2.classList.add('tableInput')
            edit2.classList.add('flex1')
            // edit2.readOnly = true
            edit2.addEventListener('keypress', () => {
                item.Y = parseFloat(edit2.value)
                this.onChange()
            })
            edit2.value = item.Y

            view.appendChild(edit2)

            let btn = document.createElement('div');
            btn.classList.add('tableButton')
            btn.classList.add('flex20px')
            btn.innerHTML = '-'
            view.appendChild(btn)
        }
    }

    this.init = () => {
        // console.log("constructor");
        let div = null



        // title
        div = document.createElement('div');
        div.classList.add('tableTitle')
        this.titleView = view.appendChild(div)

        // table
        div = document.createElement('div');
        div.className = 'table'
        this.tableView = view.appendChild(div)
        this.buildRowDom( div, { X:'X', Y:'Y' }, { header:true } )

        // buttons
        div = document.createElement('div');
        div.className = 'tableButtons'
        this.buttonsView = view.appendChild(div)
    }
    this.init();



}
