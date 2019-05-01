<template>
    <div>
        <div class="cc-m-b-10 member-list-search">
            <div class="m-search-top">
                <div class="m-search-top-left">
                    <!-- <p>文章名称 &nbsp;&nbsp;<Input v-model="iName" placeholder="关键字模糊搜索" style="width: 110px" /></p> -->
                    <p>
                        状态 &nbsp;&nbsp;
                        <Select v-model="state" style="width:130px">
                            <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </p>
                    <p>
                        门店 &nbsp;&nbsp;
                        <Select v-model="shopId" style="width:130px">
                            <Option v-for="item in storeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </p>
                    <p>
                        页面类型 &nbsp;&nbsp;
                        <Select v-model="typeId" style="width:130px">
                            <Option v-for="item in typeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </p>
                </div>
            </div>
            <div class="m-search-btn">
                <Button class="btn btn-blue" @click="searchSource">查询</Button>
                <Button class="btn btn-blue" @click="bannerAdd(1)">新增</Button>
                <Button class="btn btn-blue" @click="bannerAdd(2)">编辑</Button>
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
                tableData: [],
                total: 0,
                bannerID: null,
                bannerInfo: [],
                iName: '',
                shopId:"",
                storeList:[],
                typeId:1,
                typeList:[
                    {
                        value: 1,
                        label: '首页'
                    }
                ],
                state: 1,
                stateList: [
                    // {
                    //     value: -1,
                    //     label: '全部'
                    // },
                    {
                        value: 1,
                        label: '启用'
                    },
                    {
                        value: 2,
                        label: '禁用'
                    }
                ],
                start: false,
                table: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 60
                    },
                    {
                        title: '图片名称',
                        align: 'center',
                        key: 'bannerName'
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
                        title: '点击图片链接',
                        align: 'center',
                        key: 'imageLink'
                    },
                    {
                        title: '图片地址',
                        align: 'center',
                        key: 'imageUrl',
                        render: (h, params) => {
                            return h('div', [
                                h('img',{
                                    attrs: {
                                        src: params.row.imageUrl,
                                        style: 'width: 40px;height: 40px;border-radius: 2px;'
                                    }
                                })
                            ])
                        }
                    },
                    {
                        title: '备注',
                        align: 'center',
                        key: 'remark'
                    },
                    {
                        title: '图片排序',
                        align: 'center',
                        key: 'sort'
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'status',
                        render: (h, params) => {
                            return h('p', params.row.status === 1 ? '启用' : '禁用')
                        }
                    },
                    {
                        title: '类型',
                        align: 'center',
                        key: 'type',
                        render: (h, params) => {
                            return h('p', params.row.type === 1 ? '首页' : '其他')
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
            this.getStoreList();   //获取门店列表
        },

        methods: {
            choiceUser(row,index) {   //选择表格某一行
                this.bannerID = row.id;
                this.bannerInfo = row;
            },
            changePage(val) {  //改变页码
                this.pageNo = val - 1;
                this.getBannerList();
            },

            bannerAdd (num) {
                if(num === 1) {
                    this.$router.push({
                        path: '/addBanner',
                        query: {
                            flag: num,
                        }
                    })
                } else {
                    if(this.bannerID === null) {
                        this.$Message.warning('请先选择操作对象！');
                    } else {
                        this.$router.push({
                            path: '/editBanner',
                            query: {
                                flag: num,
                                bannerInfo: this.bannerInfo,
                            }
                        })
                    }
                }
            },

            searchSource() {//搜索
                this.pageNo = 0;
                this.getBannerList();
            },
            getBannerList() {   //获取轮播列表
                let that = this;
                let url = that.serviceurl + '/herbsfoods/app/getBannerImageList';
                let status;
                that.state === -1 ? status = '': status = that.state;
                let params = {
                    shopId: that.shopId,
                    status:that.state,
                    type: that.typeId,
                }
                that
                    .$http(url, params, '', 'get')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            that.tableData = res.data.data;
                        } else {
                            that.$Message.warning(res.data.retMsg);
                        }
                    })
                    .catch(e => {
                        that.$Message.error('请求错误');
                    })
            },
            operationDelete() {     //删除
                let that = this;
                if(null === that.bannerID) {
                    that.$Message.warning('请先选择要删除的轮播！');
                } else {
                    let url = that.serviceurl + '/herbsfoods/admin/bannerImageDelete';
                    let params = { bannerImageId: that.bannerID};
                    that
                        .$http(url, params, '', 'get')
                        .then(res => {
                            if(res.data.retCode === 0) {
                                that.$Message.success('轮播删除成功！');
                                that.getBannerList();
                            } else {
                                that.$Message.warning(res.data.retMsg);
                            }
                        })
                        .catch(e => {
                            that.$Message.error('请求错误');
                        })
                }
            },
            getStoreList() {    
                let that = this;
                let url= that.serviceurl + '/backstage/shop/pageShop';
                let params = {
                    
                }
                that
                    .$http(url, params, '', 'get')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            that.shopId=res.data.data.data[0].id;
                            this.getBannerList();
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
            }
        }
    };
</script>

<style lang="less" scoped>
</style>