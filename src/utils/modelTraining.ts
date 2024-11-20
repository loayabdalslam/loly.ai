import * as tf from '@tensorflow/tfjs';

export async function createAndTrainModel(nodes: any[], data: any[]) {
  // Convert data to tensors
  const features = tf.tensor2d(data.map(row => 
    Object.values(row).filter(val => !isNaN(parseFloat(val)))
  ));
  
  // Create model architecture from nodes
  const model = tf.sequential();
  
  nodes.forEach((node, index) => {
    if (index === 0) return; // Skip input node
    
    switch (node.type) {
      case 'Dense':
        model.add(tf.layers.dense({
          units: node.data.units,
          activation: 'relu',
          inputShape: index === 1 ? [features.shape[1]] : undefined
        }));
        break;
      // Add other layer types as needed
    }
  });

  // Compile model
  model.compile({
    optimizer: 'adam',
    loss: 'meanSquaredError',
    metrics: ['accuracy']
  });

  // Train model
  const history = await model.fit(features, labels, {
    epochs: 50,
    validationSplit: 0.2,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        // Update training metrics
        setTrainingMetrics(prev => ({
          loss: [...prev.loss, logs.loss],
          accuracy: [...prev.accuracy, logs.accuracy],
          valLoss: [...prev.valLoss, logs.val_loss],
          valAccuracy: [...prev.valAccuracy, logs.val_accuracy],
        }));
      }
    }
  });

  return model;
} 