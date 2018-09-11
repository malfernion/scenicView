export default class TerrainGenerator {

  constructor(baseHeight, maxHeightDelta, xSize, ySize) {
    this.baseHeight = baseHeight
    this.maxHeightDelta = maxHeightDelta
    this.xSize = xSize
    this.ySize = ySize
  }

  generateTrigTerrain (numFuncs) {
    this.characteristicSize = Math.sqrt(this.xSize * this.xSize + this.ySize * this.ySize)
    console.log('generating functions')
    const terrainFunctions = []

    const heightDeltas = [10, 6, 1.2, 0.4]
    const lambdas = [0.05, 0.1, 0.4, 1.2]

    for (let i = 0; i < numFuncs; i++) {
      // const maxAmp = Math.random() * this.maxHeightDelta
      // const waveLength = (Math.random() * this.characteristicSize) * 0.05
      const maxAmp = Math.random() * heightDeltas[i]
      const waveLength = (Math.random() * this.characteristicSize) * lambdas[i]
      const posX = (Math.random() * (this.xSize + 40)) - 20
      const posY = (Math.random() * (this.ySize + 40)) - 20

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

    let terrain = []

    for (let i = 0; i < this.xSize; i++) {
      terrain.push([])
      for (let j = 0; j < this.ySize; j++) {
        terrain[i].push({
          posX : i - Math.floor(this.xSize / 2),
          posY : j - Math.floor(this.ySize / 2),
          height: this.baseHeight + getVal(i, j)
        })
      }
    }

    return terrain
  }

  generateFractalDiamondSquareTerrain () {
    return new Promise((resolve, reject) => {
      const initialHeight = 16
      const randomHeightModifier = 2.0
  
      // Recursive method for filling the seeded terrain with values
      function diamondSquareStep (terrain, randomHeightModifier, x0, y0, size) {
        return new Promise((resolve, reject) => {
          // Check the exit conditions
          if(size == 1) {
            resolve()
          }
  
          // Determine the coordinates of the centre
          const centreX = x0 + (size / 2)
          const centreY = y0 + (size / 2)
  
          // Get the height values of the corners
          const bottomLeftHeight = terrain[x0][y0].height
          const bottomRightHeight = terrain[x0 + size][y0].height
          const topLeftHeight = terrain[x0][y0 + size].height
          const topRightHeight = terrain[x0 + size][y0 + size].height
  
          // Use the corner heights to set the height of the centre
          const centreHeight = getRandomHeight((bottomLeftHeight + bottomRightHeight + topLeftHeight + topRightHeight) / 4, randomHeightModifier)
          terrain[centreX][centreY].height = centreHeight
  
          // Use the corner and centre heights to set the mid point values of the edges
          const middleBottomHeight = getRandomHeight((centreHeight + bottomLeftHeight + bottomRightHeight) / 3, randomHeightModifier)
          const middleLeftHeight = getRandomHeight((centreHeight + bottomLeftHeight + topLeftHeight) / 3, randomHeightModifier)
          const middleTopHeight = getRandomHeight((centreHeight + topLeftHeight + topRightHeight) / 3, randomHeightModifier)
          const middleRightHeight = getRandomHeight((centreHeight + topRightHeight + bottomRightHeight) / 3, randomHeightModifier)
  
          terrain[centreX][y0].height = middleBottomHeight
          terrain[x0][centreY].height = middleLeftHeight
          terrain[centreX][y0 + size].height = middleTopHeight
          terrain[x0 + size][centreY].height = middleRightHeight
  
          // Perform the steps on the next squares (bottom left, bottom right, top left, top right)
          const innerRandomHeightModifier = randomHeightModifier / 2
          const innerSize = size / 2
  
          Promise.all([
            diamondSquareStep(terrain, innerRandomHeightModifier, x0, y0, innerSize),
            diamondSquareStep(terrain, innerRandomHeightModifier, centreX, y0, innerSize),
            diamondSquareStep(terrain, innerRandomHeightModifier, x0, centreY, innerSize),
            diamondSquareStep(terrain, innerRandomHeightModifier, centreX, centreY, innerSize)
          ]).then(() => {
            resolve()
          })
        })
      }
  
      // Helper function to generate a height with a random deviationß
      function getRandomHeight(baseHeight, randomHeightModifier) {
        const deviation = (Math.random() * baseHeight * randomHeightModifier) - (0.5 * baseHeight * randomHeightModifier)
        return baseHeight + deviation
      }
  
      // Generate array
      let terrain = []
  
      for (let i = 0; i < this.xSize; i++) {
        terrain.push([])
        for (let j = 0; j < this.ySize; j++) {
          terrain[i].push({
            posX : i - Math.floor(this.xSize / 2),
            posY : j - Math.floor(this.ySize / 2),
            height: null
          })
        }
      }
  
      // Seed corner values with a randomly modified height
      terrain[0][0].height = getRandomHeight(initialHeight, randomHeightModifier)
      terrain[this.xSize - 1][0].height = getRandomHeight(initialHeight, randomHeightModifier)
      terrain[0][this.ySize - 1].height = getRandomHeight(initialHeight, randomHeightModifier)
      terrain[this.xSize - 1][this.ySize - 1].height = getRandomHeight(initialHeight, randomHeightModifier)
  
      // Start algorithm
      diamondSquareStep(terrain, randomHeightModifier / 2, 0, 0, this.xSize - 1)
        .then(() => {resolve(terrain)})
    })
  }

  generateBaseTerrain () {
    console.log('about to begin terrain generation')
    //return this.generateTrigTerrain(4)

    return this.generateFractalDiamondSquareTerrain()
  }

  generate () {
    let baseTerrain
    
    return this.generateBaseTerrain().then(generatedBaseTerrain => generatedBaseTerrain)
  }
}
