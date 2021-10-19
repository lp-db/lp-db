<template>
    <div class="col-md-6 col-lg-4 mb-1">
        <div class="login-page rounded shadow-sm">
            <img class="cover" loading="lazy" :src="`https://urlscan.io/screenshots/${id}.png`" />
            <div class="placeholder"></div>
            <div class="content" @click="$emit('click', id)">
                <div class="hover">
                    <h4 class="text-white text-decoration-none">{{ name }}</h4>
                    <div class="tags">
                        <span v-for="t of tags" :key="t" class="badge badge-secondary">
                            {{t}}
                        </span>
                    </div>
                    <div class="links p-1 mt-2">
                        <a target="blank" rel="noreferrer noopener" @click.stop="() => false" :href="`https://urlscan.io/result/${id}`"><img src="../assets/urlscan.webp"></a>
                        <a v-if="malpedia" target="blank" rel="noreferrer noopener" @click.stop="() => false" :href="`https://malpedia.caad.fkie.fraunhofer.de/details/${malpedia}`"><img src="../assets/malpedia.webp"></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: [
        'name',
        'id',
        'tags',
        'malpedia',
    ]
}
</script>

<style scoped>
.login-page {
    overflow: hidden;
    position: relative;
    min-height: 100px;
    margin-bottom: 4px;
}

.placeholder {
    width: 100%;
    background: #ebeeef;
    border-radius: .5rem;
    padding-bottom: 75%;
}

.cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}

.content {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    cursor: pointer;
    display: flex;
}

.hover {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.4), #1110);

    padding-bottom: 15px;

    transform: translateY(30px);
    opacity: 0;
    transition: 300ms;
}


.hover:hover {
    transform: translateY(0);
    opacity: 1;
}

.links a img {
    width: 32px;
    height: 32px;
}

</style>
