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
            <TabPane label="已处理">
                <Table border ref="selection" :columns="columns" :data="applyList"></Table>
                <div style="margin-top: 20px; display: flex;justify-content: flex-end">
                    <Page :total="total" :key="total" :current.sync="current" @on-change="pageChange" />
                </div>
            </TabPane>
        </Tabs>

        <Modal v-model="modal" width="480">
            <p slot="header" style="color:blue;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>修改设备报修申请审批状态</span>
            </p>
            <p style="margin-bottom: 12px;font-size: 14px">
                <span>处理结果：</span>
                <Input v-model="result" type="textarea" :autosize="{minRows: 4,maxRows: 5}" style="width: 300px"></Input>
            </p>
            <!--<div style="text-align:center;font-size: 14px">-->
                <!--<p>您正在处理该条设备报修申请，若通过申请，则点击蓝色按钮，不通过点击红色按钮！</p>-->
            <!--</div>-->
            <div slot="footer" style="text-align: center">
                <Button type="primary" @click="editStatus(1)">已审批</Button>
                <Button type="error" @click="editStatus(2)">已处理</Button>
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
                equipmentLog: [],
                result: '',
                columns: [
                    {
                        title: '标题',
                        key: 'title',
                        align: 'center'
                    },
                    {
                        title: '申请人',
                        key: 'applyName',
                        align: 'center'
                    },
                    {
                        title: '设备类别',
                        key: 'typeName',
                        align: 'center'
                    },
                    {
                        title: '申请需求',
                        key: 'need',
                        align: 'center'
                    },
                    {
                        title: '申请状态',   // 0 - 审核中，1-已审批， 2-已处理
                        key: 'state',
                        align: 'center',
                        render: (h,params) => {
                            return h('p',params.row.state === 0 ? '申请中' : (params.row.state === 1 ? '已审批': '已处理'))
                        }
                    },
                    {
                        title: '申请结果',
                        key: 'result',
                        align: 'center'
                    },
                    {
                        title: '处理人',
                        key: 'handleUserName',
                        align: 'center'
                    },
                    {
                        title: '处理时间',
                        key: 'handleTime',
                        align: 'center'
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small',
                                        disabled: params.row.state !== 0 ? 'true' : false
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.equipmentLog = params.row;
                                            this.modal = true;
                                        }
                                    }
                                }, params.row.state !== 0 ? '已处理' : '待处理'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.del(params.row.id)
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
            this.getList(0);
        },

        methods: {
            getApplyList(num) {
                this.pageNo = 1;
                this.getList(num);
            },

            pageChange(val) {},

            //获取设备报修申请列表
            getList(n) {
                let that = this;
                let url = that.BaseConfig + '/selectEquipmentLogAll';
                // let eqClassId;
                // that.eqClassId === -1 ? eqClassId = '': eqClassId = that.eqClassId;
                let state;
                n === 0 ? state = '': state = n;
                let params ={
                    // eqClassId: eqClassId,
                    // applyName: that.applyName,
                    // handleUserName: that.handleUserName,
                    // userId: that.userId,
                    state:state,
                    type: 0,
                    pageNo: that.pageNo,
                    pageSize: 10,
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

            editStatus(n) {
                this.editApply(n);
            },

            //修改申请
            editApply(num) {
                let that = this;
                let url = that.BaseConfig + '/updateEquipmentLog';
                that.equipmentLog.handleTime = new Date().getTime();
                that.equipmentLog.creatTime = new Date(that.equipmentLog.creatTime).getTime();
                that.equipmentLog.handleUserId = JSON.parse(localStorage.getItem('loginInfo')).userId;
                that.equipmentLog.state = num;
                that.equipmentLog.result = that.result;
                let data =that.equipmentLog;
                that
                    .$http(url, '', data, 'post')
                    .then(res => {
                        data = res.data;
                        if(data.retCode === 0) {
                            that.$Message.success('修改申请成功！');
                            that.modal = false;
                            that.getList();
                        } else {
                            that.$Message.error(data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

            del(id) {
                let that = this;
                let url = that.BaseConfig + '/deleteEquipmentLog';
                let params ={
                    equipmentLogId: id,
                }
                let data = null;
                that
                    .$http(url, params, data, 'get')
                    .then(res => {
                        data = res.data;
                        if(data.retCode === 0) {
                            that.$Message.success('删除成功！');
                            that.getList(0);
                        } else {
                            that.$Message.error(data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },
        },
    }
</script>

<style scoped>

</style>
