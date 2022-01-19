<template>
    <canvas id="preview-canvas" class="absolute"></canvas>
</template>

<script>
import Peep from '@/classes/Peep.js'
import { onMounted, ref } from 'vue'
import { gsap } from "gsap";

export default {
    setup() {

        const config = {
            src: './spritesheet.png',
            rows: 10,
            cols: 10
        }

        // UTILS
        const randomRange = (min, max) => min + Math.random() * (max - min)

        const randomIndex = (array) => randomRange(0, array.length) | 0

        const removeFromArray = (array, i) => array.splice(i, 1)[0]

        const removeItemFromArray = (array, item) => removeFromArray(array, array.indexOf(item))

        const removeRandomFromArray = (array) => removeFromArray(array, randomIndex(array))

        const getRandomFromArray = (array) => (
            array[randomIndex(array) | 0]
        )
        let canvas = ref(null)
        let ctx = ref(null)
        let img = ref(null)
        const allPeeps = []
        const availablePeeps = []
        const crowd = []
        const stage = {
            width: 0,
            height: 0,
        }

        // TWEEN FACTORIES
        const resetPeep = ({ stage, peep }) => {
            const direction = Math.random() > 0.5 ? 1 : -1
            // using an ease function to skew random to lower values to help hide that peeps have no legs
            const offsetY = 100 - 700 * gsap.parseEase('power2.in')(Math.random())
            const startY = stage.height - peep.height + offsetY
            let startX
            let endX

            if (direction === 1) {
                startX = -peep.width
                endX = stage.width
                peep.scaleX = 1
            } else {
                startX = stage.width + peep.width
                endX = 0
                peep.scaleX = -1
            }

            peep.x = startX
            peep.y = startY
            peep.anchorY = startY

            return {
                startX,
                startY,
                endX
            }
        }

        const normalWalk = ({ peep, props }) => {
            const {
                startX,
                startY,
                endX
            } = props

            const xDuration = 20
            const yDuration = 0.5

            const tl = gsap.timeline()
            tl.timeScale(randomRange(0.5, 1.5))
            tl.to(peep, {
                duration: xDuration,
                x: endX,
                ease: 'none'
            }, 0)
            tl.to(peep, {
                duration: yDuration,
                repeat: xDuration / yDuration,
                yoyo: true,
                y: startY - 10
            }, 0)

            return tl
        }

        const walks = [
            normalWalk,
        ]

        onMounted(() => {
            // MAIN
            img = document.createElement('img')
            img.onload = init
            img.src = config.src

            canvas = document.getElementById('preview-canvas')
            ctx = canvas.getContext('2d')
        })

        function init() {
            createPeeps()

            // resize also (re)populates the stage
            resize()

            gsap.ticker.add(render)
            window.addEventListener('resize', resize)
        }

        function createPeeps() {
            const {
                rows,
                cols
            } = config
            const {
                naturalWidth: width,
                naturalHeight: height
            } = img
            const total = rows * cols
            const rectWidth = width / rows
            const rectHeight = height / cols

            for (let i = 0; i < total; i++) {
                allPeeps.push(new Peep({
                    image: img,
                    rect: [
                        (i % rows) * rectWidth,
                        (i / rows | 0) * rectHeight,
                        rectWidth,
                        rectHeight,
                    ]
                }))
            }
        }

        function resize() {
            stage.width = canvas.clientWidth
            stage.height = canvas.clientHeight
            canvas.width = stage.width * devicePixelRatio
            canvas.height = stage.height * devicePixelRatio

            crowd.forEach((peep) => {
                peep.walk.kill()
            })

            crowd.length = 0
            availablePeeps.length = 0
            availablePeeps.push(...allPeeps)

            initCrowd()
        }

        function initCrowd() {
            while (availablePeeps.length) {
                // setting random tween progress spreads the peeps out
                addPeepToCrowd().walk.progress(Math.random())
            }
        }

        function addPeepToCrowd() {
            const peep = removeRandomFromArray(availablePeeps)
            const walk = getRandomFromArray(walks)({
                peep,
                props: resetPeep({
                    peep,
                    stage,
                })
            }).eventCallback('onComplete', () => {
                removePeepFromCrowd(peep)
                addPeepToCrowd()
            })

            peep.walk = walk

            crowd.push(peep)
            crowd.sort((a, b) => a.anchorY - b.anchorY)

            return peep
        }

        function removePeepFromCrowd(peep) {
            removeItemFromArray(crowd, peep)
            availablePeeps.push(peep)
        }

        function render() {
            canvas.width = canvas.width
            ctx.save()
            ctx.scale(devicePixelRatio, devicePixelRatio)

            crowd.forEach((peep) => {
                peep.render(ctx)
            })

            ctx.restore()
        }
    }
}
</script>

<style>
#preview-canvas {
    height: 100%;
    z-index: 1;
}
</style>