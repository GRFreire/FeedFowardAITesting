const Matrix = require('./matrix');
const NeuralNetwork = require('./neuralNetwork');

const dataset = require('./datasets/xor.json');

const nn = new NeuralNetwork(2, 3, 1);

// let loss = 1;
// while(loss > 0.001) {
//     loss = nn.train(dataset, 1000).loss
//     console.log('Loss: ' + loss);
// }
// console.log('Loss: ' + loss);
// nn.saveModel();



nn.loadModel();

console.log(nn.predict([1, 1]));
console.log(nn.predict([1, 0]));
console.log(nn.predict([0, 1]));
console.log(nn.predict([0, 0]));
