const https = require('https')
const fs = require('fs')
const blockhash = require('blockhash-core')
const { imageFromBuffer, getImageData } = require('@canvas/image')

function hash(fdata, bits, format) {
    format = format || 'hex'
    if (format !== 'hex' && format !== 'binary') throw new Error('Unsupported format')

    bits = bits || 8
    if (bits % 4 !== 0) throw new Error('Invalid bitlength')

    return imageFromBuffer(fdata)
        .then((image) => {
            return getImageData(image)
        })
        .then((data) => hashRaw(data, bits))
        .then((hexHash) => {
            if (format === 'hex') return hexHash
            if (format === 'binary') return hexToBinary(hexHash)
        })
}

function hashRaw(data, bits) {
    return blockhash.bmvbhash(data, bits)
}

function httpRequest(options) {
    return new Promise(function(resolve, reject) {
        const req = https.request(options, function(response) {
            // reject on bad status
            if (response.statusCode < 200 || response.statusCode >= 300) {
                return reject(new Error(`statusCode:${response.statusCode}; (opts: ${JSON.stringify(options)})`))
            }

            const data = []
            response.on('data', function(chunk) {
                data.push(chunk)
            })

            response.on('end', function() {
                resolve(Buffer.concat(data))
            })
        })

        req.on('error', function(err) {
            // reject on request error
            reject(err)
        })

        req.end() // IMPORTANT
    })
}

const data = require('../data.json')

const pageCnt = data.length
let progress = 0

//https://urlscan.io/screenshots/377f0370-b88a-4a8f-bb2d-adecd12e97c9.png
const allPromises = data.map((d) => {
    return httpRequest({
        host: 'urlscan.io',
        method: 'GET',
        path: `/screenshots/${d.id}.png`,
    })
        .then((filedata) => hash(filedata, 16, 'hex'))
        .then((hash) => {
            progress += 1

            process.stdout.clearLine()
            process.stdout.cursorTo(0)
            process.stdout.write(`Current progress: ${progress}/${pageCnt}`)

            return {
                hash,
                ...d,
            }
        })
})

Promise.all(allPromises).then((newData) => {
    console.log('')
    console.log('Hashing done')

    const outputJS = 'export default ' + JSON.stringify(newData)
    fs.writeFile('./src/data.js', outputJS, (err) => {
        if (err) throw err
        console.log('The js data has been saved!')
    })
})
