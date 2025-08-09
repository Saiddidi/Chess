// هذا ملف مبسط لبناء نموذج tfjs وحفظه في indexeddb
import * as tf from 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.11.0/dist/tf.esm.min.js';

const MODEL_NAME = 'indexeddb://chesszero-model-v1';

export async function buildModel(numMoves=4672){
  const input = tf.input({shape:[8,8,12]});
  let x = tf.layers.flatten().apply(input);
  x = tf.layers.dense({units:256,activation:'relu'}).apply(x);
  x = tf.layers.dense({units:128,activation:'relu'}).apply(x);

  const policy = tf.layers.dense({units:numMoves,activation:'softmax',name:'policy'}).apply(x);
  const value = tf.layers.dense({units:1,activation:'tanh',name:'value'}).apply(x);

  const model = tf.model({inputs:input,outputs:[policy,value]});
  model.compile({optimizer:tf.train.adam(0.001),loss:{policy:'categoricalCrossentropy',value:'meanSquaredError'}});
  return model;
}

export async function saveModel(model){
  await model.save(MODEL_NAME);
}

export async function loadModelIfExists(){
  try{
    const m = await tf.loadLayersModel(MODEL_NAME);
    return m;
  }catch(e){
    return null;
  }
}
