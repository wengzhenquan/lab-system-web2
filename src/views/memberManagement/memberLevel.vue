<template>
    <div>
        <Tabs type="card" :animated="false" @on-click="tabChange">
            <TabPane label="会员等级">
                <div class="cc-m-b-10 member-list-search">
                    <div class="m-search-top">
                        <div class="m-search-top-left">
                            <p>等级名称 &nbsp;&nbsp;<Input v-model="keyword" placeholder="关键字模糊搜索" style="width: 110px" /></p>
                            <p>
                                状态 &nbsp;&nbsp;
                                <Select v-model="status" style="width:130px">
                                    <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </p>
                        </div>
                    </div>
                    <div class="m-search-btn">
                        <Button class="btn btn-blue" @click="searchLevel(1)">查询</Button>
                        <Button class="btn btn-blue" @click="isModal(1)">新增</Button>
                        <Button class="btn btn-blue" @click="isModal(2)">编辑</Button>
                        <Button class="btn btn-blue" @click="editStatus(1)" v-if="levelManageDto.status !== 1">启用</Button>
                        <Button class="btn btn-blue" @click="editStatus(2)" v-if="levelManageDto.status === 1">禁用</Button>
                        <Button class="btn btn-blue" @click="delLevel">删除</Button>
                    </div>
                </div>
                <div class="main-body">
                    <Table class="cc-m-t-20" border :columns="table" :data="levelList" @on-row-click="choiceUser" :highlight-row="true"></Table>
                    <div class="page"><Page class="cc-m-t-20" :total="total" :key="total" :current="current"  @on-change="changePage"></Page></div>
                </div>
                <Modal
                        v-model="modal"
                        :footer-hide="true"
                        :styles="{top: '30%'}">
                    <div class="add-member">
                        <p v-if="flag === 1">新增</p>
                        <p v-if="flag === 2">编辑</p>
                        <p>等级名称&nbsp;&nbsp;<Input v-model="levelManageDto.levelName" placeholder="输入等级名称，如：普通会员" /></p>
                        <p>直推奖励&nbsp;&nbsp;<Input v-model="levelManageDto.typeList[0].ratio" placeholder="输入奖励比例，如：8%输入8" /></p>
                        <p>间推奖励&nbsp;&nbsp;<Input v-model="levelManageDto.typeList[1].ratio" placeholder="输入奖励比例，如：8%输入8" /></p>
                        <p>市场补贴&nbsp;&nbsp;<Input v-model="levelManageDto.typeList[2].ratio" placeholder="输入奖励比例，如：8%输入8" /></p>
                        <p>公排奖励&nbsp;&nbsp;<Input v-model="levelManageDto.typeList[3].ratio" placeholder="输入奖励比例，如：8%输入8" /></p>
                        <div class="level-btn"><Button class="btn btn-blue" @click="addLevel">提交</Button></div>
                    </div>
                </Modal>
            </TabPane>

            <TabPane label="升级规则">
                <div class="cc-m-b-10 member-list-search">
                    <div class="m-search-top">
                        <p>状态 &nbsp;&nbsp;
                            <Select v-model="status" style="width:130px">
                                <Option v-for="item in stateList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </p>
                    </div>
                    <div class="m-search-btn">
                        <Button class="btn btn-blue" @click="searchLevel(2)">查询</Button>
                        <Button class="btn btn-blue" @click="isRuleModal(1)">新增</Button>
                        <Button class="btn btn-blue" @click="isRuleModal(2)">编辑</Button>
                        <Button class="btn btn-blue" @click="ruleStatusChange(1)" v-if="1 !== levelUpgradeRule.status">启用</Button>
                        <Button class="btn btn-blue" @click="ruleStatusChange(2)"  v-if="1 == levelUpgradeRule.status">禁用</Button>
                        <Button class="btn btn-blue" @click="delRule">删除</Button>
                    </div>
                </div>
                <div class="main-body">
                    <Table class="cc-m-t-20" border :columns="ruleTable" :data="ruleList" @on-row-click="choiceUser" :highlight-row="true"></Table>
                    <div class="page"><Page class="cc-m-t-20" :total="total" :key="total" :current="current"  @on-change="changePage"></Page></div>
                </div>
                <Modal
                        v-model="ruleModal"
                        :footer-hide="true"
                        :styles="{top: '30%'}">
                    <div class="add-member">
                        <p v-if="flag === 1">新增</p>
                        <p v-if="flag === 2">编辑</p>
                        <p>升级前等级&nbsp;&nbsp;
                            <Select v-model="levelUpgradeRule.levelId" style="width:70%;text-align:left">
                                <Option v-for="item in levelSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </p>
                        <p>升级后等级&nbsp;&nbsp;
                            <Select v-model="levelUpgradeRule.afterLevelId" style="width:70%;text-align:left">
                                <Option v-for="item in levelSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </p>
                        <p>充值金额&nbsp;&nbsp;<Input v-model="levelUpgradeRule.needMoney" placeholder="输入充值金额，如：1350" style="width: 70%;text-align:left" /></p>
                        <p>推广类型&nbsp;&nbsp;
                            <Select v-model="levelUpgradeRule.optType" style="width:70%;text-align:left">
                                <Option v-for="item in optTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </p>
                        <p>推广会员等级&nbsp;&nbsp;
                            <Select v-model="levelUpgradeRule.conditionLevelId" style="width:70%;text-align:left">
                                <Option v-for="item in levelSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </p>
                        <p>推广数量&nbsp;&nbsp;<Input v-model="levelUpgradeRule.num" placeholder="输入数量，如：5" style="width: 70%;text-align:left" /></p>
                        <div class="level-btn"><Button class="btn btn-blue" @click="submitUpGrade">提交</Button></div>
                    </div>
                </Modal>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                current: 1,
                pageNo: 0,
                total: 0,
                levelList: [],
                ruleList: [],   //会员升级规则
                status: 0,
                stateList: [
                    {
                        value: 0,
                        label: '全部'
                    },
                    {
                        value: 1,
                        label: '启用'
                    },
                    {
                        value: 2,
                        label: '禁用'
                    },
                ],     //状态
                pageNo1: 0,
                levelTotal: [],    //全部等级
                levelSelect: [],   //等级筛选
                optTypeList: [
                    {
                        value: 0,
                        label: '无',
                    },
                    {
                        value: 1,
                        label: '直推',
                    },
                    {
                        value: 2,
                        label: '伞下',
                    }
                ],
                levelUpgradeRule: {
                    levelId: null,
                    afterLevelId: null,
                    needMoney: null,
                    optType: 0,
                    conditionLevelId: null,
                    num: null,
                    createTime: '',
                },   //新增会员升级规则
                keyword: '',
                start: 1,
                modal: false, // 弹框
                levelManageDto: {
                    id: null,
                    levelName: '',
                    status: 1,
                    typeList: [
                        {typeName: "直推奖励",typeCode: "DIRECT_PUSH",ratio: null},
                        {typeName: "间推奖励",typeCode: "INDIRECT_PUSH",ratio: null},
                        {typeName: "市场补贴",typeCode: "MARKET_SUBSIDY",ratio: null},
                        {typeName: '公排奖励',typeCode: "PUBLIC_RANKING",ratio: null},
                    ],
                },
                ruleModal: false,
                flag: 1,             // 1-新增  2-编辑  3-状态
                levelId: null,      //等级Id
                tab:0,              //0-会员等级   1-会员升级规则
                table: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 60
                    },
                    {
                        title: '等级名称',
                        align: 'center',
                        key: 'levelName'
                    },
                    {
                        title: '直推奖励',
                        align: 'center',
                        key: 'typeName',
                        render: (h,params) => {
                            return h('p',
                                params.row.typeList.map(item=>{
                                    if(item.typeName === '直推奖励') {
                                        return item.ratio === 0 ? '无' : (item.ratio === null ? '无' : item.ratio+'%')
                                    }
                                })
                            )
                        }
                    },
                    {
                        title: '间推奖励',
                        align: 'center',
                        key: 'typeName',
                        render: (h,params) => {
                            return h('p',
                                params.row.typeList.map(item=>{
                                    if(item.typeName === '间推奖励') {
                                        return item.ratio === 0 ? '无' : (item.ratio === null ? '无' : item.ratio+'%')
                                    }
                                })
                            )
                        }
                    },
                    {
                        title: '市场补贴',
                        align: 'center',
                        key: 'typeName',
                        render: (h,params) => {
                            return h('p',
                                params.row.typeList.map(item=>{
                                    if(item.typeName === '市场补贴') {
                                        return item.ratio === 0 ? '无' : (item.ratio === null ? '无' : item.ratio+'%')
                                    }
                                })
                            )
                        }
                    },
                    {
                        title: '公排奖励',
                        align: 'center',
                        key: 'typeName',
                        render: (h,params) => {
                            return h('p',
                                params.row.typeList.map(item=>{
                                    if(item.typeName === '公排奖励') {
                                        return item.ratio === 0 ? '无' : (item.ratio === null ? '无' : item.ratio+'%')
                                    }
                                })
                            )
                        }
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'status',
                        render: (h,params) => {
                            return h('div', [
                                h('span',{
                                    style: {
                                        color: params.row.status === 1 ? '#444':'red',
                                    }
                                },params.row.status === 1 ? '启用':'禁用')
                            ])
                        }
                    },
                    {
                        title: '创建时间',
                        align: 'center',
                        key: 'createTime'
                    }
                ],
                ruleTable: [
                    {
                        title: '序号',
                        type: 'index',
                        align: 'center',
                        width: 60
                    },
                    {
                        title: '升级前等级',
                        align: 'center',
                        key: 'levelName'
                    },
                    {
                        title: '升级后等级',
                        align: 'center',
                        key: 'afterLevelName'
                    },
                    {
                        title: '充值金额',
                        align: 'center',
                        key: 'needMoney'
                    },
                    {
                        title: '推广类型',
                        align: 'center',
                        key: 'optType',
                        render: (h, params) => {
                            return h('div', [
                                h('p',{},
                                    params.row.optType === 0? '无': (params.row.optType === 1? '直推': '伞下'))
                            ])
                        }
                    },
                    {
                        title: '推广会员等级',
                        align: 'center',
                        key: 'conditionLevelName'
                    },
                    {
                        title: '推广数量',
                        align: 'center',
                        key: 'num'
                    },
                    {
                        title: '状态',
                        align: 'center',
                        key: 'status',
                        render: (h, params) => {
                            return h('div', [
                                h('p',{
                                    style:{
                                        color: params.row.status === 1? '#444': 'red'
                                    }
                                 }, params.row.status === 1? '启用': '禁用')
                            ])
                        }
                    },
                    {
                        title: '创建时间',
                        align: 'center',
                        key: 'createTime'
                    }
                ]
            };
        },

        created () {
            this.getLevelList();   //分页获取等级
            this.getLevel();
        },

        methods: {
            tabChange(name) {   //tab切换
                this.tab = name;
                if(name === 0) {
                    this.pageNo = 0;
                    this.total = 0;
                    this.current = 1;
                    this.getLevelList();
                }else {
                    this.pageNo = 0;
                    this.total = 0;
                    this.current = 1;
                    this.getGradeList();
                }
            },

            isModal (num) {    // 会员等级弹框
                this.flag = num;
                if (num=== 1 || (num === 2 && this.levelId !==null)) {
                    this.modal = true;
                } else {
                    this.$Message.warning('请先选择操作对象！');
                }
            },

            isRuleModal (num) {  // 升级规则弹框
                this.flag = num;
                if(num === 1) {
                    this.ruleModal = true;
                } else {
                    if(this.levelId === null) {
                        this.$Message.warning('请先现在操作对象！')
                    } else {
                        this.ruleModal = true;
                    }
                }
            },

            changePage(val) {      //改变页码
                this.pageNo = val - 1;
                this.getLevelList();
            },

            choiceUser(row,index) {   //选择表格某一行
                if(this.tab === 0) {    //在会员等级页
                    this.levelManageDto.id = row.id;
                    this.levelManageDto.levelName = row.levelName;
                    this.levelManageDto.status = row.status;
                    this.levelId = row.id;
                    row.typeList.map(item => {
                        if(item.typeName === '直推奖励') {
                            this.levelManageDto.typeList[0] = item;
                        } else if(item.typeName === '间推奖励') {
                            this.levelManageDto.typeList[1] = item;
                        } else if(item.typeName === '市场补贴') {
                            this.levelManageDto.typeList[2] = item;
                        } else if(item.typeName === '公排奖励') {
                            this.levelManageDto.typeList[3] = item;
                        }
                    });
                } else if(this.tab === 1){   //在会员升级规则页
                    this.levelUpgradeRule = row;
                    this.levelId = row.levelId;
                }
            },

            searchLevel(num) {  //搜索
                this.pageNo = 0;
                if(num === 1) {this.getLevelList()} else {this.getGradeList()}
            },

            getLevelList() {     //分页获取等级列表
                let that = this;
                let url = this.serviceurl + '/backstage/level/pageLevelManage';
                let status;
                if(that.status === 0) { status = ''} else { status = that.status}
                let params = {
                    keyword: that.keyword,
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
                            that.levelList = data.data.data;
                            console.log(that.levelList);
                            that.total = parseInt(data.data.total);
                            that.levelId = null;    //初始化
                            that.levelManageDto = {
                                levelName: '',
                                status: 1,
                                typeList: [
                                    {typeName: "直推奖励",typeCode: "DIRECT_PUSH",ratio: null},
                                    {typeName: "间推奖励",typeCode: "INDIRECT_PUSH",ratio: null},
                                    {typeName: "市场补贴",typeCode: "MARKET_SUBSIDY",ratio: null},
                                    {typeName: '公排奖励',typeCode: "PUBLIC_RANKING",ratio: null},
                                ],
                            };
                        } else {
                            that.$Message.warning(data.retMsg)
                        }
                    })
                    .catch(e => {
                        that.$Message.error('请求错误')
                    })
            },

            addLevel() {    //新增等级、修改等级信息、禁用、启用
                let that = this;
                let url = this.serviceurl + '/backstage/level/addOrModifyLevel';
                let data = that.levelManageDto;
                that
                    .$http(url, '', data, "post")
                    .then(res=> {
                        console.log(res)
                        if(res.data.retCode === 0) {
                            if(that.flag === 1) {
                                that.$Message.success('等级新增成功！');
                            } else if(that.flag === 2) {
                                that.$Message.success('等级修改成功！');
                            } else if(that.flag === 3) {
                                that.$Message.success('状态修改成功！');
                            }
                            that.modal = false;
                            that.getLevelList();
                        } else {
                            that.$Message.warning(res.data.retMsg)
                        }
                    })
                    .catch(e => {
                        that.$Message.error('请求错误')
                    })
            },

            editStatus(status) {    //禁用、启用
                if(this.levelId === null) {
                    this.$Message.warning('请先选择操作对象！');
                } else {
                    this.flag = 3;
                    this.levelManageDto.status = status;
                    this.addLevel();
                }
            },

            delLevel() {   //删除等级
                let that = this;
                if(that.levelId === null) {
                    that.$Message.warning('请先选择等级!');
                } else {
                    let url = this.serviceurl + '/backstage/level/delLevel';
                    let params = {levelId: that.levelId};
                    that
                        .$http(url, params, '', "get")
                        .then(res=> {
                            if(res.data.retCode === 0) {
                                that.$Message.success('删除等级成功！');
                                that.getLevelList();
                            } else {
                                that.$Message.warning(res.data.retMsg)
                            }
                        })
                        .catch(e => {
                            that.$Message.error('请求错误')
                        })
                }
            },

            getLevel() {   //升级规则，获取全部等级
                let that = this;
                let url = this.serviceurl + '/backstage/level/pageUpgrade';
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

            submitUpGrade() {   // 新增、编辑 会员升级规则
                let that = this;
                let url = this.serviceurl + '/backstage/level/addOrModifyUpgrade';
                if(that.flag === 1) {that.levelUpgradeRule.createTime = new Date().getTime()}
                if(that.flag === 2 || that.flag === 3) {that.levelUpgradeRule.updateTime = new Date().getTime()}
                let data = that.levelUpgradeRule;
                that
                    .$http(url, '', data, "post")
                    .then(res=> {
                        if(res.data.retCode === 0) {
                            if(that.flag === 1) {
                                that.$Message.success('等级新增成功！');
                            } else if(that.flag === 2) {
                                that.$Message.success('等级修改成功！');
                            } else if(that.flag === 3) {
                                that.$Message.success('状态修改成功！');
                            }
                            that.levelId = null;
                            that.levelUpgradeRule = {
                                levelId: null,
                                afterLevelId: null,
                                needMoney: null,
                                optType: 0,
                                conditionLevelId: null,
                                num: null,
                                createTime: '',
                            };
                            that.ruleModal = false;
                            that.getGradeList();
                        } else {
                            that.$Message.warning(res.data.retMsg)
                        }
                    })
                    .catch(e => {
                        that.$Message.error('请求错误')
                    })
            },

            getGradeList() {  //分页获取会员升级规则
                let that = this;
                let url = this.serviceurl + '/backstage/level/pageUpgrade';
                let status;
                if(that.status === 0) { status = ''} else { status = that.status}
                let params = {
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
                            that.ruleList = data.data.data;
                            that.total = parseInt(data.data.total);
                        } else {
                            that.$Message.warning(data.retMsg)
                        }
                    })
                    .catch(e => {
                        that.$Message.error('请求错误')
                    })
            },

            ruleStatusChange(status) {   //修改升级规则状态
                if(this.levelId === null) {
                    this.$Message.warning('请先选择操作对象！');
                } else {
                    this.flag = 3;
                    this.levelUpgradeRule.status = status;
                    this.submitUpGrade();
                }
            },

            delRule() {  //删除 会员升级规则
                let that = this;
                if(null == that.levelId || undefined == that.levelId) {
                    that.$Message.warning('请先选择等级!');
                } else {
                    let url = this.serviceurl + '/backstage/level/delUpgrade?levelId='+ that.levelId;
//                    let data = {levelId: that.levelId};
                    that
                        .$http(url, '', '', "post")
                        .then(res=> {
                            if(res.data.retCode === 0) {
                                that.$Message.success('删除升级规则成功！');
                                that.getGradeList();
                            } else {
                                that.$Message.warning(res.data.retMsg || '删除升级规则失败！')
                            }
                        })
                        .catch(e => {
                            that.$Message.error('请求错误')
                        })
                }
            },
        }
    };
</script>

<style lang="less" scoped>
    /deep/.ivu-tabs-bar {
        margin-bottom: 0;
    }
    .add-member {
        font-size: 14px;
        text-align: right;
        padding-right: 12%;
        p{
            padding-top: 10px;
            &:nth-child(1) {
                text-align: center;
                padding-top: 0;
                font-weight: 600;
                letter-spacing: 1px;
            }
            /deep/.ivu-input-wrapper{
                width: 75%;
            }
        }
        .level-btn {
            text-align: center;
            margin-top: 20px;
        }
    }
</style>