// main

console.log("onLoad");

// INIT ------------------------------

let t1 = document.getElementById("t1");
let t2 = document.getElementById("t2");
let t3 = document.getElementById("t3");

let g1 = document.getElementById("g1");
let g2 = document.getElementById("g2");
let g3 = document.getElementById("g3");



// graphs ------------------------------------------------
let graph1 = new Graph(g1)
let graph2 = new Graph(g2)
let graph3 = new Graph(g3)





// tables ------------------------------------------------
let table1 = new Table(t1)
// table1.setTitle("Таблица 1")
table1.addRow({ X:1, Y:2 })
table1.addRow({ X:2, Y:4 })
table1.addRow({ X:4, Y:6 })
table1.addRow({ X:7, Y:7 })
table1.addButton("Добавить", table => {
    table.addRow({
        X:Math.round(Math.random()*40)-20,
        Y:Math.round(Math.random()*20)-10
    })
    console.dir(table.rows);
})
table1.addButton("удалить", table => {
    console.dir(table.rows);
    table.deleteRow(0)
})
graph1.setData(table1.rows)
table1.onChange = () => graph1.setData(table1.rows)


let table2 = new Table(t2)
// table2.setTitle("Таблица 2")
table2.addRow({ X:2, Y:-1 })
table2.addRow({ X:4, Y:-1 })
table2.addRow({ X:6, Y:1 })
table2.addRow({ X:9, Y:2 })
table2.addRow({ X:11, Y:4 })
table2.addButton("Добавить", table => {
    table.addRow({
        X:Math.round(Math.random()*40)-20,
        Y:Math.round(Math.random()*20)-10
    })
    console.dir(table.rows);
})
table2.addButton("удалить", table => {
    console.dir(table.rows);
    table.deleteRow(0)
})
graph2.setData(table2.rows)
table2.onChange = () => graph2.setData(table2.rows)

let table3 = new Table(t3)
// table3.setTitle("Таблица 3")
table3.addButton("посчитать", table => {
    table.wipe()
    let length = Math.min( table1.length(), table2.length() )
    for( let N=0; N<length; N++ ) {
        let X = (table1.rows[N].X + table2.rows[N].X) / 2;
        let Y = (table1.rows[N].Y + table2.rows[N].Y) / 2;
        table.addRow({ X, Y })
    }
    console.log(length);
})
graph3.setData(table3.rows)
table3.onChange = () => graph3.setData(table3.rows)
