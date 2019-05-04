<template>
    <div class="box">
        <div class="search-title">
            <div>
                <div><p>设备类别：</p><Input placeholder="关键字模糊搜索" style="width: 140px;margin-top: 8px" v-model="typeName"/></div>
                <!--<div><p>教室名称：</p><Input style="width: 140px;margin-top: 8px" v-model="romName"/></div>-->
                <div><p>教室编号：</p><Input style="width: 140px;margin-top: 8px" v-model="romNumb"/></div>
                <div>
                    <p>设备状态：</p>
                    <Select v-model="status" style="width: 140px;margin-top: 8px">
                        <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </div>
            </div>
            <Button type="primary" @click="searchDeviceAll">搜索</Button>
        </div>
        <!--<div class="user-manage">-->
            <!--<Button type="primary" style="height: 33px;" @click="addDevi">添加设备</Button>-->
        <!--</div>-->

        <div style="margin-top: 10px">
            <Table border ref="selection" :columns="columns4" :data="devList"></Table>
            <div style="margin-top: 20px; display: flex;justify-content: flex-end">
                <Page :total="total" :key="total" :current.sync="current" @on-change="pageChange" />
            </div>
        </div>

        <!--添加设备-->
        <!--添加设备时不会分配教室-->
        <Modal
                v-model="isAdd"
                :title= "flag === 1? '添加设备':'编辑设备信息'"
                @on-ok="ok"
        >
            <div>
                <Form :model="equipment" :label-width="80">
                    <FormItem label="设备编号：" >
                        <Input v-model="equipment.serNumb" style="width:200px"></Input>
                    </FormItem>
                    <FormItem label="设备类型：">
                        <Select v-model="equipment.eqClassId" style="width:200px">
                            <Option v-for="item in devSortList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="维修时间：">
                        <Row>
                            <Col span="11">
                                <DatePicker type="date" placeholder="Select date" v-model="equipment.repairTimes"></DatePicker>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem label="设备状态：" v-if="flag === 1">
                        <RadioGroup v-model="state">
                            <Radio label="0">正常</Radio>
                            <Radio label="1" disabled>报修</Radio>
                            <Radio label="2" disabled>报废</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="设备状态：" v-if="flag === 2">
                        <RadioGroup v-model="state">
                            <Radio label="0">正常</Radio>
                            <Radio label="1" >报修</Radio>
                            <Radio label="2" >报废</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="购买时间：">
                        <Row>
                            <Col span="11">
                                <DatePicker type="date" placeholder="Select date" v-model="equipment.buyTime"></DatePicker>
                            </Col>
                        </Row>
                    </FormItem>
                </Form>

                <Modal
                        v-model="modal1"
                        title="设备分配"
                        @on-ok="selectRom">
                    <div style="display: flex">
                        <p style="line-height: 36px">选择教室：</p>
                        <Select v-model="equipment.romId" style="width: 140px;margin-top: 8px">
                            <Option v-for="item in selectLab" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </div>
                </Modal>

                <Modal v-model="modal2" width="360">
                    <p slot="header" style="color:#f60;text-align:center">
                        <Icon type="ios-information-circle"></Icon>
                        <span>删除确认</span>
                    </p>
                    <div style="text-align:center">
                        <p>您确定要删除该设备？</p>
                    </div>
                    <div slot="footer">
                        <Button type="error" size="large" long  @click="del">删除</Button>
                    </div>
                </Modal>
            </div>
        </Modal>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                current: 1,
                pageNo: 1, pageNo1: 1,pageNo2:1,
                total: 0,
                romName: '',
                typeName: '',
                romNumb: '',
                status: -1,
                statusList: [
                    {
                        value: -1,
                        label: '全部',
                    },
                    {
                        value: 0,
                        label: '正常',
                    },
                    {
                        value: 1,
                        label: '报修',
                    },
                    {
                        value: 2,
                        label: '报废',
                    },
                ],
                devList: [],   //设备
                sortList: [],
                devSortList: [], //设备分类
                isAdd: false,
                state: '0',
                flag: 1,    //1-添加，2-编辑
                modal1: false,
                modal2: false,
                labList: [],
                selectLab: [],
                equipment: {
                    serNumb: '',      //设备编号
                    eqClassId: null,  //类别
                    romId: null,      //分配教室
                    state: parseInt(this.state),         //设备状态 0-正常 1-保修  2-报废
                    buyTime: '',      //购买时间
                    updateTime: new Date().getTime(),   //更新时间
                    repairTimes: null,  //维修时间
                },
                equipmentId: null,
                columns4: [
                    {
                        title: '编号',
                        key: 'serNumb',
                        align: 'center',
                    },
                    {
                        title: '类别',
                        key: 'typeName',
                        align: 'center',
                    },
                    {
                        title: '设备名称',
                        key: 'eqName',
                        align: 'center'
                    },
                    {
                        title: '状态',
                        key: 'state',
                        align: 'center',
                        width: 80,
                        render: (h,params)=> {
                            return h('p',params.row.state === 0 ? '正常': (params.row.state === 1 ? '报修':'报废'))
                        }
                    },
                    {
                        title: '分配教室',
                        key: 'romNumb',
                        align: 'center',
                        render: (h,params)=> {
                            return h('p',params.row.romName === null ? '无': params.row.romName)
                        }
                    },
                    {
                        title: '购买时间',
                        key: 'buyTime',
                        align: 'center',
                    },
                    {
                        title: '更新时间',
                        key: 'updateTime',
                        align: 'center',
                    },
                    {
                        title: '操作',
                        key: 'action',
                        align: 'center',
                        width: 180,
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
                                            this.equipment = params.row;
                                            this.isAdd = true;
                                            this.flag = 2;
                                            this.equipment.state === 0? this.state = '0':(this.equipment.state === 1? this.state = '1':'2')
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal1 = true;
                                            this.equipment = params.row;
                                            this.equipment.state === 0? this.state = '0':(this.equipment.state === 1? this.state = '1':'2')
                                        }
                                    }
                                }, '分配'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.modal2 = true;
                                            this.equipmentId = params.row.id
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
            this.pageNo = 1;
            this.getDevSortList();    //获取设备类型列表
            this.getDevList();
            this.getLabList();
        },

        methods: {
            //改变页数
            pageChange(val) {
                this.pageNo = val;
                this.getDevList();
            },

            searchDeviceAll() {
                this.pageNo = 1;
                this.getDevList();
            },

            //获取全部设备列表
            getDevList() {
                let that = this;
                let url = that.BaseConfig + '/selectEquipmentUnallocated';
                let state;
                that.status === -1? state = '': state = that.status;
                let params = {
                    // romName: that.romName,
                    typeName: that.typeName,
                    romNumb: that.romNumb,
                    state: state,
                    pageNo: that.pageNo,
                    pageSize: 10,
                };
                let data = null;
                that
                    .$http(url, params, data, 'get')
                    .then(res => {
                        data = res.data;
                        if(data.retCode === 0) {
                            that.devList = data.data.data;
                            that.total = data.data.total;
                        } else {
                            that.$Message.error(data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

            //获取设备类型列表
            getDevSortList() {
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
                            that.sortList = that.sortList.concat(data.data.data);
                            console.log(res)
                            if(that.sortList.length < data.data.total) {
                                that.pageNo1++;
                                that.getDevSortList();
                            }
                            that.sortList.map(item => {
                                that.devSortList.push({
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

            addDevi() {
                this.isAdd = true;
                this.flag = 1;
                this.equipment= {
                    serNumb: '',
                    eqClassId: null,
                    romId: null,
                    state: 0,
                    buyTime: '',
                    updateTime: '',
                    repairTimes: null,
                }
            },

            ok() {
                if(this.flag === 1) {
                    this.addDev();
                } else {
                    this.editDev();
                }
            },

            //添加设备
            addDev() {
                let that = this;
                let url = that.BaseConfig + '/insertEquipment';
                that.equipment.buyTime = new Date(that.equipment.buyTime).getTime();
                that.equipment.updateTime = new Date().getTime();
                that.equipment.repairTimes = new Date(that.equipment.repairTimes).getTime();
                let data = that.equipment;
                that
                    .$http(url, '', data, 'post')
                    .then(res => {
                        console.log(res)
                        if(res.data.retCode === 0) {
                            that.$Message.success('添加设备成功');
                            that.isAdd = false;
                            this.getDevList();
                        } else {
                            that.$Message.error(res.data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

            editDev() {
                let that = this;
                let url = that.BaseConfig + '/updateEquipment';
                that.equipment.buyTime = new Date(that.equipment.buyTime).getTime();
                that.equipment.updateTime = new Date().getTime();
                that.equipment.state = parseInt(that.state);
                that.equipment.repairTimes = new Date(that.equipment.repairTimes).getTime();
                let data = that.equipment;
                that
                    .$http(url, '', data, 'post')
                    .then(res => {
                        console.log(res)
                        if(res.data.retCode === 0) {
                            that.$Message.success('修改设备信息成功！');
                            that.isAdd = false;
                            this.getDevList();
                        } else {
                            that.$Message.error(res.data.retMsg);
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
                            console.log(that.selectLab)
                        } else {
                            that.$Message.error(data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

            //分配教室
            selectRom() {
                let that = this;
                let url = that.BaseConfig + '/updateEquipment';
                that.equipment.buyTime = new Date(that.equipment.buyTime).getTime();
                that.equipment.updateTime = new Date().getTime();
                that.equipment.repairTimes = new Date(that.equipment.repairTimes).getTime();
                let data = that.equipment;
                console.log(data)
                that
                    .$http(url, '', data, 'post')
                    .then(res => {
                        console.log(res)
                        if(res.data.retCode === 0) {
                            that.$Message.success('设备分配成功！');
                            that.changeRom();   //修改教室状态
                            that.modal1 = false;
                            this.getDevList();
                        } else {
                            that.$Message.error(res.data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

            changeRom() {
                let that = this;
                let url = that.BaseConfig + '/updateRomState';
                let params = {
                    state: 1,
                    romId:that.equipment.romId
                };
                let data = null;
                that
                    .$http(url, params, data, 'get')
                    .then(res => {
                        data = res.data;
                    })
                    .catch(err => {

                    })
            },

            //删除
            del() {
                let that = this;
                let url = that.BaseConfig + '/deleteEquipment';
                let params = {
                    equipmentId: that.equipmentId
                };
                let data = null;
                that
                    .$http(url, params, data, 'get')
                    .then(res => {
                        data = res.data;
                        if(data.retCode === 0) {
                            that.$Message.success('删除成功！');
                            that.modal2 = false;
                            that.getDevList();
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
    .dev-manage {
        padding: 12px;
        .dev-search {
            border-radius: 10px;
            border: 1px solid #34a8ff;
            height: 70px;
            margin-bottom: 10px;
        }
    }
</style>
