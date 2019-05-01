<template>
    <div>
        <Button type="primary" v-if="renew&&isRenew&&percent!=1" @click="continueUpload">继续上传</Button>
        <div class="oss_file" v-else>
            <slot><Button type="primary">点击上传</Button></slot>
            <input type="file" :id="id" :multiple="multiple" @change="doUpload"/>
        </div>
        
    </div>
</div>
</template>
<script>
import Cookies from 'js-cookie';
const clientId = Cookies.get('clientId') ? `/${Cookies.get('clientId')}` : '';

export default {
    props: {
        multiple: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            required: true
        },
        isImg: {
            type: Boolean,
            default: false
        },
        maxNum: {
            type: Number,
            default: 10
        },
        renew: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            isRenew: false,
            region: 'oss-cn-shanghai',
            folder: `herbsDood`,
            expiration: '',
            client: '',
            storeAs: '',
            file: '',
            percent: '',
            tempCheckpoint: '',
            resultUpload: []
        };
    },
    methods: {
        doUpload () {
            const _that = this;
            // if (this.resultUpload.length >= this.maxNum) {
            //   this.$Message.warning(`最多只能上传${this.maxNum}个文件`);
            //   return false;
            // }
            this.$axios
                .get(
                    `${
                        this.serviceurl
                    }/oss/sts/policy/authorization/DUIKA_TEST_OSS?folder=${
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
                        this.client = client;
                        const files = document.getElementById(this.id);
                        if (
                            this.isImg &&
              !/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(files.files[0].name)
                        ) {
                            this.$Message.warning('请上传图片！');
                            return false;
                        }
                        if (files.files) {
                            const fileLen = document.getElementById(this.id).files;
                            // const resultUpload = [];
                            for (let i = 0; i < fileLen.length; i++) {
                                const file = fileLen[i];
                                this.$emit('fileName', file.name);
                                this.$emit('fileSize', file.size);
                                console.log(file);
                                // 文件重命名为原文件名+时间戳格式，保证文件文件名唯一
                                const timestamp = new Date().getTime();
                                let fileName =
                  file.name.split('.')[0] +
                  timestamp +
                  '.' +
                  file.name.split('.')[1];

                                const storeAs = `${this.folder}/${fileName}`;

                                this.storeAs = storeAs;
                                this.file = file;

                                client
                                    .multipartUpload(storeAs, file, {
                                        progress: function * (p, checkpoint) {
                                            console.log('Progress: ' + p);
                                            console.log(`断点：${JSON.stringify(checkpoint)}`);
                                            _that.tempCheckpoint = checkpoint;
                                            _that.percent = p;
                                            _that.$emit('percent', p);
                                        }
                                    })
                                    .then(results => {
                                        console.log(results);
                                        if (results.res.requestUrls) {
                                            // this.resultUpload.push(
                                            //   results.res.requestUrls[0].split("?")[0]
                                            // );
                                            this.resultUpload[0] = results.res.requestUrls[0].split(
                                                '?'
                                            )[0];
                                            if (i == fileLen.length - 1) {
                                                this.$emit('url', this.resultUpload);
                                                console.log('--url--', this.resultUpload);
                                            }
                                        }
                                    })
                                    .catch(err => {
                                        this.isRenew = true;
                                        this.$Message.warning('上传失败！');
                                        console.log(err);
                                    });
                            }
                        }
                    } else {
                        this.$Message.warning(res.data.retMsg || '文件上传授权失败！');
                    }
                });
        },

        // 续传
        continueUpload () {
            const _that = this;
            if (!this.expiration || new Date() > this.expiration) {
                this.$http
                    .get(
                        `${
                            this.serviceurl
                        }/oss/sts/policy/authorization/DUIKA_TEST_OSS?folder=${
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
                            this.client = client;
                        } else {
                            this.$Message.warning(res.data.retMsg || '文件上传授权失败！');
                        }
                    });
            }
            this.client
                .multipartUpload(this.storeAs, this.file, {
                    checkpoint: this.tempCheckpoint,
                    progress: function * (p, checkpoint) {
                        console.log('Progress: ' + p);
                        console.log(`断点：${JSON.stringify(checkpoint)}`);
                        _that.tempCheckpoint = checkpoint;
                        _that.percent = p;
                        _that.$emit('percent', p);
                    }
                })
                .then(results => {
                    console.log(results);
                    if (results.res.requestUrls) {
                        this.resultUpload[0] = results.res.requestUrls[0].split('?')[0];
                        this.$emit('url', this.resultUpload);
                    }
                })
                .catch(err => {
                    this.isRenew = true;
                    this.$Message.warning('上传失败！');
                    console.log(err);
                });
        }
    }
};
</script>
<style type="text/css">
.oss_file {
  display: inline-block;
  position: relative;
  overflow: hidden;
}
.oss_file input {
  padding-top: 100%;
  position: absolute;
  right: 0;
  top: 0;
  opacity: 0;
  filter: alpha(opacity=0);
  cursor: pointer;
  width: 100%;
  height: 100%;
}
</style>