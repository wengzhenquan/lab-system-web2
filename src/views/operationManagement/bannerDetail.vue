<template>
    <div class="main-body article-list">
        <Form :model="formItem"  :label-width="80">
            <FormItem label="门店名称" prop="shopId">
                <Select v-model="formItem.shopId" style="width:130px">
                    <Option v-for="item in storeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="图片名称" prop="bannerName">
                <Input v-model="formItem.bannerName" placeholder="12字以内" :maxlength="12"></Input>
            </FormItem>
           <FormItem label="图片地址" prop="imageUrl">
                <div class="logo-img-load">
                    <Input type="hidden" v-model="formItem.imageUrl"></Input>
                    <div class="logo-img"><img :src="formItem.imageUrl" alt></div>
                    <div class="img-upload">
                        <ali-upload v-on:url="getUploadUrl" id="banner" :isImg="true" :maxNum="1"></ali-upload>
                    </div>
                    <p class="img-tips">规格尺寸：750*400</p>
                </div>
            </FormItem>
            <FormItem prop="imageLink" label="图片链接">
                <Input v-model="formItem.imageLink" placeholder="http://"></Input>
            </FormItem>
             <FormItem label="备注"  prop="remark">
                <Input v-model="formItem.remark" type="textarea" placeholder="30字以内" :maxlength="30" :autosize="{minRows: 4,maxRows: 5}"></Input>
            </FormItem>
            <FormItem prop="imageLink" label="图片排序">
                <Input v-model="formItem.sort" type="number"></Input>
            </FormItem>
            <FormItem label="状态">
                <RadioGroup v-model="disabledGroup" @on-change="changeRodio">
                    <Radio label="禁用"></Radio>
                    <Radio label="启用"></Radio>
                </RadioGroup>
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
                storeList: [],
                appResourceInfoExDto: {
                    appResourcesInfo: {},
                    ids: []
                },
                formItem: {
                    "bannerName": "",
                    "createTime": "",
                    "id": 0,
                    "imageLink": "",
                    "imageUrl": "",
                    "remark": "",
                    "shopId": "",
                    "sort": 0,
                    "status": -1,
                    "type": 1,
                    "updateTime": ""
                    },
                disabledGroup: '',
            };
        },

        created () {
            this.getStoreList();   //获取门店列表
            this.flag = this.$route.query.flag;
            if(this.flag === 2) {
                this.formItem = this.$route.query.bannerInfo;
                this.formItem.status === 1 ? this.disabledGroup='启用' : this.disabledGroup='禁用';
            }
        },

        methods: {
            getStoreList() {    
                let that = this;
                let url= that.serviceurl + '/backstage/shop/pageShop';
                let params = {
                    
                }
                that
                    .$http(url, params, '', 'get')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            let storeList = res.data.data;
                            res.data.data.data.forEach(item =>{
                                var obj={
                                    value: item.id,
                                    label: item.shopName,
                                }
                                that.storeList.push(obj)
                            })
                        } else {
                            that.$Message.warning(res.data.retMsg);
                        }
                    })
            },
            changeRodio(val) {
                if(val === '禁用') {
                    this.formItem.status = 2;
                } else {
                    this.formItem.status = 1;
                }
            },

            saveOperation() {
                let that=this;
                
                if(!that.formItem.shopId)
                {
                    that.$Message.warning('请选择门店');
                    return false;
                }
                if(!that.formItem.bannerName)
                {
                    that.$Message.warning('图片名称不能为空');
                    return false;
                }
                if(!that.formItem.imageUrl)
                {
                    that.$Message.warning('图片地址不能为空');
                    return false;
                }
                 if(that.formItem.status==-1)
                {
                    that.$Message.warning('请选择状态');
                    return false;
                }
                console.log(that.formItem)
                if(that.flag == 1) {
                    //添加
                    that.addOperation();
                } else {
                    //编辑
                    this.editOperation();
                }
            },
            addOperation() {   //添加
                let that = this;
                let url= that.serviceurl + '/herbsfoods/admin/bannerImageAdd';
                that.formItem.createTime = new Date().getTime();
                that.formItem.updateTime = new Date().getTime();
                let data = that.formItem;
                that
                    .$http(url, '', data, 'post')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            that.$Message.success('轮播图添加成功！');
                            that.$router.push({name: 'uploadBanner'});
                        } else {
                            that.$Message.warning(res.data.retMsg);
                        }
                    })
                    .catch(e => {
                        that.$Message.error('请求错误');
                    })
            },
            editOperation() {   //修改
                let that = this;
                let url= that.serviceurl + '/herbsfoods/admin/bannerImageEdit';
                that.formItem.updateTime = new Date().getTime();
                let data = that.formItem;
                that
                    .$http(url, '', data, 'post')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            that.$Message.success('修改成功！');
                            that.$router.push({name: 'uploadBanner'});
                        } else {
                            that.$Message.warning(res.data.retMsg);
                        }
                    })
                    .catch(e => {
                        that.$Message.error('请求错误');
                    })
            },
            goBack() {
                this.$router.push({name: 'uploadBanner'});
            },
            getUploadUrl (val) {
                this.formItem.imageUrl = val[0];
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