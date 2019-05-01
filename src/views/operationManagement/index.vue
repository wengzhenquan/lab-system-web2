<template>
    <div>
        <div class="cc-m-b-10 member-list-search">
            <div class="m-search-top">
                <div class="m-search-top-left">
                    <p>视频名称 &nbsp;&nbsp;<Input v-model="iName" placeholder="关键字模糊搜索" style="width: 110px" /></p>
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
                <Button class="btn btn-blue" @click="operationPutAwaySoltOut(1)" v-if="videoInfo.status !== 1">上架</Button>
                <Button class="btn btn-blue" @click="operationPutAwaySoltOut(2)"  v-if="videoInfo.status === 1">下架</Button>
                <Button class="btn btn-blue" @click="operationDelete">删除</Button>
            </div>
        </div>
        <div class="main-body">
            <Table class="cc-m-t-20" border :columns="table" :data="tableData" @on-row-click="choiceUser" :highlight-row="true"></Table>
            <div class="page"><Page class="cc-m-t-20" :total="total" :key="total" :current="current" @on-change="changePage"></Page></div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                current: 1,
                pageNo: 0,
                total: 0,
                tableData: [],   //视频资源
                iName: '',
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
                videoInfo: [],   //选中视频信息
                videoId: null,   //选中视频ID
                table: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 60
                    },
                    {
                        title: '视频主图',
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
                        title: '视频名称',
                        align: 'center',
                        key: 'name'
                    },
                    {
                        title: '简介',
                        align: 'center',
                        key: 'synopsis'
                    },
                    {
                        title: '标签',
                        align: 'center',
                        key: 'typeName'
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'status',
                        render: (h, params) => {
                            return h('p', params.row.status === 0? '新建' : (params.row.status === 1 ? '启用' : '禁用'))
                        }
                    },
                    {
                        title: '创建时间',
                        align: 'center',
                        key: 'createTime',
                        render: (h, params) => {
                            return h("div", [
                                h("p", {},params.row.createTime === null ? '':
                                    this.formatDate(
                                        new Date(params.row.createTime),
                                        "yyyy-MM-dd hh:mm"
                                    )
                                )
                            ]);
                        }
                    },
                    {
                        title: '更新时间',
                        align: 'center',
                        key: 'updateTime',
                        render: (h, params) => {
                            return h("div", [
                                h("p", {},params.row.updateTime === null ? '':
                                    this.formatDate(
                                        new Date(params.row.updateTime),
                                        "yyyy-MM-dd hh:mm"
                                    )
                                )
                            ]);
                        }
                    },
                ]
            };
        },

        created () {
            this.getResourceInfo();
        },

        methods: {
            choiceUser(row,index) {   //选择表格某一行
                this.videoId = row.id;
                this.videoInfo = row;
            },

            changePage(val) {  //改变页码
                this.pageNo = val - 1;
                this.getResourceInfo();
            },

            goVideoList (num) {
                if(num === 1) {
                    this.$router.push({
                        path: '/addVideo',
                        query: {
                            flag: num,
                        }
                    })
                } else {
                    if(this.videoId === null) {
                        this.$Message.warning('请先选择操作对象！');
                    } else {
                        this.$router.push({
                            path: '/editVideo',
                            query: {
                                flag: num,
                                videoInfo: this.videoInfo,
                            }
                        })
                    }
                }
            },

            searchSource() {
                this.pageNo = 0;
                this.getResourceInfo();
            },

            getResourceInfo() {   //获取资源列表
                let that = this;
                let url = that.serviceurl + '/herbsfoods/getResourceInfoList';
                let status;
                that.state === -1 ? status = '': status = that.state;
                let params = {
                    iName: that.iName,
                    status: status,
                    pageNo: that.pageNo,
                    pageSize: 10,
                    iType: 1,
                }
                that
                    .$http(url, params, '', 'get')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            that.tableData = res.data.data.data;
                            that.total = parseInt(res.data.data.total);
                            console.log('-- 视频资源 --',that.tableData)
                        } else {
                            that.$Message.warning(res.data.retMsg);
                        }
                    })
                    .catch(e => {
                        that.$Message.error('请求错误');
                    })
            },

            operationDelete() {     //删除资源
                let that = this;
                if(null === that.videoId) {
                    that.$Message.warning('请先选择资源！');
                } else {
                    let url = that.serviceurl + '/herbsfoods/operationMgtDelete';
                    let params = { resId: that.videoId, type: 1};
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

            operationPutAwaySoltOut(num) {  //上下架  num：1-上架  2-下架
                let that = this;
                if(null === that.videoId) {
                    that.$Message.warning('请先选择资源！');
                } else {
                    let url = that.serviceurl + '/herbsfoods/operationMgtPutAwaySoldOut';
                    let params = {
                        infoId: that.videoId,
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
        }
    };
</script>

<style lang="less" scoped>
</style>