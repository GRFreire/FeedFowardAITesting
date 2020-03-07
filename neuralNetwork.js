const jfs = require('jsonfls');

const Matrix = require('./matrix');

function sigmoid(x) {
    return 1/(1 + Math.exp(-x));
}

function dsigmoid(x) {
    return (x) * (1 - (x));
}

class neuralNetwork {
    constructor(iN, hN, oN){
        this.learning_rate = .05;

        this.iN = iN;
        this.hN = hN;
        this.oN = oN;

        this.biasIH = new Matrix(this.hN, 1);
        this.biasIH.randomize();

        this.biasHO = new Matrix(this.oN, 1);
        this.biasHO.randomize();

        this.weigthIH = new Matrix(this.hN, this.iN);
        this.weigthIH.randomize();

        this.weigthHO = new Matrix(this.oN, this.hN);
        this.weigthHO.randomize();
    }

    feedForward(arr) {
        const input = Matrix.arrayToMatix(arr);

        // INPUT - HIDDEN
        let hidden = Matrix.multiply(this.weigthIH, input);
        hidden = Matrix.add(hidden, this.biasIH);
        hidden.map(sigmoid);

        // HIDDEN - OUTPUT
        let output = Matrix.multiply(this.weigthHO, hidden);
        output = Matrix.add(output, this.biasHO);
        output.map(sigmoid);

        return [output, hidden, input];

    }

    predict(arr) {
        const output = Matrix.matrixToArray(this.feedForward(arr)[0]);
        return output.map((elm) => {
            const value = Math.floor(elm * 2);
            const certain = value ? elm : 1 - elm;
            return {value, certain};
        });
    }

    backPropagation(arr, target) {
        const [output, hidden, input] = this.feedForward(arr);
        const expected = Matrix.arrayToMatix(target);
        
        // OUTPUT - HIDDEN
        const output_error = Matrix.subtract(expected, output);
        const d_output = Matrix.map(output, dsigmoid);
        
        const hiddenT = Matrix.transpose(hidden);
        
        let gradientO = Matrix.hadamard(output_error, d_output);
        gradientO = Matrix.escalar_multiply(gradientO, this.learning_rate);

        this.biasHO = Matrix.add(this.biasHO, gradientO);

        const wHOd = Matrix.multiply(gradientO, hiddenT);
        this.weigthHO = Matrix.add(this.weigthHO, wHOd);



        // HIDDEN - INPUT
        const weigthHO_t = Matrix.transpose(this.weigthHO)
        const hidden_error = Matrix.multiply(weigthHO_t, output_error);

        const d_hidden = Matrix.map(hidden, dsigmoid);
        const input_t = Matrix.transpose(input);

        let gradientH = Matrix.hadamard(hidden_error, d_hidden);
        gradientH = Matrix.escalar_multiply(gradientH, this.learning_rate);

        this.biasIH = Matrix.add(this.biasIH, gradientH);

        const wIHd = Matrix.multiply(gradientH, input_t);
        this.weigthIH = Matrix.add(this.weigthIH, wIHd);

    }

    train(obj, qnt) {
        for(let i = 0; i < qnt; i++) {
            const index = Math.floor(Math.random() * obj.inputs.length)
            this.backPropagation(obj.inputs[index], obj.outputs[index]);
        }
        const loss = 1 - (this.predict(obj.inputs[0])[0].certain);
        return {loss};
    }

    saveModel(path = './nnModel/model.json') {
        const model = {
            biasIH: Matrix.matrixToObj(this.biasIH),
            biasHO: Matrix.matrixToObj(this.biasHO),
            weigthIH: Matrix.matrixToObj(this.weigthIH),
            weigthHO: Matrix.matrixToObj(this.weigthHO)
        }

        jfs.save(path, model);

    }

    loadModel(path = './nnModel/model.json') {
        const { biasIH, biasHO, weigthIH, weigthHO } = jfs.load(path);
        
        this.biasIH = Matrix.objToMatrix(biasIH);
        this.biasHO = Matrix.objToMatrix(biasHO);
        this.weigthIH = Matrix.objToMatrix(weigthIH);
        this.weigthHO = Matrix.objToMatrix(weigthHO);

    }

}

module.exports = neuralNetwork;