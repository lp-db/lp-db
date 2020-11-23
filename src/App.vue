<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <span class="navbar-brand">LP-DB</span>
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <a
                        class="nav-link"
                        href="https://github.com/lp-db/lp-db"
                        target="_blank"
                        rel="noopener"
                        aria-label="GitHub"
                        ><svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="navbar-nav-svg"
                            viewBox="0 0 512 499.36"
                            role="img"
                            focusable="false"
                        >
                            <title>GitHub</title>
                            <path
                                fill="currentColor"
                                fill-rule="evenodd"
                                d="M256 0C114.64 0 0 114.61 0 256c0 113.09 73.34 209 175.08 242.9 12.8 2.35 17.47-5.56 17.47-12.34 0-6.08-.22-22.18-.35-43.54-71.2 15.49-86.2-34.34-86.2-34.34-11.64-29.57-28.42-37.45-28.42-37.45-23.27-15.84 1.73-15.55 1.73-15.55 25.69 1.81 39.21 26.38 39.21 26.38 22.84 39.12 59.92 27.82 74.5 21.27 2.33-16.54 8.94-27.82 16.25-34.22-56.84-6.43-116.6-28.43-116.6-126.49 0-27.95 10-50.8 26.35-68.69-2.63-6.48-11.42-32.5 2.51-67.75 0 0 21.49-6.88 70.4 26.24a242.65 242.65 0 0 1 128.18 0c48.87-33.13 70.33-26.24 70.33-26.24 14 35.25 5.18 61.27 2.55 67.75 16.41 17.9 26.31 40.75 26.31 68.69 0 98.35-59.85 120-116.88 126.32 9.19 7.9 17.38 23.53 17.38 47.41 0 34.22-.31 61.83-.31 70.23 0 6.85 4.61 14.81 17.6 12.31C438.72 464.97 512 369.08 512 256.02 512 114.62 397.37 0 256 0z"
                            ></path></svg
                    ></a>
                </li>
            </ul>
            <button
                class="navbar-toggler navbar-toggler-right"
                type="button"
                data-toggle="collapse"
                data-target="#navb"
                @click="collapseNavbar()"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
            <div id="navb" class="collapse navbar-collapse" :class="{ show: navbarCollapsed }">
                <ul class="navbar-nav ml-auto">
                    <li class="nav-item search">
                        <div class="image-search">
                            <label for="searchFile" title="Reverse Image Search">
                                <i :class="searchHash ? 'icon-cancel-circled-outline' : 'icon-picture'"></i>
                            </label>
                            <input
                                class="form-control"
                                type="file"
                                id="searchFile"
                                @change="searchFile"
                                @click.stop="searchFileClick"
                                placeholder="File"
                            />
                            <div v-show="searchHash" class="search-preview">
                                <img ref="searchPreview" src="" alt="image search preview">
                            </div>
                        </div>
                        <input
                            id="search"
                            ref="searchInput"
                            class="form-control"
                            :class="{ extended: searchText || searchInputFocused }"
                            type="text"
                            v-model="searchText"
                            placeholder="Name, urlscan.io link"
                            @focus="searchInputFocused = true"
                            @blur="searchInputFocused = false"
                        />
                    </li>
                </ul>
            </div>
        </nav>

        <div class="container" v-if="visiblePages.length !== 0">
            <div class="row">
                <!-- Toolbar -->
                <div class="container justify-content-center align-items-center">
                    <div class="btn-group-toggle" id="tags" data-toggle="buttons">
                        <label
                            :class="{ active: activeTags.length == 0, 'btn': true, 'btn-secondary': true }"
                            @click="activeTags.splice(0, activeTags.length)"
                        >
                            All
                            <span
                                class="badge badge-light"
                            >{{visiblePages.length}}</span>
                        </label>
                        <label
                            v-for="t of allTags"
                            :key="t[0]"
                            :class="{ active: activeTags.includes(t[0]), 'btn': true, 'btn-secondary': true }"
                            @click="toggleTag(t[0])"
                        >
                            {{t[0]}}
                            <span
                                class="badge badge-light"
                            >{{t[1]}}</span>
                        </label>
                    </div>
                </div>
            </div>

            <hr />

            <div class="row">
                <!-- Pages list -->
                <LoginPage
                    v-for="lp of visiblePages"
                    :key="lp.id"
                    :id="lp.id"
                    :tags="lp.tags"
                    :name="lp.name"
                    :malpedia="lp.malpedia"
                    @click="showPage(lp.id)"
                />
            </div>
        </div>

        <div class="container container-no-panel" v-else>

            <div v-if="loadingFromUrl" class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
            </div>

            <p class="error-msg" v-if="!loadingFromUrl && searchText && visiblePages.length === 0">
                No login page matches <b>{{ searchText }}</b>.
            </p>

            <p class="error-msg" v-if="!searchText && searchHash && visiblePages.length === 0">
                No login pages matches this image.<br>
                It's recommended to use screenshots from <a href="https://urlscan.io/" target="blank" rel="noreferrer noopener">
                    urlscan.io
                </a> for best results.
            </p>
        </div>

        <footer class="footer">
            <div class="container text-center">
                <span class="text-muted">
                    Login Pages Database -
                    <a
                        href="https://github.com/lp-db/lp-db"
                        target="blank"
                        rel="noreferrer noopener"
                    >GitHub</a>
                </span>
            </div>
        </footer>

        <lightbox :images="visiblePages.map(({id}) => `https://urlscan.io/screenshots/${id}.png`)" :openAtIndex="clickedIndex" :visible="lightboxVisible" @close="lightboxVisible = false"/>
    </div>
