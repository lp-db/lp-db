<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <h1 class="navbar-brand" href>LP-DB</h1>
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
                        <input
                            class="form-control mr-sm-2"
                            type="text"
                            id="search"
                            v-model="searchText"
                            placeholder="Search"
                        />
                        <input
                            class="form-control mr-sm-2"
                            type="file"
                            id="searchFile"
                            @change="searchFile"
                            placeholder="File"
                        />
                    </li>
                </ul>
            </div>
        </nav>

        <div class="container">
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
                            >{{pages.length}}</span>
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

import Blockhash from './blockhash'
window.Blockhash = Blockhash

const bh = new Blockhash

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
            lightboxVisible: false,
            clickedIndex: 0,
            navbarCollapsed: false
        }
    },
    mounted() {
        import('./data.js').then(data => {
            this.pages = data.default
        })
    },
    computed: {
        visiblePages() {
            let ret = this.pages
            if(this.searchText !== "") {
                ret = ret.filter(x => x.name.toLowerCase().includes(this.searchText.toLowerCase()))
            } 
            if(this.activeTags.length !== 0) {
                ret = ret.filter(x => this.activeTags.every(t => x.tags.includes(t)) )
            }

            return ret.sort( (a, b) => a.name.localeCompare(b.name, 'en', {'sensitivity': 'base'}));
        },
        allTags() {
            const allTags = {}

            for (const page of this.pages) {
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
            if(!event.target || !event.target.files || event.target.files.length  == 0)
                return

            bh.blockhashFromFile(event.target.files[0])
            .then(hash => {
                console.log("Hash is", hash)
            })
        }
    }
}
</script>

<style>
html, body {
    height: 100%;
}

#app {
    min-height: 100%;
    position: relative;
    padding-bottom: 100px;
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
</style>
