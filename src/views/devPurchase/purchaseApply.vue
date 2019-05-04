<template>
    <div class="box">
        <div class="search-title">
            <div>
                <div v-if="level !== 1"><p>申请人：</p><Input placeholder="关键字模糊搜索" style="width: 140px;margin-top: 8px" v-model="applyName"/></div>
                <div><p>处理人：</p><Input style="width: 140px;margin-top: 8px" v-model="handleUserName"/></div>
                <div><p>设备类型：</p>
                    <Select v-model="eqClassId" style="width: 140px;margin-top: 8px">
                        <Option v-for="item in selectEq1" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
            </div>
            <Button type="primary" @click="searchUser">查询</Button>
        </div>
        <div class="user-manage">
            <Button type="primary" @click="goAddApply">提交申请</Button>
        </div>
        <Table border ref="selection" :columns="columns" :data="applyList"></Table>
        <div style="margin-top: 20px; display: flex;justify-content: flex-end">
            <Page :total="total" :key="total" :current.sync="current" @on-change="pageChange" />
        </div>

        <Modal
                v-model="modal1"
                title="添加报修申请"
                @on-ok="ok">
            <div>
                <Form :model="equipmentLog" :label-width="90">
                    <FormItem label="申请人：">
                        <Input v-model="equipmentLog.applyName" disabled style="width: 90%"></Input>
                    </FormItem>
                    <FormItem label="标题：">
                        <Input v-model="equipmentLog.title" style="width: 90%"></Input>
                    </FormItem>
                    <FormItem label="设备类别：">
                        <Select v-model="equipmentLog.eqClassId" style="width: 140px;margin-top: 8px">
                            <Option v-for="item in selectEq" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="采购需求：">
                        <Input v-model="equipmentLog.need" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="输入文字描述"></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>

        <Modal
                v-model="modal2"
                title="修改报修申请"
                @on-ok="editApply">
            <div>
                <Form :model="equipmentLog" :label-width="90">
                    <FormItem label="申请人：">
                        <Input v-model="equipmentLog.applyName" disabled style="width: 90%"></Input>
                    </FormItem>
                    <FormItem label="标题：">
                        <Input v-model="equipmentLog.title" style="width: 90%"></Input>
                    </FormItem>
                    <FormItem label="设备类别：">
                        <Select v-model="equipmentLog.eqClassId" style="width: 140px;margin-top: 8px">
                            <Option v-for="item in selectEq" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="报修需求：">
                        <Input v-model="equipmentLog.need" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="输入文字描述"></Input>
                    </FormItem>
                </Form>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                level: null,
                pageNo: 1,pageNo2:1,pageNo1:1,
                total:0,
                current: 1,
                applyList: [],
                userId: JSON.parse(localStorage.getItem('loginInfo')).userId,
                modal1: false,
                modal2: false,
                applyName: '',
                handleUserName: '',
                equipmentLog: {
                    creatTime: '',
                    userId: JSON.parse(localStorage.getItem('loginInfo')).userId,
                    type: 1,
                    title: '',
                    eqClassId: '',
                    state: 0,
                    need: '',
                    applyId: JSON.parse(localStorage.getItem('loginInfo')).userId,
                    applyName: JSON.parse(localStorage.getItem('loginInfo')).name,
                },
                eqList: [],
                selectEq: [],
                eqClassId: -1,
                selectEq1: [
                    {
                        value: -1,
                        label: '全部'
                    }
                ],
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
                        title: '采购需求',
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
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.equipmentLog = params.row;
                                            this.modal2 = true;
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.del(params.row.id);
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
            this.getEqList();
            this.level = parseInt(this.Cookies.get('access'))
        },

        methods: {
            //改变页数
            pageChange(val) {
                this.pageNo = val;
                this.getApplyList();
            },

            //搜索
            searchUser() {
                this.pageNo = 1;
                this.getApplyList();
            },

            //获取申请列表
            getApplyList() {
                let that = this;
                let url = that.BaseConfig + '/selectEquipmentLogAll';
                let eqClassId;
                that.eqClassId === -1 ? eqClassId = '': eqClassId = that.eqClassId;
                let params ={
                    eqClassId: eqClassId,
                    applyName: that.applyName,
                    handleUserName: that.handleUserName,
                    userId: that.userId,
                    type: 1,
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

            //获取设备类别列表
            getEqList() {
                let that = this;
                let url = that.BaseConfig + '/selectEquipmentClassAll';
                let params = {
                    pageNo: that.pageNo1,
                    pageSize: 10,
                };
                let data = null;
                that
                    .$http(url, params, data, 'get')
                    .then(res => {
                        data = res.data;
                        if(data.retCode === 0) {
                            that.eqList = that.eqList.concat(data.data.data);
                            console.log(res)
                            if(that.eqList.length < data.data.total) {
                                that.pageNo1++;
                                that.getDevSortList();
                            }
                            that.eqList.map(item => {
                                that.selectEq.push({
                                    value: item.id,
                                    label: item.typeName
                                })
                                that.selectEq1.push({
                                    value: item.id,
                                    label: item.typeName
                                })
                            })
                        } else {
                            that.$Message.error(data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

            //提交申请
            goAddApply() {
                this.equipmentLog = {
                    userId: JSON.parse(localStorage.getItem('loginInfo')).userId,
                    type: 1,
                    title: '',
                    eqClassId: '',
                    state: 0,
                    need: '',
                    applyId: JSON.parse(localStorage.getItem('loginInfo')).userId,
                    applyName: JSON.parse(localStorage.getItem('loginInfo')).name,
                };
                this.modal1 = true;
            },
            ok() {
                let that = this;
                let url = that.BaseConfig + '/insertEquipmentLog';
                that.equipmentLog.creatTime = new Date().getTime();
                let data =that.equipmentLog;
                that
                    .$http(url, '', data, 'post')
                    .then(res => {
                        data = res.data;
                        if(data.retCode === 0) {
                            that.$Message.success('提交申请成功！');
                            that.modal1 = false;
                            that.getApplyList();
                        } else {
                            that.$Message.error(data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

            //修改申请
            editApply() {
                let that = this;
                let url = that.BaseConfig + '/updateEquipmentLog';
                that.equipmentLog.creatTime = new Date().getTime();
                let data =that.equipmentLog;
                that
                    .$http(url, '', data, 'post')
                    .then(res => {
                        data = res.data;
                        if(data.retCode === 0) {
                            that.$Message.success('修改申请成功！');
                            that.modal2 = false;
                            that.getApplyList();
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
                    equipmentLogId : id,
                }
                let data = null;
                that
                    .$http(url, params, data, 'get')
                    .then(res => {
                        data = res.data;
                        if(data.retCode === 0) {
                            that.$Message.success('删除成功！');
                            that.getApplyList();
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

<style lang="less" scoped>
</style>
