export default class TerrainGenerator {

  generateTerrainArray(size) {
    // Generate array
    let terrain = []
      
    for (let i = 0; i < size; i++) {
      terrain.push([])
      for (let j = 0; j < size; j++) {
        terrain[i].push({
          posX : i - Math.floor(size / 2),
          posY : j - Math.floor(size / 2),
          height: null
        })
      }
    }

    return terrain
  }
  
  generateTrigTerrain (size) {
    return new Promise((resolve, reject) => {
      const numFuncs = 4
      const baseHeight = 20
      const heightDeltas = [10, 6, 1.2, 0.4]
      const lambdas = [0.05, 0.1, 0.4, 1.2]

      const terrainFunctions = []

      for (let i = 0; i < numFuncs; i++) {
        const maxAmp = Math.random() * heightDeltas[i]
        const waveLength = (Math.random() * size) * lambdas[i]
        const posX = (Math.random() * (size + 40)) - 20
        const posY = (Math.random() * (size + 40)) - 20

        terrainFunctions.push({
          posX,
          posY,
          waveLength,
          maxAmp
        })
      }

      function getVal(x, y) {
        return terrainFunctions.reduce(function(total, funInfo) {
          const distance = Math.sqrt(Math.pow(x - funInfo.posX, 2) + Math.pow(y - funInfo.posY, 2))
          const funVal = funInfo.maxAmp * Math.cos(funInfo.waveLength * distance * Math.PI / 180)
          return total + funVal
        }, 0)
      }

      let terrain = this.generateTerrainArray(size)

      for (let innerArray of terrain) {
        for (let terrainObject of innerArray) {
          terrainObject.height = baseHeight + getVal(terrainObject.posX, terrainObject.posY)
        }
      }

      resolve(terrain)
    })
  }

  generateFractalDiamondSquareTerrain (size) {
    return new Promise((resolve, reject) => {
  
      // Method for filling the seeded terrain with values
      function diamondSquareStep (size, maxVal, heightModifier) {
        const halfSize = size / 2

        // Loop over all squares for this size and define the centre point
        for (let x = halfSize; x < maxVal; x += size) {
          for (let y = halfSize; y < maxVal; y += size) {
            evaluateSquare(x, y, size, getRandomHeight(heightModifier))
          }
        }

        // Loop over all diamonds for this size and define the centre point
        for (let x = 0; x < maxVal; x += size) {
          for (let y = 0; y < maxVal; y += size) {
            if(heightExists(x + halfSize, y)) {
              evaluateDiamond(x + halfSize, y, size, getRandomHeight(heightModifier))
            }
            if(heightExists(x + halfSize, y + size)) {
              evaluateDiamond(x + halfSize, y + size, size, getRandomHeight(heightModifier))
            }
            if(heightExists(x, y + halfSize)) {
              evaluateDiamond(x, y + halfSize, size, getRandomHeight(heightModifier))
            }
            if(heightExists(x + size, y + halfSize)) {
              evaluateDiamond(x + size, y + halfSize, size, getRandomHeight(heightModifier))
            }
          }
        }
      }

      // Takes the x and y coordinates of the centre of a square and uses the corners to define the value
      function evaluateSquare(x, y, size, randomHeight) {
        const bottomLeftHeight = terrain[x - size / 2][y - size / 2].height
        const bottomRightHeight = terrain[x + size / 2][y - size / 2].height
        const topLeftHeight = terrain[x - size / 2][y + size / 2].height
        const topRightHeight = terrain[x + size / 2][y + size / 2].height

        terrain[x][y].height = ((bottomLeftHeight + bottomRightHeight + topLeftHeight + topRightHeight) / 4) + randomHeight
      }

      // Takes the x and y coordinates of the centre of a diamond and uses the corners to define the value
      function evaluateDiamond(x, y, size, randomHeight) {
        const contributingHeights = []

        // Add the left point's height
        if(heightExists(x - size / 2, y)) {
          contributingHeights.push(terrain[x - size / 2][y].height)
        }

        // Add the bottom point's height
        if(heightExists(x, y - size / 2)) {
          contributingHeights.push(terrain[x][y - size / 2].height)
        }

        // Add the right point's height
        if(heightExists(x + size / 2, y)) {
          contributingHeights.push(terrain[x + size / 2][y].height)
        }
        
        // Add the top point's height
        if(heightExists(x, y + size / 2)) {
          contributingHeights.push(terrain[x][y + size / 2].height)
        }
        
        let sum = 0
        contributingHeights.forEach(height => sum += height)
        terrain[x][y].height = (sum / contributingHeights.length) + randomHeight
      }

      function heightExists(x, y) {
        return terrain[x] && terrain[x][y]
      }

      function getRandomHeight(randomHeightModifer) {
        return (Math.random() * randomHeightModifer) - (randomHeightModifer / 2)
      }
  
      let terrain = this.generateTerrainArray(size)
  
      // Seed corner values with a randomly modified height
      const initialHeight = 10
      const randomHeightModifier = 30

      terrain[0][0].height = initialHeight + getRandomHeight(randomHeightModifier)
      terrain[size - 1][0].height = initialHeight + getRandomHeight(randomHeightModifier)
      terrain[0][size - 1].height = initialHeight + getRandomHeight(randomHeightModifier)
      terrain[size - 1][size - 1].height = initialHeight + getRandomHeight(randomHeightModifier)

      // Run the algorithm
      let squareSize = size - 1
      let heightModifier = randomHeightModifier

      while (squareSize > 1) {
        console.log('running a step of size: ' + squareSize)
        diamondSquareStep(squareSize, size - 1, heightModifier)
        squareSize = squareSize / 2
        heightModifier = heightModifier / 2
      }
      
      resolve(terrain)
    })
  }

  generateBaseTerrain (terrainConfig) {
    switch(terrainConfig.type) {
      case 'fractal':
        return this.generateFractalDiamondSquareTerrain(terrainConfig.size)
      case 'smoothFractal':
        // TODO returns fractal terrain where only some points have random noise fractal and the rest is linear interpolation
      case 'trigonometric':
        return this.generateTrigTerrain(terrainConfig.size)
    }
  }

  generate (terrainConfig) {
    return this.generateBaseTerrain(terrainConfig).then(generatedBaseTerrain => generatedBaseTerrain)
  }
}
