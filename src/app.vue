<template>
  <div id="main" class="app-main">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
    data () {
        return {
            theme: this.$store.state.app.themeColor
        };
    },
    mounted () {
        let urlHead = document.location.protocol;
        if (urlHead == 'http:' || urlHead == 'https:') {
            const script = document.createElement('script');
            script.src =
        'https://s23.cnzz.com/z_stat.php?id=1275841610&web_id=1275841610';
            script.language = 'JavaScript';
            document.body.appendChild(script);
        }
    },
    watch: {
        $route (to, from) {
            if (window._czc) {
                let location = window.location;
                let contentUrl = location.pathname + location.hash;
                let refererUrl = '/';
                window._czc.push(['_trackPageview', contentUrl, refererUrl]);
            }
        }
    },
    beforeDestroy () {},
    methods: {}
};
</script>

<style>
html,
body {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
  overflow: hidden;
  font-size: 14px;
}
.app-main {
  width: 100%;
  height: 100%;
}
</style>
