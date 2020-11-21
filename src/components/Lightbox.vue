<template>
    <div class="lightbox" v-if="visible" @click="$emit('close')">
        <div class="lightbox__close" @click="$emit('close')">
            <slot name="icon-close">&times;</slot>
        </div>
        <div class="lightbox__element" @click.stop>
            <div
                class="lightbox__arrow lightbox__arrow--left"
                @click.stop.prevent="previous"
                :class="{ 'lightbox__arrow--invisible': !hasPrevious }"
            >
                <slot name="icon-previous">
                    <svg
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
                        <path d="M0-.5h24v24H0z" fill="none" />
                    </svg>
                </slot>
            </div>
            <div class="lightbox__image" @click.stop>
                <div class="lightbox__default-loader">
                    <div class="lightbox__default-loader__element"></div>
                </div>

                <img :src="images[index]" />
            </div>
            <div
                class="lightbox__arrow lightbox__arrow--right"
                @click.stop.prevent="next"
                :class="{ 'lightbox__arrow--invisible': !hasNext }"
            >
                <slot name="icon-next">
                    <svg
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" />
                        <path d="M0-.25h24v24H0z" fill="none" />
                    </svg>
                </slot>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'

export default {
    props: {
        images: {
            type: Array,
        },
        openAtIndex: {
            type: Number,
        },
        visible: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            index: 0
        }
    },
    watch: {
        visible() {
            this.index = this.openAtIndex
        }
    },
    methods: {
        previous() {
            if (this.hasPrevious) {
                this.index -= 1
            }
        },
        next() {
            if (this.hasNext) {
                this.index += 1
            }
        },
        eventListener(e) {
            if (this.visible) {
                switch (e.key) {
                    case 'ArrowRight':
                        return this.next()
                    case 'ArrowLeft':
                        return this.previous()
                    case 'ArrowDown':
                    case 'ArrowUp':
                    case ' ':
                        return e.preventDefault()
                    case 'Escape':
                        return this.hide()
                }
            }
        },
    },
    computed: {
        hasPrevious() {
            return this.index > 0
        },
        hasNext() {
            return this.index < this.images.length - 1 
        },
    },
    mounted() {
        window.addEventListener('keydown', this.eventListener)
    },
    destroyed() {
        window.removeEventListener('keydown', this.eventListener)
    },
}
</script>

<style>

.lightbox__close {
    position: fixed;
    right: 0;
    top: 0;
    padding: 1rem;
    font-size: 1.5rem;
    cursor: pointer;
    color: #fff;
    width: 4rem;
    height: 4rem;
    z-index: 9999;
}

.lightbox__arrow--invisible {
    visibility: hidden;
}

.lightbox__element {
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    z-index: 9998;
}

.lightbox__arrow {
    padding: 0 2rem;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

.lightbox__arrow svg {
    fill: #fff;
    pointer-events: none;
}

.lightbox__image {
    flex: 1;
}

.lightbox__image img {
    width: 100%;
    height: 100%;
    object-fit: scale-down;
}

.lightbox__default-loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: -1;
}
.lightbox__default-loader__element {
    animation: LightboxDefaultLoaderAnimation 1s linear infinite;
    border: 3px solid #292929;
    border-top: 3px solid #fff;
    border-radius: 50%;
    height: 75px;
    width: 75px;
}
@keyframes LightboxDefaultLoaderAnimation {
    to {
        border-top-color: #fff;
        transform: rotate(360deg);
    }
}

@media screen and (max-width: 720px) {
    .lightbox__arrow {
        padding: 0 1rem;
    }
}

@media screen and (max-width: 500px) {
    .lightbox {
        display: none;
    }
}
</style>
