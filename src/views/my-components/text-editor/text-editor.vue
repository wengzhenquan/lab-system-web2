<style lang="less">
@import "../../../styles/loading.less";
</style>

<template>
    <div>
        <input :id="`file${count}`" type="file" @change="doUpload" style="display:none">
            <textarea class='tinymce-textarea' :id="`tinymceEditer${count}`"></textarea>
        <Spin fix v-if="spinShow">
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>加载组件中...</div>
        </Spin>
    </div>
</template>

<script>
import tinymce from 'tinymce';
import config from '@/utils/config.js';

export default {
    name: 'text-editor',
    props: {
        val: {
            type: String,
            default: ''
        },
        count: {
            type: String,
            default: '1'
        }
    },
    data () {
        return {
            region: 'oss-cn-shanghai',
            folder: 'test',
            spinShow: true,
            status: 0
        };
    },
    methods: {
        init () {
            this.$nextTick(() => {
                let vm = this;
                let height = document.body.offsetHeight - 300;
                tinymce.baseURL = config.context + '/dist';
                tinymce.init({
                    selector: `#tinymceEditer${vm.count}`,
                    branding: false,
                    elementpath: false,
                    height: height,
                    language: 'zh_CN.GB2312',
                    menubar: 'edit insert view format table tools',
                    plugins: [
                        'advlist autolink lists link charmap print preview hr anchor pagebreak ',
                        'searchreplace visualblocks visualchars code fullpage',
                        'insertdatetime media nonbreaking save table contextmenu directionality',
                        'paste textcolor colorpicker textpattern codesample'
                    ],
                    toolbar1:
            ' newnote print preview | undo redo | insert | styleselect| fontsizeselect |forecolor backcolor bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link mybutton media codesample',
                    fontsize_formats:
            '8px 10px 12px 14px 16px 18pt 20px 22px 24px 26px 28px 30px 32px 34px 36px 38px 40px 42px 44px 46px 48px 50px 52px 54px 56px 58px 60px',
                    autosave_interval: '20s',
                    image_advtab: true,
                    table_default_styles: {
                        width: '100%',
                        borderCollapse: 'collapse'
                    },
                    setup: function (editor) {
                        editor.addButton('mybutton', {
                            title: '上传图片',
                            icon: 'mce-ico mce-i-image',
                            onclick: function () {
                                document.getElementById(`file${vm.count}`).click();
                            }
                        });
                        editor.on('init', function (e) {
                            vm.spinShow = false;
                            setTimeout(() => {
                                // console.log(vm.val);
                                tinymce.get(`tinymceEditer${vm.count}`).setContent(vm.val);
                            }, 200);
                        });
                        editor.on('input change undo redo', () => {
                            let content = editor.getContent();
                            vm.$emit('input', content);
                        });
                    }
                });
            });
        },
        doUpload () {
            this.$http
                .get(
                    `${
                        this.serviceurl
                    }/weteam-service/oss/sts/policy/authorization/DUIKA_TEST_OSS?folder=${
                        this.folder
                    }`
                )
                .then(res => {
                    const client = new OSS.Wrapper({
                        region: this.region,
                        accessKeyId: res.data.data.AccessKeyId,
                        accessKeySecret: res.data.data.AccessKeySecret,
                        stsToken: res.data.data.SecurityToken,
                        bucket: res.data.data.bucketName
                    });
                    const files = document.getElementById(`file${this.count}`);
                    if (!/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(files.files[0].name)) {
                        alert('请上传图片！');
                        return false;
                    }
                    if (files.files) {
                        const fileLen = document.getElementById(`file${this.count}`).files;
                        const resultUpload = [];
                        for (let i = 0; i < fileLen.length; i++) {
                            const file = fileLen[i];

                            // 文件重命名为原文件名+时间戳格式，保证文件文件名唯一
                            const timestamp = new Date().getTime();
                            let fileName =
                file.name.split('.')[0] +
                timestamp +
                '.' +
                file.name.split('.')[1];

                            const storeAs = `${this.folder}/${fileName}`;

                            client
                                .multipartUpload(storeAs, file, {})
                                .then(results => {
                                    console.log(results);
                                    // if (results.url) {
                                    //   const img = `<img src=${results.url}>`;
                                    //   tinymce
                                    //     .get(`tinymceEditer${this.count}`)
                                    //     .insertContent(img);
                                    // }
                                    if (results.res.requestUrls) {
                                        const img = `<img src=${
                                            results.res.requestUrls[0].split('?')[0]
                                        }>`;
                                        tinymce
                                            .get(`tinymceEditer${this.count}`)
                                            .insertContent(img);
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                        }
                    }
                });
        }
    },
    mounted () {
        this.init();
    },
    destroyed () {
        tinymce.get(`tinymceEditer${this.count}`).destroy();
    }
};
</script>

<style>
</style>
