<template>
    <div class="main-body article-list">
        <Form :model="formItem" :rules="ruleValidate" :label-width="80">
            <FormItem label="文章专栏" prop="foodTypeId">
                <Select v-model="formItem.foodTypeId" style="width:130px">
                    <Option v-for="item in articleTag" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <span style="color: blue">没有想要的类型？前往添加</span>
            </FormItem>
            <FormItem label="文章名称" prop="name">
                <Input v-model="formItem.name" placeholder="12字以内" :maxlength="12"></Input>
            </FormItem>
            <FormItem label="文章简介"  prop="synopsis">
                <Input v-model="formItem.synopsis" type="textarea" placeholder="30字以内" :maxlength="30" :autosize="{minRows: 4,maxRows: 5}"></Input>
            </FormItem>
            <FormItem label="文章主图" prop="imageUrl">
                <div class="logo-img-load">
                    <Input type="hidden" v-model="formItem.image"></Input>
                    <div class="logo-img"><img :src="formItem.image" alt></div>
                    <div class="img-upload">
                        <ali-upload v-on:url="getUploadUrl" id="banner" :isImg="true" :maxNum="1"></ali-upload>
                    </div>
                    <p class="img-tips">规格尺寸：750*400</p>
                </div>
            </FormItem>
            <FormItem>
                <RadioGroup v-model="disabledGroup" @on-change="changeRodio">
                    <Radio label="图文编辑"></Radio>
                    <Radio label="文章链接"></Radio>
                </RadioGroup>
            </FormItem>
            <FormItem prop="video" v-if="disabledGroup === '文章链接'">
                <Input v-model="formItem.url" placeholder="http://"></Input>
                <p style="color: red">文章链接</p>
            </FormItem>
            <FormItem label="文章详情"  prop="textarea" v-if="disabledGroup === '图文编辑'">
                <Input v-model="formItem.details" type="textarea"  placeholder="主要用料" :autosize="{minRows: 7,maxRows: 5}"></Input>
            </FormItem>
            <FormItem>
                <Button class="btn btn-blue" @click="saveOperation">保存</Button>
                <Button class="btn btn-blue" style="margin-left: 8px"  @click="goBack">取消</Button>
            </FormItem>
        </Form>
    </div>
</template>

<script>
    import aliUpload from '@/views/my-components/ali-upload.vue';
    export default {
        components: {
            aliUpload
        },
        data () {
            return {
                flag: null, // 1-新增店铺  2-编辑店铺
                articleTag: [],
                appResourceInfoExDto: {
                    appResourcesInfo: {},
                    ids: []
                },
                formItem: {
                    foodTypeId: null,
                    name: '',
                    synopsis: '',
                    type: 2,
                    details: '',
                    image: '',
                    resType: 1,
                    url: '',
                },
                disabledGroup: '',
                sortList: [
                    {
                        value: '四季型',
                        label: '四季型'
                    },
                    {
                        value: '功效型',
                        label: '功效型'
                    },
                    {
                        value: '体质型',
                        label: '体质型'
                    },
                ],
                ruleValidate: {
                    foodTypeId: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    synopsis: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                    imageUrl: [
                        { required: true, message: '不能为空', trigger: 'blur' }
                    ],
                },
            };
        },

        created () {
            this.getTag();   //获取标签类型
            this.flag = this.$route.query.flag;
            if(this.flag === 2) {
                this.formItem = this.$route.query.articleInfo;
                this.formItem.resType === 1 ? this.disabledGroup='图文编辑' : this.disabledGroup='文章链接';
                this.ids = this.formItem.typeName;
            }
        },

        methods: {
            getTag() {    //获取标签类型
                let that = this;
                let url= that.serviceurl + '/herbsfoods/getAppTag';
                let params = {type: 1};
                that
                    .$http(url, params, '', 'get')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            let articleTag = res.data.data;
                            articleTag.map(item =>{
                                that.articleTag.push({
                                    value: item.id,
                                    label: item.name,
                                })
                            })
                            console.log(that.articleTag)
                        } else {
                            that.$Message.warning(res.data.retMsg);
                        }
                    })
                    .catch(e => {
                        that.$Message.error('请求错误');
                    })
            },

            changeRodio(val) {
                if(val === '图文编辑') {
                    this.formItem.resType = 1;
                } else {
                    this.formItem.resType = 2;
                }
            },

            saveOperation() {
                if(this.flag === 1) {
                    this.addOperation();
                } else {
                    this.editOperation();
                }
            },

            addOperation() {   //保存文章信息
                let that = this;
                let url= that.serviceurl + '/herbsfoods/operationMgtAdd';
                that.formItem.createTime = new Date().getTime();
                that.appResourceInfoExDto.appResourcesInfo = that.formItem;
                let data = that.appResourceInfoExDto;
                that
                    .$http(url, '', data, 'post')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            that.$Message.success('文章添加成功！');
                            that.$router.push({name: 'articleManage'});
                        } else {
                            that.$Message.warning(res.data.retMsg);
                        }
                    })
                    .catch(e => {
                        that.$Message.error('请求错误');
                    })
            },

            editOperation() {   //修改文章信息
                let that = this;
                let url= that.serviceurl + '/herbsfoods/operationMgtEdit';
                that.formItem.updateTime = new Date().getTime();
                that.appResourceInfoExDto.appResourcesInfo = that.formItem;
                let data = that.appResourceInfoExDto;
                that
                    .$http(url, '', data, 'post')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            that.$Message.success('修改成功！');
                            that.$router.push({name: 'articleManage'});
                        } else {
                            that.$Message.warning(res.data.retMsg);
                        }
                    })
                    .catch(e => {
                        that.$Message.error('请求错误');
                    })
            },

            goBack() {
                this.$router.push({name: 'articleManage'});
            },

            getUploadUrl (val) {
                this.formItem.image = val[0];
            }
        }
    };
</script>

<style lang="less" scoped>
    .article-list {
        font-size: 14px;
        /deep/ .ivu-input {
            width: 22%;
        }
        .logo-img-load {
            position: relative;
            margin-top: -20px;
            .logo-img {
                width: 100px;
                height: 100px;
                border-radius: 5px;
                border: 1px solid #4444445e;
                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 5px;
                }
            }
            .img-upload {
                position: absolute;
                top: 62px;
                left: 20px;
            }
            /deep/ .ivu-btn {
                width: 85%;
                background: #fff;
                border-color: #4444445e;
                border-radius: 20px;
                height: 23px;
                color: #444;
                line-height: 13px;
                padding-left: 5px;
            }
            .img-tips {
                position: absolute;
                bottom: -7px;
                left: 105px;
            }
        }
    }
</style>