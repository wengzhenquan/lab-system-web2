<template>
    <div>
        <div class="cc-m-b-10 member-list-search">
            <div class="m-search-top">
                <div class="m-search-top-left">
                    <p>会员名称 &nbsp;&nbsp;<Input v-model="keyword" placeholder="关键字模糊搜索" style="width: 110px" /></p>
                    <p>手机号码 &nbsp;&nbsp;<Input v-model="phone" style="width: 110px" /></p>
                    <p>店铺名称 &nbsp;&nbsp;<Input v-model="shopName" style="width: 110px" /></p>
                    <p>
                        等级 &nbsp;&nbsp;
                        <Select v-model="level" style="width:130px" >
                            <Option v-for="item in levelList" placeholder="全部" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </p>
                    <p>
                        状态 &nbsp;&nbsp;
                        <Select v-model="state" style="width:130px">
                            <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </p>
                </div>
                <p style="font-size: 18px; font-weight: 600; line-height: 32px;">会员总数：{{total}}</p>
            </div>
            <div class="m-search-btn">
                <Button class="btn btn-blue" @click="searchMem">查询</Button>
                <Button class="btn btn-blue" @click="isLevelSet">等级设置</Button>
                <Button class="btn btn-blue" @click="statusChange(1)" v-if="start ===4">启用</Button>
                <Button class="btn btn-blue" @click="statusChange(4)" v-if="start === 1">禁用</Button>
                <Button class="btn btn-blue" @click="statusChange(5)">删除</Button>
            </div>
        </div>
        <div class="main-body">
            <Table class="cc-m-t-20" border :columns="table" :data="userList" @on-row-click="choiceUser" :highlight-row="true"></Table>
            <div class="page"><Page class="cc-m-t-20" :total="total" :key="total" :current="current" @on-change="changePage"></Page></div>
        </div>
        <Modal
             v-model="levelSet"
             :footer-hide="true"
             :styles="{top: '30%'}">
            <div class="level-setting">
                <p>等级设置</p>
                <p><span style="color: #fff">*</span>父级账户&nbsp;&nbsp;
                    <Select v-model="level" style="width:75%">
                        <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </p>
                <p>父级账户设置，没有则不设置</p>
                <p><span style="color: red">*</span>账户等级&nbsp;&nbsp;
                    <Select v-model="levelId" style="width:75%">
                        <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </p>
                <div class="level-btn"><Button class="btn btn-blue" @click="levelSetBtn">提交</Button></div>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                current: 1,
                pageNo: 0,
                total: 0,
                userList: [],
                pageNo1: 0,
                keyword: '',
                phone: '',
                shopName: '',
                level: -1,
                levelList: [
                    {
                        value: -1,
                        label: '全部'
                    },
                ],
                state: -1,
                stateList: [
                    {
                        value: -1,
                        label: '全部'
                    },
                    {
                        value: 1,
                        label: '启用'
                    },
                    {
                        value: 4,
                        label: '禁用'
                    },
                ],
                start: 1,
                levelSet: false, // 等级设置弹框
                userId: null,
                levelId: -1,
                parentId: null,
                table: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 60
                    },
                    {
                        title: '会员名称',
                        align: 'center',
                        key: 'nickName'
                    },
                    {
                        title: '手机号码',
                        align: 'center',
                        key: 'phone'
                    },
                    {
                        title: '店铺名称',
                        align: 'center',
                        key: 'shopName'
                    },
                    {
                        title: '会员等级',
                        align: 'center',
                        key: 'levelName'
                    },
                    {
                        title: '复购金额30%',
                        align: 'center',
                        key: 'repeatPurchase',
//                        sortable: 'custom' // 是否可远程排序，需要监听on-sort-change事件
                    },
                    {
                        title: '可提现金额70%',
                        align: 'center',
                        key: 'withdrawable',
                    },
                    {
                        title: '性别',
                        align: 'center',
                        key: 'gender',
                        width: 80,
                        render: (h,params) => {
                            return h('p',params.row.gender === 0? '未知':(params.row.gender === 1? '男':'女'))
                        }
                    },
                    {
                        title: '生日',
                        align: 'center',
                        key: 'birth'
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'status',
                        width: 100,
                        render: (h, params) => {
                            return h('div', [
                                h('span',{
                                    style: {
                                        color: params.row.status === 4 ? 'red':'444',
                                    }
                                },params.row.status === 0 ? '未使用':(params.row.status === 1? '启动': (params.row.status === 2? '挂失':(params.row.status === 3? '注销':(params.row.status === 4? '禁用':'删除')))))
                            ])
                        }
                    },
                    {
                        title: '创建时间',
                        align: 'center',
                        key: 'createTime'
                    },
                    {
                        title: '最后一次登录时间',
                        align: 'center',
                        key: 'lastLoginTime'
                    }
                ]
            };
        },

        created () {
            this.getLevelList();
            this.getUserList();
        },

        methods: {
            isLevelSet () {
                if(this.userId === null) {
                    this.$Message.warning('请选择用户！')
                } else {
                    this.levelSet = true;
                }
            },

            changePage(val) {  //改变页码
                this.pageNo = val - 1;
                this.getUserList();
            },

            searchMem() {   //查询
                this.pageNo = 0;
                this.getUserList();
            },

            getUserList() {      //获取会员列表
                let that = this;
                let url = this.serviceurl + '/backstage/userInfo/pageUser';
                let levelId;
                let status;
                if(that.level === -1) {levelId = ''} else {levelId = that.level}
                if(that.state === -1) {status = ''} else {status = that.state}
                let params = {
                    keyword: that.keyword,
                    phone: that.phone,
                    shopName: that.shopName,
                    levelId: levelId,
                    status: status,
                    pageNo: that.pageNo,
                    pageSize: 10,
                }
                let data = null;
                that
                    .$http(url, params, data, "get")
                    .then(res=> {
                        data = res.data;
                        if(data.retCode === 0) {
                            that.userList = data.data.data;
                            console.log('--会员列表--',that.userList)
                            that.total = parseInt(data.data.total);
                        } else {
                            that.$Message.warning(data.retMsg)
                        }
                    })
                    .catch(e => {

                    })
            },

            getLevelList() {    //分页获取等级列表
                let that = this;
                let url = this.serviceurl + '/backstage/level/pageLevelManage';
                let params = {
                    pageNo: that.pageNo1,
                    pageSize: 10,
                }
                let data = null;
                let levelList=[];
                that
                    .$http(url, params, data, "get")
                    .then(res=> {
                        data = res.data;
                        if(data.retCode === 0) {
                            levelList = levelList.concat(data.data.data);
                            if(levelList.length < data.data.retCode) {
                                that.pageNo1++;
                                that.getLevelList();
                            } else {
                                levelList.map(item => {
                                    that.levelList.push({
                                        value: item.id,
                                        label: item.levelName,
                                    })
                                })
                                levelList = [];
                            }
                        } else {
                            that.$Message.warning(data.retMsg)
                        }
                    })
                    .catch(e => {
                        that.$Message.error('请求错误')
                    })
            },

            choiceUser(row,index) {   //选择表格某一行
                this.userId = parseInt(row.id);
                this.levelId = row.levelId;
                this.parentId = row.recommenderId;
                this.start = row.status;
            },

            levelSetBtn() {     //设置用户等级
                let that = this;
                let url = that.serviceurl + '/backstage/userInfo/setUserLevel';
                let params;
                if(that.parentId === null || that.parentId === 'undefined' || that.parentId === '') {
                    params = {
                        userId: that.userId,
                        levelId: that.levelId,
                    }
                } else {
                    params = {
                        userId: that.userId,
                        levelId: that.levelId,
                        parentId: that.parentId,
                    }
                }
                that
                    .$http(url, params, '', 'get')
                    .then(res => {
                        console.log(res)
                        if(res.data.retCode === 0) {
                            that.$Message.success('用户等级修改成功！');
                            that.levelSet = false;
                            that.userId = null;
                            that.getUserList();
                        } else {
                            that.$Message.warning(res.data.retMsg);
                        }
                    })
                    .catch(e => {
                        that.$Message.error('请求错误');
                    })

            },

            statusChange(num) {   //修改用户状态
                if(this.userId === null) {
                    this.$Message.warning('请选择用户！')
                } else {
                    let that = this;
                    let url = that.serviceurl + '/backstage/userInfo/mdifyUserStatus';
                    let params = {
                        userId: that.userId,
                        status: num,
                    }
                    that
                        .$http(url, params, '', 'get')
                        .then(res => {
                            console.log(res)
                            if(res.data.retCode === 0) {
                                that.$Message.success('用户状态修改成功！');
                                that.start === 1?that.start=4:that.start=1;
                                that.userId = null;
                                that.getUserList();
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
.level-setting {
    font-size: 14px;
    p{
        padding-top: 10px;
        &:nth-child(1) {
            text-align: center;
            padding-top: 0;
            font-weight: 600;
            letter-spacing: 1px;
        }
        &:nth-child(3) {
            color: red;
            font-size: 12px;
            text-indent: 6em;
        }
    }
    .level-btn {
        text-align: center;
        margin-top: 20px;
    }
}
</style>