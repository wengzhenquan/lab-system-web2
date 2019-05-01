<template>
  <div>
    <TextEditor :val="editCont" @input="getEditContent" :count='count'></TextEditor>
  </div>
</template>
<script>
import TextEditor from './text-editor/text-editor.vue';
export default {
    props: {
    // 值为true时，resUrl必须有值
        isEdit: {
            type: Boolean,
            default: false
        },
        // 文档的oss地址
        resUrl: {
            type: String,
            default: ''
        },
        editCont: {
            type: String,
            default: ''
        },
        title: {
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
            folder: 'test'
        };
    },
    components: {
        TextEditor
    },
    created () {},
    methods: {
        getEditContent (val) {
            const REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/;
            const result = REG_BODY.exec(val);
            this.$emit('docResult', result[1]);
        },
        // 保存文档至oss
        saveEditContent () {
            this.$http
                .get(
                    `${
                        this.serviceurl
                    }/weteam-service/oss/sts/policy/authorization/DUIKA_TEST_OSS?folder=${
                        this.folder
                    }`
                )
                .then(res => {
                    if (res.data.retCode === 0) {
                        // 阿里oss文件上传
                        this.expiration = res.data.data.Expiration;
                        const client = new OSS.Wrapper({
                            region: this.region,
                            accessKeyId: res.data.data.AccessKeyId,
                            accessKeySecret: res.data.data.AccessKeySecret,
                            stsToken: res.data.data.SecurityToken,
                            bucket: res.data.data.bucketName
                        });
                        const timestamp = new Date().getTime();
                        let storeAs = '';
                        if (this.isEdit && this.resUrl != '') {
                            storeAs = `${this.folder}/${this.resUrl.match(/([^/]+)$/)[1]}`;
                        } else {
                            storeAs = `${this.folder}/${this.title}${timestamp}.html`;
                        }

                        client
                            .put(storeAs, new Buffer(this.editCont), {
                                mime: 'text/html; charset=utf-8'
                            })
                            .then(results => {
                                console.log(results);
                                console.log(results.url);
                                this.$emit('docSaveSuccess', results.url);
                            })
                            .catch(err => {
                                this.$Message.warning('文档上传失败！');
                                console.log(err);
                            });
                    } else {
                        this.$Message.warning(res.data.retMsg || '文件上传授权失败！');
                    }
                });
        }
    }
};
</script>