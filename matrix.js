class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;

        this.data = [];

        for(let i = 0; i < rows; i++){
            let arr = [];
            for(let j = 0; j < cols; j++){
                arr.push(Math.floor(Math.random() * 2));
            }
            this.data.push(arr);
        }
    }

    static arrayToMatix(arr) {
        const matrix = new Matrix(arr.length, 1);

        matrix.map((elm, i, j) => {
            return arr[i];
        });

        return matrix;
    }

    static matrixToArray(matrix) {
        let arr = [];
        matrix.map((elm) => {
            arr.push(elm);
        });
        return arr;
    }

    static matrixToObj(matrix) {
        let arr = [];
        matrix.map((elm, i) => {
            if (arr[i] === undefined) arr.push([]);
            arr[i].push(elm);
        });
        return arr;
    }

    static objToMatrix(obj) {
        const matrix = new Matrix(obj.length, obj[0].length);

        matrix.map((elm, i, j) => {
            return obj[i][j];
        });

        return matrix;
    }

    print() {
        console.table(this.data);
    }

    randomize() {
        this.map((elm, i, j) => {
            return ((Math.random() * 2) - 1);
        });
    }

    static map(a, func) {
        const matrix = new Matrix(a.cols, a.rows);
        matrix.data = a.data.map((arr, i) => {
            return arr.map((num, j) => {
                return func(num, i, j);
            })
        });

        return matrix;
    }

    map(func) {
        this.data = this.data.map((arr, i) => {
            return arr.map((num, j) => {
                return func(num, i, j);
            })
        });

        return this;
    }

    static transpose(a) {
        const matrix = new Matrix(a.cols, a.rows);
        matrix.map((elm, i, j) => {
            return a.data[j][i];
        });

        return matrix;
    }

    static hadamard(a, b) {
        const sum = new Matrix(a.rows, a.cols);
        sum.map((elm, i, j) => {
            return a.data[i][j] * b.data[i][j];
        });
        return sum;
    }

    static escalar_multiply(a, escalar) {
        const sum = new Matrix(a.rows, a.cols);
        sum.map((elm, i, j) => {
            return a.data[i][j] * escalar;
        });
        return sum;
    }

    static add(a, b) {
        const sum = new Matrix(a.rows, b.cols);
        sum.map((elm, i, j) => {
            return a.data[i][j] + b.data[i][j];
        });
        return sum;
    }

    static subtract(a, b) {
        const sum = new Matrix(a.rows, b.cols);
        sum.map((elm, i, j) => {
            return a.data[i][j] - b.data[i][j];
        });
        return sum;
    }

    static multiply(a, b) {
        const prod = new Matrix(a.rows, b.cols);
        prod.map((elm, i, j) => {
            let sum = 0;
            for(let k = 0; k < a.cols; k++){
                const elm1 = a.data[i][k];
                const elm2 = b.data[k][j];
                sum += elm1 * elm2;
            }
            return sum;
        });
        return prod;
    }
}

module.exports = Matrix;