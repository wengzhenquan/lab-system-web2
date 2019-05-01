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
                        <Select v-model="level" style="width:130px">
                            <Option v-for="item in levelList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </p>
                    <p>
                        状态 &nbsp;&nbsp;
                        <Select v-model="status" style="width:130px">
                            <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </p>
                    <p>
                        支付方式 &nbsp;&nbsp;
                        <Select v-model="payMode" style="width:130px">
                            <Option v-for="item in payModeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </p>
                    <p>时间 &nbsp;&nbsp;<DatePicker type="datetimerange" placeholder="选择时间段" @on-change="changeTime" style="width: 150px;color: #444"></DatePicker></p>
                </div>
            </div>
            <div class="m-search-btn">
                <Button class="btn btn-blue" @click="searchOrder">查询</Button>
                <Button class="btn btn-blue" icon="md-download" :loading="exportLoading" @click="exportExcel">导出excel</Button>
            </div>
        </div>
        <div class="main-body">
            <Table class="cc-m-t-20" border :columns="table" :data="tableData" @on-select="selectOrder"></Table>
            <div class="page"><Page class="cc-m-t-20" :total="total" :key="total" :current="current" @on-change="changePage"></Page></div>
        </div>
    </div>
</template>

<script>
    import excel from '@/libs/excel';
    export default {
        data () {
            return {
                pageNo:0,
                pageNo1: 0,
                current: 1,
                total: 0,
                tableData: [],
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
                status: -1,
                stateList: [
                    {
                        value: -1,
                        label: '全部'
                    },
                    {
                        value: 0,
                        label: '未支付'
                    },
                    {
                        value: 1,
                        label: '支付部分'
                    },
                    {
                        value: 2,
                        label: '已支付/未使用'
                    },
                    {
                        value: 3,
                        label: '已使用'
                    },
                    {
                        value: 4,
                        label: '部分失败'
                    },
                    {
                        value: 5,
                        label: '全部失败'
                    }
                ],
                startTime: '',
                endTime: '',
                payMode: 0,
                payModeList: [
                    {
                        value: 0,
                        label: '全部'
                    },
                    {
                        value: 1,
                        label: '收益余额'
                    },
                    {
                        value: 2,
                        label: '微信'
                    },
                    {
                        value: 3,
                        label: '充值卡'
                    },
                    {
                        value: 4,
                        label: '组合支付'
                    }
                ],
                start: false,
                exportLoading: false,
                selectData: [],
                table: [
                    {
                        type: 'selection',
                        width: 60
                    },
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 70
                    },
                    {
                        title: '时间',
                        align: 'center',
                        key: 'orderTime'
                    },
                    {
                        title: '店铺名称',
                        align: 'center',
                        key: 'shopName'
                    },
                    {
                        title: '会员名称',
                        align: 'center',
                        key: 'userName'
                    },
                    {
                        title: '手机号码',
                        align: 'center',
                        key: 'phone',
                    },
                    {
                        title: '会员等级',
                        align: 'center',
                        key: 'levelName',
                    },
                    {
                        title: '总额',
                        align: 'center',
                        key: 'totalMoney',
                        width: 80
                    },
                    {
                        title: '现金支付',
                        align: 'center',
                        key: 'cashPay',
                        width: 100
                    },
                    {
                        title: '充值卡',
                        align: 'center',
                        key: 'memCardPay'
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'status',
                        render: (h,params) => {
                            let status = "";
                            switch (params.row.status) {
                                case 0:
                                    status = "未支付";
                                    break;
                                case 1:
                                    status = "支付部分";
                                    break;
                                case 2:
                                    status = "已支付/未使用";
                                    break;
                                case 3:
                                    status = "已使用";
                                    break;
                                case 4:
                                    status = "部分失败";
                                    break;
                                case 5:
                                    status = "全部失败";
                                    break;
                                    break;
                                default:
                                    break;
                            }
                            return h("div", [
                                h("p", {
                                    style: {
                                        color: status === 4 ? 'red': ( status === 5 ? 'red': '444'),
                                    }
                                },status)
                            ]);
                        }
                    },
                    {
                        title: '支付方式',
                        align: 'center',
                        key: 'payMode',
                        render: (h,params) => {
                            let payMode = "";
                            switch (params.row.payMode) {
                                case 1:
                                    payMode = "收益余额";
                                    break;
                                case 2:
                                    payMode = "微信";
                                    break;
                                case 3:
                                    payMode = "充值卡";
                                    break;
                                case 4:
                                    payMode = "组合";
                                    break;
                                    break;
                                default:
                                    break;
                            }
                            return h("div", [
                                h("p", {
                                    style: {
                                        color: payMode === 4 ? 'red': '444',
                                    }
                                },payMode)
                            ]);
                        }
                    },
                    {
                        title: '推广会员',
                        align: 'center',
                        key: 'recommenderName'
                    }
                ]
            };
        },

        created () {
            this.getLevelList();
            this.getOrders();
        },

        methods: {
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

            changePage(val) {  //改变页码
                this.pageNo = val - 1;
                this.getOrders();
            },

            searchOrder() {   //搜索
                this.pageNo = 0;
                this.getOrders();
            },

            changeTime(time) {   //选择时间段
                this.startTime = time[0];
                this.endTime = time[1];
                if(time[0] === '') {
                    this.startTime = '';
                }
                if(time[1] === '') {
                    this.endTime = '';
                }
            },

            getOrders() {    //获取订单列表  type订单类型：1充值订单 2消费订单 3定制订单
                let that = this;
                let url = that.serviceurl + '/backstage/order/pageOrder';
                let levelId;
                let status;
                let payMode;
                that.level === -1 ? levelId = '': levelId = that.level;
                that.status === -1 ? status = '' : status = that.status;
                that.payMode === 0 ? payMode = '' : payMode = that.payMode;
                let params = {
                    keyword: that.keyword,
                    phone: that.phone,
                    shopName: that.shopName,
                    levelId: levelId,
                    status: status,
                    startTime: that.startTime,
                    endTime: that.endTime,
                    payMode: payMode,
                    type: 2,
                    pageNo: that.pageNo,
                    pageSize: 10
                }
                that
                    .$http(url, params, '', 'get')
                    .then(res => {
                        console.log('--充值订单--',res);
                        if(res.data.retCode === 0) {
                            that.tableData = res.data.data.data;
                            that.total = parseInt(res.data.data.total);
                        } else {
                            that.$Message.warning(res.data.retMsg);
                        }
                    })
                    .catch(e => {
                        that.$Message.error('请求错误');
                    })
            },

            selectOrder(selection) {   //选择到的数据
                this.selectData = selection;
            },

            exportExcel () {   //导出excel
                if (this.selectData.length) {
                    this.exportLoading = true;
                    const params = {
                        title: ['时间', '店铺名称', '会员名称','手机号码','会员等级','总额','现金支付','充值卡','状态','支付方式','推广会员'],
                        key: ['orderTime', 'shopName', 'userName','phone','levelName','totalMoney','cashPay','memCardPay','status','payMode','recommenderName'],
                        data: this.selectData,
                        autoWidth: true,
                        filename: '消费订单'
                    };
                    excel.export_array_to_excel(params);
                    this.exportLoading = false;
                } else {
                    this.$Message.info('表格数据不能为空！');
                }
            },
        }
    };
</script>

<style lang="less" scoped>

</style>