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
                        <Select v-model="levelId" style="width:130px">
                            <Option v-for="item in levelSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </p>
                    <p>
                        状态 &nbsp;&nbsp;
                        <Select v-model="state" style="width:130px">
                            <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </p>
                </div>
                <p>会员卡总数：152,610</p>
            </div>
            <div class="m-search-btn">
                <Button class="btn btn-blue" @click="searchMem">查询</Button>
            </div>
        </div>
        <div class="main-body">
            <Table class="cc-m-t-20" border :columns="table" :data="tableData"></Table>
            <div class="page"><Page class="cc-m-t-20" :total="total" :key="total" :current="current"  @on-change="changePage"></Page></div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                pageNo: 0,
                pageNo1: 0,
                current: 1,
                keyword: '',
                phone: '',
                shopName: '',
                levelId: -1,
                levelTotal: [],    //全部等级
                levelSelect: [
                    {
                        value: -1,
                        label: '全部'
                    }
                ],   //等级筛选
                state: -1,
                stateList: [
                    {
                        value: -1,
                        label: '全部'
                    },
                    {
                        value: 0,
                        label: '未领用'
                    },
                    {
                        value: 1,
                        label: '已领用'
                    }
                ],
                start: false,
                tableData: [],
                total: 0,
                table: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 60
                    },
                    {
                        title: '店铺ID',
                        align: 'center',
                        key: 'shopName'
                    },
                    {
                        title: '会员名称',
                        align: 'center',
                        key: 'memName'
                    },
                    {
                        title: '手机号码',
                        align: 'center',
                        key: 'phone'
                    },
                    {
                        title: '性别',
                        align: 'center',
                        key: 'gender',
                        width: 80,
                        render: (h,params) => {
                            return h('p',params.row.gender === '0'? '未知':(params.row.gender === '1'? '男':'女'))
                        }
                    },
                    {
                        title: '会员等级',
                        align: 'center',
                        key: 'levelName'
                    },
                    {
                        title: '会员卡号',
                        align: 'center',
                        key: 'code'
                    },
                    {
                        title: '会员卡ID',
                        align: 'center',
                        key: 'memCardId'
                    },
                    {
                        title: '余额',
                        align: 'center',
                        key: 'balance',
                        width: 70
                    },
                    {
                        title: '赠送金额',
                        align: 'center',
                        key: 'giveMoney',
                        width: 90
                    },
                    {
                        title: '实际充值金额',
                        align: 'center',
                        key: 'actualRechargeMoney',
                    },
                    {
                        title: '支付累计金额',
                        align: 'center',
                        key: 'totalPayMoney'
                    },
                    {
                        title: '消费累计金额',
                        align: 'center',
                        key: 'totalConsumeMoney',
                    },
                    {
                        title: '折扣累计金额',
                        align: 'center',
                        key: 'totalDiscountMoney'
                    },
                    {
                        title: '领用状态',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('p',{

                                },params.row.getStatus === 0 ? '未领用' : '已领用')
                            ])
                        }
                    },
                    {
                        title: '发卡时间',
                        align: 'center',
                        key: 'createTime'
                    }
                ]
            };
        },

        created () {
            this.getMenCard();
            this.getLevel();
        },

        methods: {
            changePage(val) {      //改变页码
                this.pageNo = val - 1;
                this.getMenCard();
            },

            getLevel() {   //获取全部等级
                let that = this;
                let url = this.serviceurl + '/backstage/level/pageLevelManage';
                let params = {
                    pageNo: that.pageNo1,
                    pageSize: 10,
                }
                let data = null;
                that
                    .$http(url, params, data, "get")
                    .then(res=> {
                        data = res.data;
                        if(data.retCode === 0) {
                            that.levelTotal = that.levelTotal.concat(data.data.data);
                            let total = parseInt(data.data.total);
                            if(that.levelTotal.length < total) {
                                that.pageNo1++;
                                that.getLevel();
                            }
                            that.levelTotal.map(i => {
                                that.levelSelect.push({
                                    value: i.id,
                                    label: i.levelName,
                                })
                            })
                            console.log(that.levelSelect)
                        } else {
                            that.$Message.warning(data.retMsg)
                        }
                    })
                    .catch(e => {
                        that.$Message.error('请求错误')
                    })
            },

            searchMem() {   //搜索
                this.pageNo = 0;
                this.getMenCard();
            },

            getMenCard() {   //会员卡查询
                let that = this;
                let url = that.serviceurl + '/backstage/userMem/pageUserMem';
                let levelId;
                let status;
                that.levelId === -1 ? levelId = '' : levelId = that.levelId;
                that.state === -1 ? status = '' : status = that.state;
                let params = {
                    keyword: that.keyword,
                    phone:that.phone,
                    shopName: that.shopName,
                    levelId: levelId,
                    status: status,
                    pageNo: that.pageNo,
                    pageSize: 10,
                }
                let data = null;
                that
                    .$http(url, params, data, 'get')
                    .then(res=> {
                        data = res.data;
                        if(data.retCode === 0) {
                            that.tableData = data.data.data;
                            that.total = parseInt(data.data.total);
                            console.log('会员卡', that.total);
                        } else {
                            that.$Message.warning(data.retMsg);
                        }
                    })
                    .catch(e=> {
                        that.$Message.error('请求错误!');
                    })
            },
        }
    };
</script>

<style lang="less" scoped>

</style>