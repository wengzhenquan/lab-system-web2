<template>
    <div>
        <div class="cc-m-b-10 member-list-search">
            <div class="m-search-top">
                <div class="m-search-top-left">
                    <p>素材名称 &nbsp;&nbsp;<Input v-model="iName" placeholder="关键字模糊搜索" style="width: 110px" /></p>
                    <p>
                        状态 &nbsp;&nbsp;
                        <Select v-model="state" style="width:130px">
                            <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </p>
                </div>
            </div>
            <div class="m-search-btn">
                <Button class="btn btn-blue" @click="searchSource">查询</Button>
                <Button class="btn btn-blue" @click="goVideoList(1)">新增</Button>
                <Button class="btn btn-blue" @click="goVideoList(2)">编辑</Button>
                <Button class="btn btn-blue" @click="operationPutAwaySoltOut(1)" v-if="extensionInfo.status !== 1">上架</Button>
                <Button class="btn btn-blue" @click="operationPutAwaySoltOut(2)"  v-if="extensionInfo.status === 1">下架</Button>
                <Button class="btn btn-blue" @click="operationDelete">删除</Button>
            </div>
        </div>
        <div class="main-body">
            <Table class="cc-m-t-20" border :columns="table" :data="tableData"  @on-row-click="choiceUser" :highlight-row="true"></Table>
            <div class="page"><Page class="cc-m-t-20" :total="total" :key="total" :current="current" @on-change="changePage"></Page></div>
        </div>

        <Modal
                v-model="modal1"
                :footer-hide="true"
                :styles="{top: '30%'}"
               >
            <div class="extent-modal">
                <p v-if="flag === 1">新增</p>
                <p v-if="flag === 2">编辑</p>
                <p>素材名称&nbsp;&nbsp;<Input v-model="formItem.name" placeholder="输入素材名称，如：百草品客（15字）" :maxlength="15"/></p>
                <p>素材简介&nbsp;&nbsp;<Input v-model="formItem.synopsis" type="textarea" placeholder="输入简介，30字" :maxlength="30" :autosize="{minRows: 4,maxRows: 5}"></Input></p>
                <div class="extent-img">素材图片&nbsp;&nbsp;
                    <div class="logo-img-load">
                        <Input type="hidden" v-model="formItem.image"></Input>
                        <div class="logo-img"><img :src="formItem.image" alt></div>
                        <div class="img-upload">
                            <ali-upload v-on:url="getUploadUrl" id="banner" :isImg="true" :maxNum="1"></ali-upload>
                        </div>
                         <p class="img-tips">规格尺寸：750*1334,100KB,<span style="color:blue;">点击预览</span></p>
                    </div>
                </div>
                <div class="level-btn"><Button class="btn btn-blue" @click="saveOperation">提交</Button></div>
            </div>
        </Modal>
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
                current: 1,
                pageNo: 0,
                tableData: [],
                total: 0,
                state: -1,
                stateList: [
                    {
                        value: -1,
                        label: '全部'
                    },
                    {
                        value: 0,
                        label: '新建'
                    },
                    {
                        value: 1,
                        label: '启用'
                    },
                    {
                        value: 2,
                        label: '禁用'
                    }
                ],
                extensionId: null,
                extensionInfo: [],
                iName: '',
                formItem: {
                    name: '',
                    image: '',
                    synopsis: '',
                    type: 3,
                },
                appResourceInfoExDto: {
                    appResourcesInfo: {},
                    ids: []
                },
                start: false,
                modal1: false,
                flag: 1,
                table: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 60
                    },
                    {
                        title: '素材主图',
                        align: 'center',
                        key: 'image',
                        render: (h, params) => {
                            return h('div', [
                                h('img',{
                                    attrs: {
                                        src: params.row.image,
                                        style: 'width: 40px;height: 40px;border-radius: 2px;'
                                    }
                                })
                            ])
                        }
                    },
                    {
                        title: '素材名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '简介',
                        align: 'center',
                        key: 'synopsis'
                    },
                    {
                        title: '状态',
                        align: 'center',
                        render: (h, params) => {
                            return h('p', params.row.status === 0? '新建' : (params.row.status === 1 ? '启用' : '禁用'))
                        }
                    },
                    {
                        title: '创建时间',
                        align: 'center',
                        key: 'createTime'
                    },
                    {
                        title: '更新时间',
                        align: 'center',
                        key: 'updateTime'
                    },
                ]
            };
        },

        created () {
            this.getResourceInfo();
        },

        methods: {
            choiceUser(row,index) {   //选择表格某一行
                this.extensionId = row.id;
                this.extensionInfo = row;
            },

            changePage(val) {  //改变页码
                this.pageNo = val - 1;
                this.getResourceInfo();
            },

            goVideoList (num) {
                this.flag = num;
                if(num === 1) {
                    this.modal1 =  true;
                } else {
                    if(this.extensionId === null) {
                        this.$Message.warning('请先选择操作对象！');
                    } else {
                        this.formItem = this.extensionInfo;
                        this.modal1 =  true;
                    }
                }

            },

            searchSource() {
                this.pageNo = 0;
                this.getResourceInfo();
            },

            getResourceInfo() {   //获取素材列表
                let that = this;
                let url = that.serviceurl + '/herbsfoods/getResourceInfoList';
                let status;
                that.state === -1 ? status = '': status = that.state;
                let params = {
                    iName: that.iName,
                    status: status,
                    pageNo: that.pageNo,
                    pageSize: 10,
                    iType: 3,
                }
                that
                    .$http(url, params, '', 'get')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            that.tableData = res.data.data.data;
                            that.total = parseInt(res.data.data.total);
                            console.log('-- 素材资源 --',that.tableData)
                        } else {
                            that.$Message.warning(res.data.retMsg);
                        }
                    })
                    .catch(e => {
                        that.$Message.error('请求错误');
                    })
            },

            operationPutAwaySoltOut(num) {  //上下架  num：1-上架  2-下架
                let that = this;
                if(null === that.extensionId) {
                    that.$Message.warning('请先选择资源！');
                } else {
                    let url = that.serviceurl + '/herbsfoods/operationMgtPutAwaySoldOut';
                    let params = {
                        infoId: that.extensionId,
                        iStatus: num,
                    };
                    that
                        .$http(url, params, '', 'get')
                        .then(res => {
                            if(res.data.retCode === 0) {
                                that.$Message.success('资源状态修改成功！');
                                that.getResourceInfo();
                            } else {
                                that.$Message.warning(res.data.retMsg);
                            }
                        })
                        .catch(e => {
                            that.$Message.error('请求错误');
                        })
                }
            },

            operationDelete() {     //删除资源
                let that = this;
                if(null === that.extensionId) {
                    that.$Message.warning('请先选择资源！');
                } else {
                    let url = that.serviceurl + '/herbsfoods/operationMgtDelete';
                    let params = { resId: that.extensionId, type: 3};
                    that
                        .$http(url, params, '', 'get')
                        .then(res => {
                            if(res.data.retCode === 0) {
                                that.$Message.success('删除资源成功！');
                                that.getResourceInfo();
                            } else {
                                that.$Message.warning(res.data.retMsg);
                            }
                        })
                        .catch(e => {
                            that.$Message.error('请求错误');
                        })
                }
            },

            getUploadUrl (val) {
                this.formItem.image = val[0];
            },

            saveOperation() {
                console.log(this.flag)
                if(this.flag === 1) {
                    this.addOperation();
                } else if(this.flag === 2){
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
                            that.$Message.success('添加成功！');
                            that.modal1 = false;
                            that.getResourceInfo();
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
                            that.modal1 = false;
                            that.getResourceInfo();
                        } else {
                            that.$Message.warning(res.data.retMsg);
                        }
                    })
                    .catch(e => {
                        that.$Message.error('请求错误');
                    })
            },
        }
    };
</script>

<style lang="less" scoped>
    .extent-modal {
        font-size: 14px;
        p{
            padding-top: 10px;
            &:nth-child(1) {
                text-align: center;
                padding-top: 0;
                font-weight: 600;
                letter-spacing: 1px;
            }
            /deep/.ivu-input-wrapper {
                width: 75%;
            }
        }
        .extent-img {
            display: flex;
            margin-top: 10px;
        }
        .logo-img-load {
            position: relative;
            margin-top: -20px;
            .logo-img {
                width: 100px;
                height: 160px;
                border-radius: 5px;
                border: 1px solid #4444445e;
                background-color: #ccc;
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
                border-color: blue;
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
                width: 210px;
                font-size: 12px;
            }
        }
        .level-btn {
            text-align: center;
            margin-top: 20px;
        }
    }
</style>