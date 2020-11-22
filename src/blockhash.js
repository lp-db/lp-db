
export class Blockhash {
    constructor() {
        this.canvas = document.createElement('canvas')

        this.image = document.createElement('img')
        this.image.crossOrigin = 'anonymous' // Prevent The operation is insecure. error on context.getImageData
        
        this.reader = new FileReader()
        
        this.bits = null
        this.method = null
        this.callback = null
    }

    blockhashFromUrl(url, bits=16) {
        return new Promise((resolve, reject) => {
            this.image.src = url

            this.image.addEventListener('load', () => {
                this.canvas.width = this.image.width
                this.canvas.height = this.image.height

                let context = this.canvas.getContext('2d')
                context.drawImage(this.image, 0, 0, this.image.width, this.image.height)
                let data = context.getImageData(0, 0, this.image.width, this.image.height)

                return resolve(this.bmvbhash(data, bits))
            })
            this.image.addEventListener('error', (err) => {
                return reject(err)

            })
        })
    }
    
    blockhashFromFile(file, bits=16) {
        
        const self = this

        return new Promise((resolve, reject) => {
            self.reader.readAsDataURL(file)

            self.reader.addEventListener('load', function readerListener(event) {
                this.removeEventListener('load', readerListener)
                return resolve(event.target.result)
            })
            self.reader.addEventListener('error', function readerListenerError(err) {
                this.removeEventListener('error', readerListenerError)
                return reject(err)
            })

        }).then(imageUri => {
            self.image.src = imageUri

            return new Promise((resolve, reject) => {
                self.image.addEventListener('load', function imageListener() {
                    // this is now self.image
                    this.removeEventListener('load', imageListener)

                    self.canvas.width = 1600
                    self.canvas.height = 1200

                    let context = self.canvas.getContext('2d')
                    context.drawImage(this, 0, 0, this.width, this.height, 0, 0, 1600, 1200) // Force image size to 1600x1200
                    let data = context.getImageData(0, 0, 1600, 1200)

                    return resolve(self.bmvbhash(data, bits))
                })
                self.image.addEventListener('error', function imageListenerError(err) {
                    this.removeEventListener('error', imageListenerError)

                    return reject(err)
                })
            })
        })
    }

    bitsToHexhash(bitsArray) {
        var hex = ""
      
        for (var i = 0; i < bitsArray.length; i += 4) {
          var niddle = bitsArray.slice(i, i+4)
          hex += parseInt(niddle.join(''), 2).toString(16)
        }
      
        return hex
      }

    median(data) {
        let mdarr = data.slice(0)
        mdarr.sort(function(a, b) {
            return a - b
        })

        if (mdarr.length % 2 === 0) {
            return (mdarr[mdarr.length / 2] + mdarr[mdarr.length / 2 + 1]) / 2.0
        }

        return mdarr[Math.floor(mdarr.length / 2)]
    }

    translate_blocks_to_bits(blocks, pixels_per_block) {
        let half_block_value = (pixels_per_block * 256 * 3) / 2
        let bandsize = blocks.length / 4

        // Compare medians across four horizontal bands
        for (let i = 0; i < 4; i++) {
            let m = this.median(blocks.slice(i * bandsize, (i + 1) * bandsize))

            for (let j = i * bandsize; j < (i + 1) * bandsize; j++) {
                let v = blocks[j]

                // Output a 1 if the block is brighter than the median.
                // With images dominated by black or white, the median may
                // end up being 0 or the max value, and thus having a lot
                // of blocks of value equal to the median.  To avoid
                // generating hashes of all zeros or ones, in that case output
                // 0 if the median is in the lower value space, 1 otherwise
                blocks[j] = Number(v > m || (Math.abs(v - m) < 1 && m > half_block_value))
            }
        }
    }

    bmvbhash(data, bits) {
        let result = []

        let blockWidth, blockHeight
        let weightTop, weightBottom, weightLeft, weightRight
        let blockTop, blockBottom, blockLeft, blockRight
        const blocks = []

        const evenWidth = data.width % bits === 0
        const evenHeight = data.height % bits === 0

        // Initialize blocks array with 0s
        for (let i = 0; i < bits; i++) {
            blocks.push([])
            for (let j = 0; j < bits; j++) {
                blocks[i].push(0)
            }
        }

        blockWidth = data.width / bits
        blockHeight = data.height / bits

        for (let y = 0; y < data.height; y++) {
            if (evenHeight) {
                // don't bother dividing y, if the size evenly divides by bits
                blockTop = blockBottom = Math.floor(y / blockHeight)
                weightTop = 1
                weightBottom = 0
            } else {
                const yMod = (y + 1) % blockHeight
                const yFrac = yMod - Math.floor(yMod)
                const yInt = yMod - yFrac

                weightTop = 1 - yFrac
                weightBottom = yFrac

                // yInt will be 0 on bottom/right borders and on block boundaries
                if (yInt > 0 || y + 1 === data.height) {
                    blockTop = blockBottom = Math.floor(y / blockHeight)
                } else {
                    blockTop = Math.floor(y / blockHeight)
                    blockBottom = Math.ceil(y / blockHeight)
                }
            }

            for (let x = 0; x < data.width; x++) {
                let ii = (y * data.width + x) * 4

                let avgvalue
                if (data.data[ii + 3] === 0) {
                    avgvalue = 765
                } else {
                    avgvalue = data.data[ii] + data.data[ii + 1] + data.data[ii + 2]
                }

                if (evenWidth) {
                    blockLeft = blockRight = Math.floor(x / blockWidth)
                    weightLeft = 1
                    weightRight = 0
                } else {
                    const xMod = (x + 1) % blockWidth
                    const xFrac = xMod - Math.floor(xMod)
                    const xInt = xMod - xFrac

                    weightLeft = 1 - xFrac
                    weightRight = xFrac

                    // xInt will be 0 on bottom/right borders and on block boundaries
                    if (xInt > 0 || x + 1 === data.width) {
                        blockLeft = blockRight = Math.floor(x / blockWidth)
                    } else {
                        blockLeft = Math.floor(x / blockWidth)
                        blockRight = Math.ceil(x / blockWidth)
                    }
                }

                // add weighted pixel value to relevant blocks
                blocks[blockTop][blockLeft] += avgvalue * weightTop * weightLeft
                blocks[blockTop][blockRight] += avgvalue * weightTop * weightRight
                blocks[blockBottom][blockLeft] += avgvalue * weightBottom * weightLeft
                blocks[blockBottom][blockRight] += avgvalue * weightBottom * weightRight
            }
        }

        for (let i = 0; i < bits; i++) {
            for (let j = 0; j < bits; j++) {
                result.push(blocks[i][j])
            }
        }

        this.translate_blocks_to_bits(result, blockWidth * blockHeight)

        return this.bitsToHexhash(result)
    }
}

const one_bits = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4]

export function hammingDistance(hash1, hash2) {
    let d = 0

    
    for (let i = 0; i < hash1.length; i++) {
        let n1 = parseInt(hash1[i], 16)
        let n2 = parseInt(hash2[i], 16)
        d += one_bits[n1 ^ n2]
    }
    if(d < 40)
        console.log("Hamming", hash1, hash2, d);

    return d
}