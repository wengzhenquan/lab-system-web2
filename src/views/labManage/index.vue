<template>
    <div>
        <div class="search-title">
            <div><p>教室编号：</p><Input placeholder="关键字模糊搜索" style="width: 140px;margin-top: 8px" v-model="numb"/></div>
            <div><p>状态：</p>
                <Select v-model="state" style="width: 140px;margin-top: 8px">
                    <Option v-for="item in sortList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </div>
        </div>
        <div class="user-manage">
            <Button type="primary" @click="searchLab" >查询</Button>
            <Button type="primary" @click="isAdd = true" v-if="level === 0">添加实验室</Button>
        </div>
        <Table border ref="selection" :columns="columns4" :data="labList"></Table>
        <div style="margin-top: 20px; display: flex;justify-content: flex-end">
            <Page :total="total" :key="total" :current.sync="current" @on-change="pageChange" />
        </div>

        <!--添加实验室-->
        <Modal
                v-model="isAdd"
                title="添加实验室"
                @on-ok="addLab">
            <div>
                <Form :model="formItem" :label-width="80">
                    <FormItem label="教室编号：">
                        <Input v-model="formItem.numb"></Input>
                    </FormItem>
                    <FormItem label="教室名称：">
                        <Input v-model="formItem.romName"></Input>
                    </FormItem>
                    <FormItem label="教室描述：">
                        <Input v-model="formItem.content" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
                    </FormItem>
                    <FormItem label="使用状态：">
                        <RadioGroup v-model="formItem.state">
                            <Radio label="0" >空闲</Radio>
                            <Radio label="1" disabled>使用中</Radio>
                        </RadioGroup>
                    </FormItem>
                </Form>
            </div>
        </Modal>

        <!--修改实验室信息-->
        <Modal
                v-model="isEdit"
                title="修改实验信息"
                @on-ok="editLab">
            <div>
                <Form :model="formItem" :label-width="80">
                    <FormItem label="教室编号：">
                        <Input v-model="formItem.numb"></Input>
                    </FormItem>
                    <FormItem label="教室名称：">
                        <Input v-model="formItem.romName"></Input>
                    </FormItem>
                    <FormItem label="教室描述：">
                        <Input v-model="formItem.content" type="textarea" :autosize="{minRows: 3,maxRows: 5}"></Input>
                    </FormItem>
                    <FormItem label="使用状态：">
                        <RadioGroup v-model="formItem.state">
                            <Radio label="0">空闲</Radio>
                            <Radio label="1">使用中</Radio>
                        </RadioGroup>
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
                current: 1,
                labList: [],     //课程列表
                pageNo: 1,pageNo1: 1,
                total: 0,
                numb: null,
                columns4: [
                    {
                        title: '教室编号',
                        key: 'numb',
                        align: 'center'
                    },
                    {
                        title: '教室名称',
                        key: 'romName',
                        align: 'center'
                    },
                    {
                        title: '负责人',
                        key: 'name',
                        align: 'center'
                    },
                    {
                        title: '描述',
                        key: 'content',
                        align: 'center'
                    },
                    {
                        title: '使用状态',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('p', {
                                    style: {
                                        marginRight: '5px',
                                        display: params.row.state === 0? 'block': 'none'
                                    },
                                }, '空闲'),
                                h('p', {
                                    style: {
                                        marginRight: '5px',
                                        display: params.row.state === 1? 'block': 'none'
                                    },
                                }, '使用中'),
                            ]);
                        },
                        filters: [
                            {
                                label: '空闲',
                                value: 0
                            },
                            {
                                label: '使用中',
                                value: 1
                            },
                        ],
                        filterMultiple: false,
                        filterMethod (value, row) {
                            if (value === 0) {
                                return row.state === 0;
                            } else if (value === 1) {
                                return row.state === 1;
                            }
                        }
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
                                        marginRight: '5px',
                                        display: this.level === 0? 'block': 'none'
                                    },
                                    on: {
                                        click: () => {
                                            this.isEdit = true;
                                            this.formItem = params.row;
                                            this.formItem.state = String(this.formItem.state);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        display: this.level === 1? 'block': 'none'
                                    },
                                    on: {
                                        click: () => {
                                            // 申请实验室
                                        }
                                    }
                                }, '申请'),
                            ]);
                        }
                    }
                ],
                isAdd: false,
                isEdit: false,
                formItem: {
                    id:null,
                    numb: '',
                    romName: '',
                    content: '',
                    state: '0',
                    userId: JSON.parse(localStorage.getItem('loginInfo')).userId,
                },
                name: '',
                state: -1,
                sortList: [
                    {
                        value: -1,
                        label: '全部'
                    },
                    {
                        value: 0,
                        label: '空闲'
                    },
                    {
                        value: 1,
                        label: '使用中'
                    },
                ],    //查找条件
                userId: null,
            }
        },

        created() {
            this.getLabList();
            this.formItem.teacherUserId = JSON.parse(localStorage.getItem('loginInfo')).userId;
            this.level = parseInt(this.Cookies.get('access'));
        },

        methods: {
            //改变页数
            pageChange(val) {
                this.pageNo = val;
                this.getLabList();
            },

            searchLab() {
                this.pageNo = 1;
                this.getLabList();
            },

            //获取实验室列表
            getLabList() {
                let that = this;
                let url = that.BaseConfig + '/selectRomsAll';
                let numb;
                that.numb === null ? numb = '' : numb = that.numb;
                let state;
                that.state === -1 ? state = '' : state = that.state;
                let params = {
                    numb: numb,
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
                            that.labList = data.data.data;
                            that.labList.map(item => {
                                item.state = parseInt(item.state)
                            })
                            that.total = data.data.total;
                        } else {
                            that.$Message.error(data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

            //添加实验室
            addLab() {
                let that = this;
                let url = that.BaseConfig + '/insertRoms';
                that.formItem.state = parseInt(that.formItem.state);
                let data = that.formItem;
                that
                    .$http(url,'', data, 'post')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            that.$Message.success('创建实验室成功');
                            that.formItem = {
                                id:null,
                                numb: '',
                                romName: '',
                                content: '',
                                state: '0',
                                userId: JSON.parse(localStorage.getItem('loginInfo')).userId,
                            };
                            that.getLabList();
                        } else {
                            that.$Message.error(res.data.retMsg);
                        }
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },

            //修改实验室信息,修改负责人，在已有系统管理员中选择
            editLab() {
                let that = this;
                let url = that.BaseConfig + '/updateRoms';
                that.formItem.state = parseInt(that.formItem.state);
                that.formItem.userId = JSON.parse(localStorage.getItem('loginInfo')).userId;
                let data = that.formItem;
                that
                    .$http(url,'', data, 'post')
                    .then(res => {
                        if(res.data.retCode === 0) {
                            that.$Message.success('修改成功');
                            that.getLabList();
                        } else {
                            that.$Message.error(res.data.retMsg);
                        }
                        that.formItem = {
                            id:null,
                            numb: '',
                            romName: '',
                            content: '',
                            state: 0,
                            userId: JSON.parse(localStorage.getItem('loginInfo')).userId,
                        };
                    })
                    .catch(err => {
                        that.$Message.error('请求错误');
                    })
            },
        }
    }
</script>

<style lang="less" scoped>
</style>