</template>

<script>
import LoginPage from './components/LoginPage.vue'
import Lightbox from './components/Lightbox.vue'

import {Blockhash, hammingDistance} from './blockhash'

const bh = new Blockhash()

const matchUUID = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/

export default {
    name: 'App',
    components: {
        LoginPage,
        Lightbox,
    },
    data() {
        return {
            pages: [],
            activeTags: [],
            searchText: '',
            searchHash: '',
            searchInputFocused: false,
            lightboxVisible: false,
            clickedIndex: 0,
            navbarCollapsed: false,
            loadingFromUrl: false
        }
    },
    mounted() {
        import('./data.js').then(data => {
            this.pages = data.default
        })
    },
    watch: {
        searchText() {
            this.searchTextChange()
        }
    },
    computed: {
        visiblePages() {
            let ret = this.pages

            if(this.searchText !== "") {
                ret = ret.filter(x => x.name.toLowerCase().includes(this.searchText.toLowerCase()))
            }
            if(this.searchHash !== "") {
                ret = ret.filter(x => hammingDistance(x.hash, this.searchHash) < 16 )
            }
            if(this.activeTags.length !== 0) {
                ret = ret.filter(x => this.activeTags.every(t => x.tags.includes(t)) )
            }

            return ret.sort( (a, b) => a.name.localeCompare(b.name, 'en', {'sensitivity': 'base'}));
        },
        allTags() {
            const allTags = {}

            for (const page of this.visiblePages) {
                for (const t of page.tags) {
                    if (allTags.hasOwnProperty(t)) {
                        allTags[t] += 1
                    } else {
                        allTags[t] = 1
                    }
                }
            }

            function sort_properties(obj) {
                var sortable = []
                for (const key in obj) {
                    sortable.push([key, obj[key]])
                }
                sortable.sort((a, b) => b[1] - a[1])
                return sortable
            }

            return sort_properties(allTags)
        },
    },
    methods: {
        toggleTag(tagName) {
            if(this.activeTags.includes(tagName)) {
                this.activeTags = this.activeTags.filter(x => x !== tagName)
            } else {
                this.activeTags.push(tagName)
            }
        },
        showPage(pageId) {
            // Exit if viewport too small (< 500px)
            const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
            if(vw < 500) {
                return
            }

            const idx = this.visiblePages.findIndex(({id}) => id === pageId)
            this.clickedIndex = idx
            this.lightboxVisible = true
        },
        collapseNavbar() {
            this.navbarCollapsed = !this.navbarCollapsed
        },
        searchFile(event) {
            if(!event.target || !event.target.files || event.target.files.length == 0) {
                return
            }

            this.activeTags.splice(0, this.activeTags.length)

            bh.urlFromFile(event.target.files[0])
            .then(url => {
                this.$refs.searchPreview.src = url
                return bh.blockhashFromUrl(url)
            })
            .then(hash => {
                console.log("Hash from file", hash)
                this.searchHash = hash
            })
            .catch(err => {
                console.error('Error: Can\'t load this image.')
            })
        },
        searchFileClick(event) {
            if(this.searchHash !== '') {
                event.preventDefault()
                this.searchHash = ''
            }
        },
        searchTextChange() {
            const res = matchUUID.exec(this.searchText)
            if(this.searchText.startsWith('https://urlscan.io/') && res != null) {
                this.loadingFromUrl = true

                this.activeTags.splice(0, this.activeTags.length)

                const url = `https://urlscan.io/screenshots/${res[0]}.png`
                this.$refs.searchPreview.src = url
                bh.blockhashFromUrl(url)
                .then(hash => {
                    console.log("Hash from URL", hash)
                    this.searchHash = hash
                    this.searchText = ''
                    this.$refs.searchInput.blur()
                })
                .catch(err => {
                    console.error('Error: Can\'t load this URL.')
                })
                .finally(() => {
                    this.loadingFromUrl = false
                })
            }
        }
    }
}
</script>

<style lang="scss">
html, body {
    height: 100%;
}

#app {
    min-height: 100%;
    position: relative;
    padding-bottom: 100px;
}

.navbar-brand {
    font-weight: 500;
    margin-right: 10px;
}

.navbar-nav-svg {
    position: relative;
    display: inline-block;
    width: 1.2rem;
    height: 1.2rem;
    bottom: 1px;
}

.nav-item.search {
    display: flex;
}

.image-search {
    display: flex;

    label {
        margin: 0 5px 0 0;
    }

    input {
        display: none;
    }

    i {
        cursor: pointer;
        font-size: 26px;
        transition: color 0.1s;

        &.icon-picture {
            color: #9aa1a8;
            &:hover {
                color: #dae0e7;
            }
        }

        &.icon-cancel-circled-outline {
            color: #e87b45;
            &:hover {
                color: #f89664;
            }
        }
    }

    .search-preview img {
        position: relative;
        top: 4px;
        height: 30px;
        margin-right: 5px;
        width: 40px;
        object-fit: cover;
    }
}

#search {
    margin-left: 5px;
    width: 200px;
    transition: width 0.4s;
    transition-delay: 0.07s;
}

#search.extended {
    width: 500px;
}

.container {
    padding-top: 2px;
}

.container-no-panel {
    padding-top: 40px;

    .error-msg {
        text-align: center;
    }
}

label {
    margin: 5px;
}

.badge {
    margin: 2px;
}

.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
    line-height: 60px;
    background-color: #f5f5f5;
}

.abs-center-x {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
}

@media screen and (max-width: 992px) {
    #search {
        width: 100% !important;
    }
}

</style>
