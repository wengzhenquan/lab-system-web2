<style lang="less">
@import "./main.less";
</style>
<template>
    <div class="main" :class="{'main-hide-text': shrink}">
        <div class="sidebar-menu-con" :style="{width: shrink?'0':'200px', overflow: shrink ? 'visible' : 'auto'}">
            <scroll-bar ref="scrollBar">
                <shrinkable-menu 
                    :shrink="shrink"
                    :theme="menuTheme" 
                    :open-names="openedSubmenuArr"
                    :menu-list="menuList"
                    >
                    <div slot="top">
                        <p style="font-size: 20px;font-weight: 600;text-align: center;color: #fff;
                        background-color:#2d8cf0;line-height: 64px">实验室系统</p>
                    </div>
                </shrinkable-menu>
            </scroll-bar>
        </div>
        <div class="main-header-con" :style="{paddingLeft: shrink?'0':'200px'}">
            <div class="main-header">
                <div class="icon-header" @click="toggleClick"><i class="iconfont">&#xe627;</i></div>
                <div style="width: 96%">
                    <p style="font-size: 14px;line-height: 64px">
                        <span style="padding-right: 10px">{{nowTime}}</span>
                        欢迎"{{loginInfo.name}}"登录 &nbsp;
                        您的身份是:{{loginInfo.identityName}}
                    </p>
                    <div class="header-avator-con">
                        <Button @click="backLogin">
                            <span>退出系统</span>
                        </Button>
                    </div>
                </div>
            </div>
            <div class="tags-con">
                <!--<breadcrumb-nav :currentPath="currentPath"></breadcrumb-nav>-->
                <!--<div v-if="currentPath.length > 1"><Button @click="backHome" class="btn btn-blue">返回首页</Button></div>-->
                <tags-page-opened :pageTagsList="pageTagsList" @on-close="checkTag"></tags-page-opened>
            </div>
        </div>
        <div class="single-page-con" :style="{left: shrink?'0':'200px'}">
            <div class="single-page">
                <keep-alive :include="cachePage">
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>
<script>
import shrinkableMenu from './main-components/shrinkable-menu/shrinkable-menu.vue';
import tagsPageOpened from './main-components/tags-page-opened.vue';
import breadcrumbNav from './main-components/breadcrumb-nav.vue';
import scrollBar from '@/views/my-components/scroll-bar/vue-scroller-bars';
import util from '@/libs/util.js';

export default {
    components: {
        shrinkableMenu,
        tagsPageOpened,
        breadcrumbNav,
        scrollBar
    },
    data () {
        const validatePass = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入密码！'));
            } else {
                if (this.formCustom.passwdCheck !== '') {
                    // 对第二个密码框单独验证
                    this.$refs.formCustom.validateField('passwdCheck');
                }
                callback();
            }
        };
        const validatePassCheck = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请再次输入密码！'));
            } else if (value !== this.formCustom.passwd) {
                callback(new Error('两次输入的密码不一致！'));
            } else {
                callback();
            }
        };
        return {
            loginInfo: [],
            nowTime: '',
            modifyModal: false,
            loading: true,
            shrink: false,
            userName: '',
            openedSubmenuArr: this.$store.state.app.openedSubmenuArr,
            formCustom: {
                passwd: '',
                passwdCheck: ''
            },
            ruleCustom: {
                passwd: [{ required: true, validator: validatePass, trigger: 'blur' }],
                passwdCheck: [
                    { required: true, validator: validatePassCheck, trigger: 'blur' }
                ]
            }
        };
    },
    computed: {
        menuList () {
            return this.$store.state.app.menuList;
        },
        pageTagsList () {
            return this.$store.state.app.pageOpenedList; // 打开的页面的页面对象
        },
        currentPath () {
            return this.$store.state.app.currentPath; // 当前面包屑数组
        },
        avatorPath () {
            return localStorage.avatorImgPath;
        },
        cachePage () {
            return this.$store.state.app.cachePage;
        },
        menuTheme () {
            return this.$store.state.app.menuTheme;
        }
    },
    methods: {
       // 返回首页
        backHome () {
            this.$router.push({
                name: 'home_index'
            });
        },

        //获取当前时间
        getNowTime() {
            let date = new Date();
            let year=date.getFullYear(); //获取当前年份
            let mon=date.getMonth()+1; //获取当前月份
            let da=date.getDate(); //获取当前日
            let day=date.getDay(); //获取当前星期几
            let week;
            if (day === 1){
                week = "一";
            }
            else if (day === 2){
                week = "二";
            }
            else if (day === 3){
                week = "三";
            }
            else if (day === 4){
                week = "四";
            }
            else if (day === 5){
                week = "五";
            }
            else if (day === 6){
                week = "六";
            }
            else if (day === 0){
                week = "日";
            }
            this.nowTime=year+"年"+mon+'月'+da+'日'+" "+" "+'星期'+week;
        },

        backLogin() {   //退出系统
           this.Cookies.remove('token');
           this.Cookies.remove('access');
           localStorage.removeItem('loginInfo')
           this.$router.push({name: 'login'})
        },

        init () {
            let pathArr = util.setCurrentPath(this, this.$route.name);
            this.$store.commit('updateMenulist');
            if (pathArr.length >= 2) {
                this.$store.commit('addOpenSubmenu', pathArr[1].name);
            }
            this.userName = this.Cookies.get('user');
            let messageCount = 3;
            this.messageCount = messageCount.toString();
            this.checkTag(this.$route.name);
            this.$store.commit('setMessageCount', 3);
        },
        toggleClick () {
            this.shrink = !this.shrink;
        },
        handleClickUserDropdown (name) {
            if (name === 'loginout') {
                // 退出登录
                this.$store.commit('logout', this);
                this.$store.commit('clearOpenedSubmenu');
                this.$store.commit('clearAllTags');
                this.$router.push({
                    name: 'login'
                });
            }
        },
        checkTag (name) {
            let openpageHasTag = this.pageTagsList.some(item => {
                if (item.name === name) {
                    return true;
                }
            });
            if (!openpageHasTag) {
                //  解决关闭当前标签后再点击回退按钮会退到当前页时没有标签的问题
                util.openNewPage(
                    this,
                    name,
                    this.$route.params || {},
                    this.$route.query || {}
                );
            }
        },

        scrollBarResize () {
            this.$refs.scrollBar.resize();
        },
    },
    watch: {
        $route (to) {
            this.$store.commit('setCurrentPageName', to.name);
            let pathArr = util.setCurrentPath(this, to.name);
            if (pathArr.length > 2) {
                this.$store.commit('addOpenSubmenu', pathArr[1].name);
            }
            this.checkTag(to.name);
            localStorage.currentPageName = to.name;
        },
        lang () {
            util.setCurrentPath(this, this.$route.name); // 在切换语言时用于刷新面包屑
        },
        openedSubmenuArr () {
            setTimeout(() => {
                this.scrollBarResize();
            }, 300);
        }
    },
    mounted () {
        this.init();
        window.addEventListener('resize', this.scrollBarResize);
    },
    created () {
    // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.loginInfo = JSON.parse(localStorage.getItem('loginInfo'));
        this.getNowTime();
    },
    dispatch () {
        window.removeEventListener('resize', this.scrollBarResize);
    }
};
</script>
