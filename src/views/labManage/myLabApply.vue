<template>
    <div class="box">
        <div class="search-title">
            <!--<div>-->
                <!--<div><p>账户：</p><Input placeholder="关键字模糊搜索" style="width: 140px;margin-top: 8px" v-model="userName"/></div>-->
                <!--<div><p>用户名称：</p><Input style="width: 140px;margin-top: 8px" v-model="name"/></div>-->
                <!--<div><p>身份：</p><Input style="width: 140px;margin-top: 8px" v-model="identityName"/></div>-->
            <!--</div>-->
            <!--<Button type="primary" @click="searchUser">查询</Button>-->
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
                title="实验室申请"
                @on-ok="ok">
            <div>
                <Form :model="romsLog" :label-width="90">
                    <FormItem label="申请人：">
                        <Input v-model="romsLog.userId" disabled style="width: 90%"></Input>
                    </FormItem>
                    <FormItem label="申请教室：">
                        <Select v-model="romsLog.romId" style="width: 140px;margin-top: 8px">
                            <Option v-for="item in selectLab" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="使用时间：">
                        <DatePicker type="datetime" v-model="romsLog.startTime" format="yyyy-MM-dd HH:mm" placeholder="开始使用时间" style="width: 200px"></DatePicker>
                    </FormItem>
                    <FormItem label="结束时间：">
                        <DatePicker type="datetime" v-model="romsLog.endTime" format="yyyy-MM-dd HH:mm" placeholder="结束使用时间" style="width: 200px"></DatePicker>
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
                pageNo: 1,pageNo2:1,
                total:0,
                current: 1,
                applyList: [],
                userId: JSON.parse(localStorage.getItem('loginInfo')).userId,
                modal1: false,
                romsLog: {
                    userId: JSON.parse(localStorage.getItem('loginInfo')).userId,
                    romId: null,
                    startTime: '',
                    endTime: '',
                },
                labList: [],
                selectLab: [],
                columns: [
                    {
                        title: '申请人',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '申请教室',
                        key: 'romName',
                        align: 'center'
                    },
                    {
                        title: '使用时间',
                        key: 'startTime',
                        align: 'center'
                    },
                    {
                        title: '结束使用',
                        key: 'endTime',
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
                        title: '分配教室',
                        key: 'romName',
                        align: 'center'
                    },
                    {
                        title: '处理人',
                        key: 'handleUser',
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
            this.getLabList();
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

            //获取实验室申请列表
            getApplyList() {
                let that = this;
                let url = that.BaseConfig + '/selectRomLogAll';
                let params ={
                    userId: that.userId,
                    // state: 0,
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

            //获取实验室列表
            getLabList() {
                let that = this;
                let url = that.BaseConfig + '/selectRomsAll';
                let params = {
                    state: 0,
                    pageNo: that.pageNo2,
                    pageSize: 10,
                };
                let data = null;
                that
                    .$http(url, params, data, 'get')
                    .then(res => {
                        data = res.data;
                        if(data.retCode === 0) {
                            that.labList = that.labList.concat(data.data.data);
                            let total = data.data.total;
                            if (that.labList.length < total) {
                                that.pageNo2++;
                                that.getLabList();
                            }
                            that.labList.map(item =>{
                                console.log(item)
                                that.selectLab.push({
                                    value: item.id,
                                    label: item.romName,
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
                this.romsLog={
                    userId: JSON.parse(localStorage.getItem('loginInfo')).userId,
                    romId: null,
                    startTime: '',
                    endTime: '',
                };
                this.modal1 = true;
            },
            ok() {
                let that = this;
                let url = that.BaseConfig + '/selectRomLogAll';
                that.romsLog.startTime = new Date(that.romsLog.startTime).getTime();
                that.romsLog.endTime = new Date(that.romsLog.endTime).getTime();
                that.romsLog.creatTime = new Date().getTime();
                let data =that.romsLog;
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

            del(id) {
                let that = this;
                let url = that.BaseConfig + '/deleteRomLog';
                let params ={
                    romLogId: id,
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
