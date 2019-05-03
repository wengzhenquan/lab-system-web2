<template>
    <div class="box">
        <Tabs type="card" @on-click="getApplyList">
            <TabPane label="全部">
                <Table border ref="selection" :columns="columns" :data="applyList"></Table>
                <div style="margin-top: 20px; display: flex;justify-content: flex-end">
                    <Page :total="total" :key="total" :current.sync="current" @on-change="pageChange" />
                </div>
            </TabPane>
            <TabPane label="申请中">
                <Table border ref="selection" :columns="columns" :data="applyList"></Table>
                <div style="margin-top: 20px; display: flex;justify-content: flex-end">
                    <Page :total="total" :key="total" :current.sync="current" @on-change="pageChange" />
                </div>
            </TabPane>
            <TabPane label="已审批">
                <Table border ref="selection" :columns="columns" :data="applyList"></Table>
                <div style="margin-top: 20px; display: flex;justify-content: flex-end">
                    <Page :total="total" :key="total" :current.sync="current" @on-change="pageChange" />
                </div>
            </TabPane>
            <TabPane label="未通过审批">
                <Table border ref="selection" :columns="columns" :data="applyList"></Table>
                <div style="margin-top: 20px; display: flex;justify-content: flex-end">
                    <Page :total="total" :key="total" :current.sync="current" @on-change="pageChange" />
                </div>
            </TabPane>
        </Tabs>
        <Modal v-model="modal" width="360">
            <p slot="header" style="color:blue;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>修改设备申请审批状态</span>
            </p>
            <div style="text-align:center;font-size: 14px">
                <p>您正在处理该条设备申请，若通过申请，则点击蓝色按钮，不通过点击红色按钮！</p>
            </div>
            <div slot="footer" style="text-align: center">
                <Button type="primary" @click="editApplyStatus(1)">通过审批</Button>
                <Button type="error" @click="editApplyStatus(2)">未通过审批</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                pageNo: 1,
                total:0,
                current:1,
                applyList: [],
                modal: false,
                editState: {
                    romLogId: null,
                    romId: null,
                    state: null,   // 0申请中,1已审批,2未通过审批
                    handleUserId: JSON.parse(localStorage.getItem('loginInfo')).userId,
                },
                columns: [
                    {
                        title: '申请人',
                        key: 'name'
                    },
                    {
                        title: '申请教室',
                        key: 'romName'
                    },
                    {
                        title: '使用时间',
                        key: 'startTime'
                    },
                    {
                        title: '结束使用',
                        key: 'endTime'
                    },
                    {
                        title: '申请状态',   // 0 - 审核中，1-已审批， 2-已处理
                        key: 'state',
                        render: (h,params) => {
                            return h('p',params.row.state === 0 ? '申请中' : (params.row.state === 1 ? '已审批': '已处理'))
                        }
                    },
                    {
                        title: '处理人',
                        key: 'handleUser',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            console.log(params.row)
                                            this.editState.romLogId = params.row.id;
                                            this.editState.romId = params.row.romId;
                                            this.modal = true;
                                        }
                                    }
                                }, '处理'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            // 申请实验室
                                        }
                                    }
                                }, '删除'),
                            ]);
                        }
                    }
                ],
            }
        },

        created() {
            this.getApplyList();
        },

        methods: {
            //改变页数
            pageChange(val) {
                this.pageNo = val;
                this.getApplyList();
            },

            //获取实验室申请列表
            getApplyList(name) {  //name为0-全部，1-待审核， 2-已审批 ， 3-已处理
                let that = this;
                let url = that.BaseConfig + '/selectRomLogAll';
                let params;
                if(name === 0 || name === undefined) {
                    params = {
                        pageNo: that.pageNo,
                        pageSize: 10,
                    }
                } else if(name === 1) {
                    params = {
                        state: 0,
                        pageNo: that.pageNo,
                        pageSize: 10,
                    }
                } else if(name === 2) {
                    params = {
                        state: 1,
                        pageNo: that.pageNo,
                        pageSize: 10,
                    }
                } else if(name === 3) {
                    params = {
                        state: 2,
                        pageNo: that.pageNo,
                        pageSize: 10,
                    }
                }
                let data = null;
                that
                    .$http(url, params, data, 'get')
                    .then(res => {
                        data = res.data;
                        if(data.retCode === 0) {
                            that.applyList = data.data.data;
                            that.total = data.data.total;
                        } else {
                            that.$Message.error(data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

            //修改申请状态
            editApplyStatus(num) {
                let that = this;
                let url = that.BaseConfig + '/updateRomLogState';
                let params = {
                    romLogId: that.editState.romLogId,
                    romId: that.editState.romId,
                    state: num,
                    handleUserId: that.editState.handleUserId
                };
                let data = null;
                that
                    .$http(url, params, data, 'get')
                    .then(res => {
                        data = res.data;
                        if(data.retCode === 0) {
                            that.$Message.success('处理成功！');
                            this.modal = false;
                            that.getApplyList();
                            // that.changeLab();  //修改实验室状态
                        } else {
                            that.$Message.error(data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

        }
    }
</script>

<style lang="less" scoped>
.box {
    /deep/ .ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab {
        background: #2b85e4;
        color: #fff;
    }
    /deep/ .ivu-tabs-nav .ivu-tabs-tab:hover {
        background: #fff;
        color: #2b85e4;
    }
    /deep/.ivu-tabs.ivu-tabs-card>.ivu-tabs-bar .ivu-tabs-tab-active {
        background: #fff;
        color: #2b85e4;
    }
}
</style>
